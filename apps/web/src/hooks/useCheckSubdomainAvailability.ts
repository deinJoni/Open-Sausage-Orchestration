import { useDeferredValue } from "react";
import { useQuery as useGqtyQuery } from "@/gqty";
import { _SubgraphErrorPolicy_ } from "@/gqty/schema.generated";

/**
 * Hook to check if a subdomain name is available for registration
 * Returns true if the subdomain does not exist, false if it's already taken
 * Debounces queries to avoid overwhelming the subgraph
 */
export function useCheckSubdomainAvailability(label: string | undefined) {
  const { subdomains } = useGqtyQuery();

  // Debounce the label to avoid excessive queries while typing
  const deferredLabel = useDeferredValue(label);

  if (!deferredLabel || deferredLabel.length === 0) {
    return {
      isAvailable: undefined,
      isChecking: false,
      error: false,
    };
  }

  // Check if we're still waiting for debounced value
  const isChecking = label !== deferredLabel;

  try {
    const result = subdomains({
      where: {
        name: deferredLabel,
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
      isChecking,
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
