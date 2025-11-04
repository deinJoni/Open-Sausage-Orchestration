import { useState } from "react";
import { toast } from "sonner";

export function useSendTip() {
	const [isPending, setIsPending] = useState(false);

	const mutate = async (ensName: string, amountEth: string) => {
		setIsPending(true);

		// TODO: Replace with real implementation:
		// 1. Resolve ENS name to address
		// 2. Use Wagmi's useSendTransaction to send ETH
		// 3. Wait for transaction confirmation
		// 4. Show success/error state

		// Simulate transaction
		await new Promise((resolve) => setTimeout(resolve, 2000));

		console.log(`💸 Sent ${amountEth} ETH to ${ensName}`);

		setIsPending(false);

		toast.success(`Gift sent to ${ensName}! 🎁`);
	};

	return {
		mutate,
		isPending,
	};
}
