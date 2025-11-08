import { useQuery as useGqtyQuery } from "@/gqty";
import { _SubgraphErrorPolicy_ } from "@/gqty/schema.generated";

/**
 * Hook to check if a subdomain name is available for registration
 * Returns true if the subdomain does not exist, false if it's already taken
 * Note: label should be debounced before passing to this hook
 */
export function useCheckSubdomainAvailability(label: string | undefined) {
  const { subdomains } = useGqtyQuery({ suspense: false });

  if (!label || label.length === 0) {
    return {
      isAvailable: undefined,
      isChecking: false,
      error: false,
    };
  }

  try {
    const result = subdomains({
      where: {
        name: label,
      },
      first: 1,
      subgraphError: _SubgraphErrorPolicy_.deny,
    });

    // GQty returns a Proxy array even when there are no results
    // We need to access the actual data to check if it exists
    const firstResult = result?.[0];
    const hasRealData = firstResult?.id != null;
    const isAvailable = !hasRealData;

    return {
      isAvailable,
      isChecking: false,
      error: false,
    };
  } catch (error) {
    // Subgraph query failed
    return {
      isAvailable: undefined,
      isChecking: false,
      error: true,
    };
  }
}
