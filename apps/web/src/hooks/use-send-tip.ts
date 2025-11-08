import { useState } from "react";
import { toast } from "sonner";

export function useSendTip() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (ensName: string, _amountEth: string) => {
    setIsPending(true);

    // TODO: Replace with real implementation:
    // 1. Resolve ENS name to address
    // 2. Use Wagmi's useSendTransaction to send ETH
    // 3. Wait for transaction confirmation
    // 4. Show success/error state

    // Simulate transaction
    await Promise.resolve();

    setIsPending(false);

    toast.success(`Gift sent to ${ensName}! 🎁`);
  };

  return {
    mutate,
    isPending,
  };
}
