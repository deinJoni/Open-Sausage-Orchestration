import { useReadContract } from "wagmi";
import { L2RegistrarABI } from "@/lib/abi/l2-registrar";
import { L2_REGISTRAR_ADDRESS } from "@/lib/contracts";

/**
 * Hook to check if a subdomain name is available for registration
 * Calls L2Registrar.available() directly onchain for real-time availability
 * Returns true if the subdomain is available, false if it's already taken
 * Note: label should be debounced before passing to this hook
 */
export function useCheckSubdomainAvailability(label: string | undefined) {
  const {
    data: isAvailable,
    isLoading,
    isError,
  } = useReadContract({
    address: L2_REGISTRAR_ADDRESS,
    abi: L2RegistrarABI,
    functionName: "available",
    args: label && label.length > 0 ? [label] : undefined,
    query: {
      enabled: !!label && label.length > 0,
    },
  });

  return {
    isAvailable,
    isChecking: isLoading,
    error: isError,
  };
}
