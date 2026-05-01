import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useAccount,
  useCapabilities,
  useSendCalls,
  useSwitchChain,
} from "wagmi";
import { base } from "wagmi/chains";
import {
  RelayUnavailableError,
  useRelayRegister,
} from "@/hooks/use-relay-register";
import { L2RegistrarABI } from "@/lib/abi/l2-registrar";
import { ReverseRegistrarABI } from "@/lib/abi/reverse-registrar";
import {
  L2_REGISTRAR_ADDRESS,
  REVERSE_REGISTRAR_ADDRESS,
} from "@/lib/contracts";
import { getEnsConfig } from "@/lib/ens-config";
import { parseContractError } from "@/lib/parse-contract-error";
import { getPaymasterCapability } from "@/lib/paymaster";

type InviteData = {
  label: string;
  recipient: string;
  expiration: number;
  inviter: string;
  signature: string;
};

type RegisterSubdomainInput = {
  label: string;
  inviteData: InviteData;
};

export type RegisterSubdomainMode = "paymaster" | "relay" | "user-pays";

export type RegisterSubdomainResult = {
  mode: RegisterSubdomainMode;
  /** Tx hash for the register call, when the path produced a discrete tx. */
  registerHash?: `0x${string}`;
  /** Tx hash for the setName call, when the path produced a discrete tx. */
  setNameHash?: `0x${string}`;
  /** sendCalls batch id, when the path used EIP-5792 batching (paymaster + user-pays). */
  batchId?: string;
};

/**
 * Register a subdomain via the gasless onboarding ladder:
 *
 *   Layer 1 — sponsored sendCalls (paymaster) — wallets that expose
 *     `paymasterService` via EIP-5792 capabilities AND a paymaster URL is
 *     configured. One wallet popup, zero gas.
 *
 *   Layer 2 — relayer — everyone else, when the relay endpoint is healthy.
 *     User signs ONE EIP-191 message authorizing the reverse-record set;
 *     server submits both contract calls. Zero gas, one signature.
 *
 *   Final fallback — original sendCalls without paymaster — used when both
 *     layers are unavailable. User pays for both calls.
 *
 * Errors thrown by any path are surfaced via `parseContractError` toast,
 * matching prior behavior.
 *
 * @example
 * const registerSubdomain = useRegisterSubdomain();
 *
 * registerSubdomain.mutate({
 *   label: "alice",
 *   inviteData: { label: "alice", recipient: "0x...", expiration: 123, inviter: "0x...", signature: "0x..." },
 * });
 */
export function useRegisterSubdomain() {
  const account = useAccount();
  const sendCalls = useSendCalls();
  const switchChain = useSwitchChain();
  const capabilities = useCapabilities({ chainId: base.id });
  const relayRegister = useRelayRegister();

  const mutation = useMutation({
    mutationFn: async (
      input: RegisterSubdomainInput
    ): Promise<RegisterSubdomainResult> => {
      if (!account.address) {
        toast.error("Please connect your wallet first");
        throw new Error("Wallet not connected");
      }

      try {
        if (account.chainId !== base.id) {
          toast.info("Switching wallet to Base...");
          await switchChain.switchChainAsync({ chainId: base.id });
        }

        const fullName = `${input.label}.${getEnsConfig().domain}`;

        const registerCall = {
          abi: L2RegistrarABI,
          functionName: "registerWithInvite" as const,
          to: L2_REGISTRAR_ADDRESS,
          args: [
            input.label,
            input.inviteData.recipient as `0x${string}`,
            BigInt(input.inviteData.expiration),
            input.inviteData.inviter as `0x${string}`,
            input.inviteData.signature as `0x${string}`,
          ] as const,
        };

        const setNameCall = {
          abi: ReverseRegistrarABI,
          functionName: "setName" as const,
          to: REVERSE_REGISTRAR_ADDRESS,
          args: [fullName] as const,
        };

        // ---------- Layer 1: paymaster-sponsored sendCalls ----------
        const paymaster = getPaymasterCapability(capabilities.data, base.id);
        if (paymaster) {
          toast.info("Claiming subdomain (gas sponsored)...");
          const result = await sendCalls.sendCallsAsync({
            chainId: base.id,
            calls: [registerCall, setNameCall],
            capabilities: {
              paymasterService: { url: paymaster.url },
            },
          });
          toast.success("Registration complete! Primary name set.");
          return { mode: "paymaster", batchId: result.id };
        }

        // ---------- Layer 2: server-side relayer ----------
        try {
          toast.info("Sign to claim — no gas required.");
          const relayResult = await relayRegister.mutateAsync({
            fullName,
            inviteData: input.inviteData,
          });

          if (relayResult.setNameHash) {
            toast.success("Registration complete! Primary name set.");
            return {
              mode: "relay",
              registerHash: relayResult.registerHash,
              setNameHash: relayResult.setNameHash,
            };
          }

          // Partial: register landed but server-side setName failed. Fall
          // back to a user-paid setName so we still leave the user with a
          // working primary name.
          toast.info(
            "Subdomain registered. Confirm in wallet to set as primary name."
          );
          const setNameResult = await sendCalls.sendCallsAsync({
            chainId: base.id,
            calls: [setNameCall],
          });
          toast.success("Primary name set.");
          return {
            mode: "relay",
            registerHash: relayResult.registerHash,
            batchId: setNameResult.id,
          };
        } catch (err) {
          if (!(err instanceof RelayUnavailableError)) {
            throw err;
          }
          // Relay unavailable — fall through to user-paid path.
          console.warn(
            `Relayer unavailable (${err.reason}); falling back to user-paid path.`
          );
        }

        // ---------- Final fallback: user pays both calls ----------
        toast.info("Registering subdomain and setting primary name...");
        const fallback = await sendCalls.sendCallsAsync({
          chainId: base.id,
          calls: [registerCall, setNameCall],
        });
        toast.success("Registration complete! Primary name set.");
        return { mode: "user-pays", batchId: fallback.id };
      } catch (error) {
        const errorMessage = parseContractError(error);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
  });

  return mutation;
}
