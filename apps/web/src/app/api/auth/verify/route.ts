import { db, schema } from "@osopit/db";
import { sql } from "drizzle-orm";
import { SiweMessage } from "siwe";
import { z } from "zod";
import { getSessionStore } from "@/lib/auth/session";

const VerifyBody = z.object({
  message: z.string().min(1),
  signature: z.string().min(1),
});

export async function POST(req: Request): Promise<Response> {
  const session = await getSessionStore();
  if (!session.nonce) {
    return Response.json({ error: "missing_nonce" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = VerifyBody.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const siwe = new SiweMessage(parsed.data.message);
  const verification = await siwe
    .verify({ signature: parsed.data.signature, nonce: session.nonce })
    .catch((err: unknown) => ({
      success: false,
      error: err instanceof Error ? err.message : "verify_failed",
    }));

  if (!("success" in verification && verification.success)) {
    return Response.json({ error: "invalid_signature" }, { status: 401 });
  }

  const wallet = siwe.address.toLowerCase();

  await db
    .insert(schema.users)
    .values({ walletAddress: wallet, lastSeenAt: new Date() })
    .onConflictDoUpdate({
      target: schema.users.walletAddress,
      set: { lastSeenAt: sql`now()` },
    });

  session.walletAddress = wallet;
  session.nonce = undefined;
  await session.save();

  return Response.json({ ok: true, wallet });
}
