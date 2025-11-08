import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccount, useCapabilities, useSendCalls } from "wagmi";
import { L2RegistrarABI } from "@/lib/abi/L2Registrar";
import { L2_REGISTRAR_ADDRESS } from "@/lib/contracts";
import { parseContractError } from "@/lib/parseContractError";

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

/**
 * Hook to register a new subdomain using an invite
 *
 * @example
 * const registerSubdomain = useRegisterSubdomain();
 *
 * registerSubdomain.mutate({
 *   label: "alice",
 *   inviteData: {
 *     label: "alice",
 *     recipient: "0x...",
 *     expiration: 1234567890,
 *     inviter: "0x...",
 *     signature: "0x..."
 *   }
 * });
 */
export function useRegisterSubdomain() {
  const { address, chainId } = useAccount();
  const { sendCalls } = useSendCalls();
  const { data: capabilities } = useCapabilities();

  const mutation = useMutation({
    mutationFn: async (input: RegisterSubdomainInput) => {
      if (!address) {
        toast.error("Please connect your wallet first");
        throw new Error("Wallet not connected");
      }

      if (!chainId) {
        toast.error("Please connect to a network");
        throw new Error("No chain ID");
      }

      try {
        toast.info("Registering with invite...");

        // Check if atomic batch is supported
        const atomicBatchSupported =
          capabilities?.[chainId]?.atomicBatch?.supported;

        const result = await sendCalls({
          calls: [
            {
              abi: L2RegistrarABI,
              functionName: "registerWithInvite",
              to: L2_REGISTRAR_ADDRESS,
              args: [
                input.label,
                input.inviteData.recipient as `0x${string}`,
                BigInt(input.inviteData.expiration),
                input.inviteData.inviter as `0x${string}`,
                input.inviteData.signature as `0x${string}`,
              ],
            },
          ],
          ...(atomicBatchSupported && {
            capabilities: {
              atomicBatch: {
                supported: true,
              },
            },
          }),
        });

        toast.success("Registration initiated!");

        return result;
      } catch (error) {
        const errorMessage = parseContractError(error);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
  });

  return mutation;
}
