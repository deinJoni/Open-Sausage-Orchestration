import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
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
	const { address } = useAccount();
	const { writeContractAsync } = useWriteContract();
	const publicClient = usePublicClient();

	const mutation = useMutation({
		mutationFn: async (input: RegisterSubdomainInput) => {
			if (!address) {
				toast.error("Please connect your wallet first");
				throw new Error("Wallet not connected");
			}

			try {
				toast.info("Registering with invite...");

				const txHash = await writeContractAsync({
					address: L2_REGISTRAR_ADDRESS,
					abi: L2RegistrarABI,
					functionName: "registerWithInvite",
					args: [
						input.label,
						input.inviteData.recipient as `0x${string}`,
						BigInt(input.inviteData.expiration),
						input.inviteData.inviter as `0x${string}`,
						input.inviteData.signature as `0x${string}`,
					],
				});

				toast.info("Waiting for registration confirmation...");

				const receipt = await publicClient?.waitForTransactionReceipt({
					hash: txHash,
				});

				if (receipt?.status === "reverted") {
					throw new Error("Registration transaction failed");
				}

				toast.success("Registration successful!");

				return {
					txHash,
					receipt,
				};
			} catch (error) {
				const errorMessage = parseContractError(error);
				toast.error(errorMessage);
				throw new Error(errorMessage);
			}
		},
	});

	return mutation;
}
