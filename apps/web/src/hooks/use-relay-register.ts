import { useMutation } from "@tanstack/react-query";
import { useAccount, useSignMessage } from "wagmi";
import { REVERSE_REGISTRAR_ADDRESS } from "@/lib/contracts";
import {
  BASE_REVERSE_COIN_TYPE,
  buildSetNameMessageHash,
} from "@/lib/relayer/setname-signature";

type InviteData = {
  label: string;
  recipient: string;
  expiration: number;
  inviter: string;
  signature: string;
};

type RelayRegisterInput = {
  fullName: string;
  inviteData: InviteData;
};

type RelayRegisterSuccess = {
  registerHash: `0x${string}`;
  setNameHash: `0x${string}`;
};

type RelayRegisterPartial = {
  registerHash: `0x${string}`;
  setNameHash?: undefined;
  partial: true;
  reason: string;
};

export type RelayRegisterResult = RelayRegisterSuccess | RelayRegisterPartial;

/**
 * Error thrown when the relayer endpoint reports it cannot serve the request
 * for an operational reason (disabled, unfunded, register reverted). The
 * caller in `use-register-subdomain` catches this and falls through to the
 * user-paid path.
 */
export class RelayUnavailableError extends Error {
  readonly reason: string;
  readonly status: number;

  constructor(reason: string, status: number) {
    super(`Relayer unavailable: ${reason} (status ${status})`);
    this.name = "RelayUnavailableError";
    this.reason = reason;
    this.status = status;
  }
}

const SIGNATURE_VALIDITY_SECONDS = 600; // 10 minutes

/**
 * Layer 2 of the gasless onboarding flow.
 *
 * Asks the user for ONE EIP-191 signature authorizing the relayer to set
 * their reverse record, then POSTs to `/api/relay-register` which submits
 * both `registerWithInvite` and `setNameForAddrWithSignature` from the
 * server-side relayer wallet.
 *
 * Result variants:
 *   - full success → `{ registerHash, setNameHash }`
 *   - partial      → `{ registerHash, partial: true, reason }` — caller should
 *                    prompt the user to retry just `setName` themselves.
 *
 * Throws `RelayUnavailableError` for any operational failure that should
 * trigger the final user-paid fallback.
 */
export function useRelayRegister() {
  const account = useAccount();
  const signMessage = useSignMessage();

  const mutation = useMutation({
    mutationFn: async (
      input: RelayRegisterInput
    ): Promise<RelayRegisterResult> => {
      if (!account.address) {
        throw new Error("Wallet not connected");
      }

      const signatureExpiry = BigInt(
        Math.floor(Date.now() / 1000) + SIGNATURE_VALIDITY_SECONDS
      );
      const coinTypes = [BASE_REVERSE_COIN_TYPE];

      const messageHash = buildSetNameMessageHash({
        contract: REVERSE_REGISTRAR_ADDRESS,
        addr: account.address,
        signatureExpiry,
        name: input.fullName,
        coinTypes,
      });

      const signature = await signMessage.signMessageAsync({
        message: { raw: messageHash },
      });

      const response = await fetch("/api/relay-register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          inviteData: input.inviteData,
          setNameAuth: {
            fullName: input.fullName,
            coinTypes: coinTypes.map((value) => value.toString()),
            signatureExpiry: signatureExpiry.toString(),
            signature,
          },
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        registerHash?: `0x${string}`;
        setNameHash?: `0x${string}`;
        error?: string;
      };

      // 207 = register landed but setName failed. Return partial so caller
      // can prompt a user-paid setName retry.
      if (response.status === 207 && payload.registerHash) {
        return {
          registerHash: payload.registerHash,
          partial: true,
          reason: payload.error ?? "setname_failed",
        };
      }

      if (!response.ok) {
        throw new RelayUnavailableError(
          payload.error ?? "unknown",
          response.status
        );
      }

      if (!(payload.registerHash && payload.setNameHash)) {
        throw new RelayUnavailableError("malformed_response", response.status);
      }

      return {
        registerHash: payload.registerHash,
        setNameHash: payload.setNameHash,
      };
    },
  });

  return mutation;
}
