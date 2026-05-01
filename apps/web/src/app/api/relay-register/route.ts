import { recoverMessageAddress } from "viem";
import { base } from "viem/chains";
import { z } from "zod";
import { L2RegistrarABI } from "@/lib/abi/l2-registrar";
import { ReverseRegistrarABI } from "@/lib/abi/reverse-registrar";
import {
  L2_REGISTRAR_ADDRESS,
  REVERSE_REGISTRAR_ADDRESS,
} from "@/lib/contracts";
import {
  getRelayerPublicClient,
  getRelayerWalletClient,
  isRelayerEnabled,
} from "@/lib/relayer/client";
import { rateLimit } from "@/lib/relayer/rate-limit";
import { buildSetNameMessageHash } from "@/lib/relayer/setname-signature";

const HEX_ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const HEX_BYTES = /^0x[a-fA-F0-9]+$/;

const Body = z.object({
  inviteData: z.object({
    label: z.string().min(1).max(63),
    recipient: z.string().regex(HEX_ADDRESS),
    expiration: z.number().int().positive(),
    inviter: z.string().regex(HEX_ADDRESS),
    signature: z.string().regex(HEX_BYTES),
  }),
  setNameAuth: z.object({
    fullName: z.string().min(3),
    coinTypes: z.array(z.string().regex(/^\d+$/)),
    signatureExpiry: z.string().regex(/^\d+$/),
    signature: z.string().regex(HEX_BYTES),
  }),
});

export async function POST(req: Request): Promise<Response> {
  if (!isRelayerEnabled()) {
    return Response.json(
      { error: "relayer_disabled" },
      { status: 503, headers: { "x-relayer-enabled": "false" } }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ipKey = ip || req.headers.get("x-real-ip") || "unknown";
  const ipLimit = rateLimit.perIp(ipKey);
  if (!ipLimit.allowed) {
    return Response.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: {
          "retry-after": String(Math.ceil((ipLimit.retryAfterMs ?? 0) / 1000)),
        },
      }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "bad_request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const recipient = parsed.data.inviteData.recipient as `0x${string}`;
  const recipientLimit = rateLimit.perRecipient(recipient);
  if (!recipientLimit.allowed) {
    return Response.json(
      { error: "already_registered_recently" },
      {
        status: 429,
        headers: {
          "retry-after": String(
            Math.ceil((recipientLimit.retryAfterMs ?? 0) / 1000)
          ),
        },
      }
    );
  }

  // Verify the setName signature recovers to the recipient — fail fast before
  // we burn relayer gas on a bad sig.
  const expiry = BigInt(parsed.data.setNameAuth.signatureExpiry);
  if (expiry * BigInt(1000) < BigInt(Date.now())) {
    return Response.json({ error: "signature_expired" }, { status: 400 });
  }

  const messageHash = buildSetNameMessageHash({
    contract: REVERSE_REGISTRAR_ADDRESS,
    addr: recipient,
    signatureExpiry: expiry,
    name: parsed.data.setNameAuth.fullName,
    coinTypes: parsed.data.setNameAuth.coinTypes.map(BigInt),
  });
  const recovered = await recoverMessageAddress({
    message: { raw: messageHash },
    signature: parsed.data.setNameAuth.signature as `0x${string}`,
  });
  if (recovered.toLowerCase() !== recipient.toLowerCase()) {
    return Response.json(
      { error: "invalid_setname_signature" },
      { status: 400 }
    );
  }

  const wallet = getRelayerWalletClient();
  const publicClient = getRelayerPublicClient();

  let registerHash: `0x${string}`;
  try {
    registerHash = await wallet.writeContract({
      chain: base,
      address: L2_REGISTRAR_ADDRESS,
      abi: L2RegistrarABI,
      functionName: "registerWithInvite",
      args: [
        parsed.data.inviteData.label,
        recipient,
        BigInt(parsed.data.inviteData.expiration),
        parsed.data.inviteData.inviter as `0x${string}`,
        parsed.data.inviteData.signature as `0x${string}`,
      ],
    });
  } catch (err) {
    return Response.json(
      { error: "register_failed", detail: String(err) },
      { status: 502 }
    );
  }

  // Wait for register confirmation. setName itself doesn't strictly require
  // the name to exist (reverse records don't verify forward ownership), but
  // we want a single durable success signal before promising the user it's
  // done — if register reverts, we don't want to broadcast a setName whose
  // reverse record will be misleading.
  try {
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: registerHash,
      timeout: 60_000,
    });
    if (receipt.status !== "success") {
      return Response.json(
        { error: "register_reverted", registerHash },
        { status: 502 }
      );
    }
  } catch (err) {
    return Response.json(
      { error: "register_timeout", registerHash, detail: String(err) },
      { status: 504 }
    );
  }

  let setNameHash: `0x${string}`;
  try {
    setNameHash = await wallet.writeContract({
      chain: base,
      address: REVERSE_REGISTRAR_ADDRESS,
      abi: ReverseRegistrarABI,
      functionName: "setNameForAddrWithSignature",
      args: [
        recipient,
        expiry,
        parsed.data.setNameAuth.fullName,
        parsed.data.setNameAuth.coinTypes.map(BigInt),
        parsed.data.setNameAuth.signature as `0x${string}`,
      ],
    });
  } catch (err) {
    // Register succeeded; setName failed. Return partial success so the
    // client can offer a user-paid retry of just setName.
    return Response.json(
      { registerHash, error: "setname_failed", detail: String(err) },
      { status: 207 }
    );
  }

  return Response.json({ registerHash, setNameHash });
}
