"use client";

import { formatEther } from "viem";
import { useBalance } from "wagmi";

type UseWalletBalanceResult = {
  balance: string; // Raw balance in ETH as string
  balanceNum: number; // Balance as number for calculations
  balanceUSD: string | null; // Formatted USD value, null when ETH price unknown
  balanceUSDNum: number | null; // USD value as number, null when ETH price unknown
  formatted: string; // Formatted ETH value with symbol
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

/**
 * Hook to get wallet balance in ETH and USD
 * Uses wagmi useBalance with USD conversion.
 * Pass `null` for ethPriceUSD when the price feed is loading or unavailable —
 * USD fields will be `null` rather than silently using a stale fallback.
 */
export function useWalletBalance(
  address: `0x${string}` | undefined,
  ethPriceUSD: number | null
): UseWalletBalanceResult {
  const { data, isPending, isError, error, refetch } = useBalance({
    address,
  });

  const balanceWei = data?.value ?? BigInt(0);
  const balance = formatEther(balanceWei);
  const balanceNum = Number.parseFloat(balance);

  const balanceUSDNum = ethPriceUSD === null ? null : balanceNum * ethPriceUSD;
  const balanceUSD =
    balanceUSDNum === null
      ? null
      : balanceUSDNum.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const formatted = `${balanceNum.toFixed(4)} ETH`;

  return {
    balance,
    balanceNum,
    balanceUSD,
    balanceUSDNum,
    formatted,
    isLoading: isPending,
    isError,
    error: error as Error | null,
    refetch,
  };
}
