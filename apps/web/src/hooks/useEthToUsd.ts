import { useState } from "react";

export function useEthToUsd() {
	// TODO: Replace with real API call to CoinGecko or similar
	// Fetch current ETH/USD price and update periodically

	// Mock ETH price
	const [ethPrice] = useState(2500);

	const convertToUsd = (ethAmount: number): number => {
		return ethAmount * ethPrice;
	};

	return {
		ethPrice,
		convertToUsd,
		isLoading: false,
	};
}
