import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { L2RegistryABI } from "@/lib/abi/l2-registry";
import type { AllValidKeys } from "@/lib/constants";
import { L2_REGISTRY_ADDRESS } from "@/lib/contracts";
import { calculateNodeHash } from "@/lib/utils";

type TextRecordsInput = {
  ensName: string;
  textRecords: {
    key: AllValidKeys;
    value: string;
  }[];
};

/**
 * Hook to batch update ENS text records via multicall
 * Reusable for both profile creation and updates
 *
 * @example
 * const updateTextRecords = useUpdateTextRecords();
 *
 * // Update multiple records at once
 * updateTextRecords.mutate({
 *   ensName: "alice",
 *   textRecords: {
 *     description: "New bio",
 *     avatar: "ipfs://QmHash...",
 *     email: "alice@example.com",
 *     socials: {
 *       twitter: "https://twitter.com/alice",
 *       github: "https://github.com/alice"
 *     },
 *     artPieces: [
 *       { key: "art.MyFirstTrack", title: "MyFirstTrack", url: "ipfs://QmAbc..." },
 *       { key: "art.LivePerformance", title: "LivePerformance", url: "ipfs://QmDef..." }
 *     ]
 *   }
 * });
 */
export function useUpdateTextRecords() {
  const account = useAccount();
  const writeContract = useWriteContract();

  const mutation = useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    mutationFn: async (input: TextRecordsInput) => {
      if (!account.address) {
        toast.error("Please connect your wallet first");
        throw new Error("Wallet not connected");
      }

      toast.info("Updating profile data...");

      const label = input.ensName.split(".")[0];
      const nodeHash = calculateNodeHash(label);

      const multiCallData = input.textRecords.map(({ key, value }) =>
        encodeFunctionData({
          abi: L2RegistryABI,
          functionName: "setText",
          args: [nodeHash, key, value],
        })
      );

      if (multiCallData.length === 0) {
        throw new Error("No text records to update");
      }

      const hash = await writeContract.writeContractAsync({
        address: L2_REGISTRY_ADDRESS,
        abi: L2RegistryABI,
        functionName: "multicall",
        args: [multiCallData],
      });
      return hash;
    },
  });

  return mutation;
}
