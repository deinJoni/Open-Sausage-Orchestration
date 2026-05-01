import { env } from "@/env";

/**
 * Shape returned by `wallet_getCapabilities` per ERC-5792. Wagmi's
 * `useCapabilities` types this loosely, so we narrow defensively here.
 */
type ChainCapabilities = {
  paymasterService?: {
    supported?: boolean;
  };
};

type CapabilitiesData = Record<string | number, ChainCapabilities> | undefined;

/**
 * Decide whether Layer 1 (sponsored sendCalls) is available for the given
 * chain.
 *
 * Returns the paymaster URL to pass into `sendCalls({ capabilities: { paymasterService: { url } } })`,
 * or `null` if either:
 *   - `NEXT_PUBLIC_PAYMASTER_URL` is unset (Layer 1 disabled by config)
 *   - the connected wallet does not advertise `paymasterService.supported = true`
 *     for the target chain (wallet doesn't speak ERC-7677)
 *
 * Callers should treat `null` as "fall through to Layer 2".
 */
export function getPaymasterCapability(
  capabilities: CapabilitiesData,
  chainId: number
): { url: string } | null {
  const url = env.NEXT_PUBLIC_PAYMASTER_URL;
  if (!url) {
    return null;
  }

  const chainCaps = capabilities?.[chainId] ?? capabilities?.[String(chainId)];
  if (chainCaps?.paymasterService?.supported !== true) {
    return null;
  }

  return { url };
}
