import { toast } from "sonner";
import { useAccount } from "wagmi";
import type { BroadcastParams } from "@/lib/broadcast";
import { constructBroadcastPayload } from "@/lib/broadcast";
import { useOwnedProfile } from "./use-owned-profile";
import { useUpdateTextRecords } from "./use-update-text-record";

/**
 * Hook to update broadcast status via ENS setText
 * Wraps useUpdateTextRecords for broadcast-specific UX
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
  const ownedProfile = useOwnedProfile();
  const updateTextRecords = useUpdateTextRecords();

  const mutate = (params: BroadcastParams) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!ownedProfile.data?.ensName) {
      toast.error("No ENS profile found. Please create a profile first");
      return;
    }

    const payload = constructBroadcastPayload(params);

    // Custom toast for broadcast-specific messaging
    toast.info(params.isLive ? "Starting broadcast..." : "Ending broadcast...");

    // Delegate to text record update hook
    updateTextRecords.mutate({
      ensName: ownedProfile.data.ensName,
      textRecords: [{ key: "app.osopit.broadcast", value: payload }],
    });
  };

  return {
    mutate,
    isPending: updateTextRecords.isPending,
    isSuccess: updateTextRecords.isSuccess,
    isError: updateTextRecords.isError,
    error: updateTextRecords.error,
  };
}
