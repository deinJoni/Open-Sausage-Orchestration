import { useState } from "react";
import { toast } from "sonner";

export function useUpdateStreaming() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (isLive: boolean, taggedArtists: string[] = []) => {
    setIsPending(true);

    // TODO: Replace with real ENS integration
    // Call setTextRecord on ENS resolver:
    // - app.osopit.streaming = isLive.toString()
    // - app.osopit.tags = taggedArtists.join(',')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("📡 Streaming status updated:", { isLive, taggedArtists });

    setIsPending(false);

    toast.success(isLive ? "You're now live! 🔴" : "Stream ended");
  };

  return {
    mutate,
    isPending,
  };
}
