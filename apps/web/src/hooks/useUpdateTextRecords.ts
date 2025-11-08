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
import { ENS_TEXT_KEYS } from "@/lib/constants";
import { L2_REGISTRY_ADDRESS } from "@/lib/contracts";
import { parseContractError } from "@/lib/parseContractError";
import type { SocialLink } from "@/types/artist";

type TextRecordsInput = {
  ensName: string; // e.g., "alice" (just the label) or "alice.osopit.eth" (full name)
  textRecords: {
    description?: string;
    avatar?: string;
    socials?: SocialLink[];
    broadcast?: string; // Pre-formatted broadcast payload
  };
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
 *     socials: [{ platform: "twitter", url: "..." }]
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
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <LIFE IS SHORT, CODE IS LONG>
    mutationFn: async (input: TextRecordsInput) => {
      if (!address) {
        toast.error("Please connect your wallet first");
        throw new Error("Wallet not connected");
      }

      try {
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

        // Build multicall data for setText calls
        const multicallData: `0x${string}`[] = [];

        // Add description
        if (input.textRecords.description) {
          multicallData.push(
            encodeFunctionData({
              abi: L2RegistryABI,
              functionName: "setText",
              args: [
                nodeHash,
                ENS_TEXT_KEYS.DESCRIPTION,
                input.textRecords.description,
              ],
            })
          );
        }

        // Add avatar
        if (input.textRecords.avatar) {
          multicallData.push(
            encodeFunctionData({
              abi: L2RegistryABI,
              functionName: "setText",
              args: [nodeHash, ENS_TEXT_KEYS.AVATAR, input.textRecords.avatar],
            })
          );
        }

        // Add socials - stored as JSON array in "app.osopit.socials" key
        if (input.textRecords.socials && input.textRecords.socials.length > 0) {
          multicallData.push(
            encodeFunctionData({
              abi: L2RegistryABI,
              functionName: "setText",
              args: [
                nodeHash,
                ENS_TEXT_KEYS.SOCIALS,
                JSON.stringify(input.textRecords.socials),
              ],
            })
          );
        }

        // Add broadcast
        if (input.textRecords.broadcast) {
          multicallData.push(
            encodeFunctionData({
              abi: L2RegistryABI,
              functionName: "setText",
              args: [
                nodeHash,
                ENS_TEXT_KEYS.BROADCAST,
                input.textRecords.broadcast,
              ],
            })
          );
        }

        // Execute multicall
        if (multicallData.length === 0) {
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
              args: [multicallData],
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

        toast.info("Waiting for confirmation...");

        toast.success("Profile updated successfully!");

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : parseContractError(error);
        toast.error(errorMsg);
        throw error;
      }
    },
  });

  return mutation;
}
