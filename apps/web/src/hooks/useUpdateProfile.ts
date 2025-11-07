import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi";
import { parseContractError } from "@/lib/parseContractError";
import type { SocialLink } from "@/types/artist";

type UpdateProfileInput = {
  ensName: string;
  bio?: string;
  avatar?: File | string;
  socials?: SocialLink[];
};

/**
 * Hook for updating existing profile ENS text records
 * Uses TanStack Query mutation for automatic loading state and error handling
 *
 * TODO: Real implementation should:
 * 1. Upload new avatar to IPFS if File provided
 * 2. Calculate ENS node hash from ensName
 * 3. Build multicall array with setText calls
 * 4. Execute L2Registry.multicall() transaction
 * 5. Wait for transaction confirmation
 *
 * Pattern follows useCreateProfile.ts but without registration step
 */
export function useUpdateProfile() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const mutation = useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      // TODO: Real implementation
      // Step 1: Upload avatar to IPFS if needed
      // let avatarUrl = "";
      // if (input.avatar instanceof File) {
      //   toast.info("Uploading avatar to IPFS...");
      //   const formData = new FormData();
      //   formData.append("file", input.avatar);
      //   const response = await fetch("/api/upload-ipfs", {
      //     method: "POST",
      //     body: formData,
      //   });
      //   const data = await response.json();
      //   avatarUrl = data.ipfsUrl;
      //   toast.success("Avatar uploaded!");
      // } else if (typeof input.avatar === "string") {
      //   avatarUrl = input.avatar;
      // }

      // Step 2: Calculate node hash
      // const baseNode = await publicClient.readContract({
      //   address: L2_REGISTRY_ADDRESS,
      //   abi: L2RegistryABI,
      //   functionName: "baseNode",
      // });
      // const label = input.ensName.split(".")[0];
      // const nodeHash = keccak256(encodePacked(["bytes32", "bytes32"], [baseNode, keccak256(toBytes(label))]));

      // Step 3: Build multicall array
      // const multicallData: `0x${string}`[] = [];

      // if (input.bio) {
      //   multicallData.push(encodeFunctionData({
      //     abi: L2RegistryABI,
      //     functionName: "setText",
      //     args: [nodeHash, ENS_TEXT_KEYS.DESCRIPTION, input.bio],
      //   }));
      // }

      // if (avatarUrl) {
      //   multicallData.push(encodeFunctionData({
      //     abi: L2RegistryABI,
      //     functionName: "setText",
      //     args: [nodeHash, ENS_TEXT_KEYS.AVATAR, avatarUrl],
      //   }));
      // }

      // if (input.socials && input.socials.length > 0) {
      //   multicallData.push(encodeFunctionData({
      //     abi: L2RegistryABI,
      //     functionName: "setText",
      //     args: [nodeHash, ENS_TEXT_KEYS.SOCIALS, JSON.stringify(input.socials)],
      //   }));
      // }

      // Step 4: Execute multicall transaction
      // toast.info("Updating profile...");
      // const txHash = await writeContractAsync({
      //   address: L2_REGISTRY_ADDRESS,
      //   abi: L2RegistryABI,
      //   functionName: "multicall",
      //   args: [multicallData],
      // });

      // Step 5: Wait for confirmation
      // await waitForTransactionReceipt({ hash: txHash });

      // Mock: Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      const errorMessage = parseContractError(error);
      toast.error(errorMessage);
    },
  });

  return mutation;
}
