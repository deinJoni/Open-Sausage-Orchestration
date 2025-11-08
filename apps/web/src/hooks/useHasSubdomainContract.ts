import { useReadContract } from "wagmi";
import { L2_REGISTRY_ADDRESS } from "@/lib/contracts";
import { L2RegistryABI } from "@/lib/abi/L2Registry";

/**
 * Check if an address owns a subdomain by reading directly from the L2Registry contract
 * This is the source of truth and should be used alongside subgraph checks
 * to handle cases where the subgraph is out of sync
 */
export function useHasSubdomainContract(address: string | undefined) {
  const { data: balance, isLoading } = useReadContract({
    address: L2_REGISTRY_ADDRESS,
    abi: L2RegistryABI,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    hasSubdomain: balance ? balance > 0n : false,
    balance: balance ?? 0n,
    isLoading,
  };
}
