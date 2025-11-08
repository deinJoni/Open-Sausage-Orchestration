import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { L2RegistryABI } from "@/lib/abi/l2-registry";
import type { BroadcastParams } from "@/lib/broadcast";
import {
  constructBroadcastPayload,
  validateBroadcastParams,
} from "@/lib/broadcast";
import { L2_REGISTRY_ADDRESS } from "@/lib/contracts";
import { parseContractError } from "@/lib/parse-contract-error";
import { calculateNodeHash } from "@/lib/utils";
import { useOwnedProfile } from "./use-owned-profile";

/**
 * Hook to update broadcast status via ENS setText
 *
 * @example
 * const updateBroadcast = useUpdateBroadcast();
 *
 * // Start broadcast
 * updateBroadcast.mutate({
 *   isLive: true,
 *   broadcastUrl: "https://twitch.tv/user",
 *   guestWalletAddresses: ["0x123...", "0x456..."]
 * });
 *
 * // End broadcast
 * updateBroadcast.mutate({
 *   isLive: false,
 *   broadcastUrl: "",
 *   guestWalletAddresses: []
 * });
 */
export function useUpdateBroadcast() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const ownedProfile = useOwnedProfile();

  const mutation = useMutation({
    mutationFn: async (params: BroadcastParams) => {
      if (!address) {
        toast.error("Please connect your wallet first");
        return;
      }

      if (!ownedProfile.data?.ensName) {
        toast.error("No ENS profile found. Please create a profile first");
        return;
      }

      try {
        // Validate broadcast parameters
        validateBroadcastParams(params);

        // Extract label from ensName (e.g., "alice" from "alice.osopit.eth")
        const label = ownedProfile.data?.ensName.split(".")[0];

        // Calculate nodeHash using ENS namehash
        const nodeHash = calculateNodeHash(label);

        // Construct broadcast payload
        const payload = constructBroadcastPayload(params);

        // Encode setText call
        const setTextData = encodeFunctionData({
          abi: L2RegistryABI,
          functionName: "setText",
          args: [nodeHash, "app.osopit.broadcast", payload],
        });

        // Execute via multicall
        toast.info(
          params.isLive ? "Starting broadcast..." : "Ending broadcast..."
        );

        const txHash = await writeContractAsync({
          address: L2_REGISTRY_ADDRESS,
          abi: L2RegistryABI,
          functionName: "multicall",
          args: [[setTextData]],
        });

        toast.info("Waiting for confirmation...");

        const receipt = await publicClient?.waitForTransactionReceipt({
          hash: txHash,
        });

        if (receipt?.status === "reverted") {
          throw new Error("Transaction failed");
        }

        toast.success(
          params.isLive ? "You're now live! 🔴" : "Broadcast ended"
        );
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
