import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { encodeFunctionData, encodePacked, keccak256 } from "viem";
import {
  useAccount,
  useCapabilities,
  useChainId,
  usePublicClient,
  useSendCalls,
} from "wagmi";
import { L2RegistryABI } from "@/lib/abi/L2Registry";
import type { AllValidKeys } from "@/lib/constants";
import { L2_REGISTRY_ADDRESS } from "@/lib/contracts";

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
  const { address } = useAccount();
  const { sendCallsAsync } = useSendCalls();
  const publicClient = usePublicClient();
  const { data: capabilities } = useCapabilities();
  const chainId = useChainId();

  const mutation = useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    mutationFn: async (input: TextRecordsInput) => {
      if (!address) {
        toast.error("Please connect your wallet first");
        throw new Error("Wallet not connected");
      }

      toast.info("Updating profile data...");

      // Get baseNode from registry
      const baseNode = (await publicClient?.readContract({
        address: L2_REGISTRY_ADDRESS,
        abi: L2RegistryABI,
        functionName: "baseNode",
      })) as `0x${string}`;

      if (!baseNode) {
        throw new Error("Failed to fetch baseNode from registry");
      }

      // Extract label from ensName (e.g., "alice" from "alice.osopit.eth")
      const label = input.ensName.split(".")[0];

      // Calculate label hash
      const labelHash = keccak256(encodePacked(["string"], [label]));

      // Calculate node: keccak256(abi.encodePacked(baseNode, labelHash))
      const nodeHash = keccak256(
        encodePacked(["bytes32", "bytes32"], [baseNode, labelHash])
      );

      // iterate over all keys

      const multiCallData = input.textRecords.map(({ key, value }) =>
        encodeFunctionData({
          abi: L2RegistryABI,
          functionName: "setText",
          args: [nodeHash, key, value],
        })
      );

      // Execute multicall
      if (multiCallData.length === 0) {
        throw new Error("No text records to update");
      }

      const atomicBatchSupported =
        capabilities?.[chainId]?.atomic?.status === "supported";

      const result = await sendCallsAsync({
        calls: [
          {
            to: L2_REGISTRY_ADDRESS,
            abi: L2RegistryABI,
            functionName: "multicall",
            args: [multiCallData],
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
      return result;
    },
  });

  return mutation;
}
