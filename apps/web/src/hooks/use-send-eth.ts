"use client";

import { parseEther } from "viem";
import { normalize } from "viem/ens";
import { useSendTransaction } from "wagmi";
import { publicClient } from "@/lib/wagmi";

type UseSendEthParams = {
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (error: Error) => void;
};

type UseSendEthResult = {
  sendEth: (params: {
    to: string; // ENS name or address
    amount: string; // ETH amount as string (e.g., "0.01")
  }) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash: `0x${string}` | undefined;
};

/**
 * Hook to send ETH to an address or ENS name
 * Handles ENS resolution automatically
 *
 * @param params.onSuccess - Callback when transaction is sent successfully
 * @param params.onError - Callback when transaction fails
 */
export function useSendEth(params?: UseSendEthParams): UseSendEthResult {
  const {
    sendTransaction,
    isPending,
    isSuccess,
    isError,
    error,
    data: hash,
  } = useSendTransaction({
    mutation: {
      onSuccess: (txHash) => {
        params?.onSuccess?.(txHash);
      },
      onError: (err) => {
        params?.onError?.(err as Error);
      },
    },
  });

  const sendEth = async ({ to, amount }: { to: string; amount: string }) => {
    try {
      // Check if input is ENS name or address
      let resolvedAddress: `0x${string}`;

      if (to.endsWith(".eth")) {
        // Resolve ENS name
        const ensAddress = await publicClient.getEnsAddress({
          name: normalize(to),
        });

        if (!ensAddress) {
          throw new Error(`Could not resolve ENS name: ${to}`);
        }

        resolvedAddress = ensAddress;
      } else {
        // Assume it's already an address
        resolvedAddress = to as `0x${string}`;
      }

      // Parse amount to Wei
      const value = parseEther(amount);

      // Send transaction
      sendTransaction({
        to: resolvedAddress,
        value,
      });
    } catch (err) {
      params?.onError?.(err as Error);
      throw err;
    }
  };

  return {
    sendEth,
    isPending,
    isSuccess,
    isError,
    error: error as Error | null,
    hash,
  };
}
