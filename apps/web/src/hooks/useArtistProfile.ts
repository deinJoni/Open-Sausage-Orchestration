import { useQuery as useGqtyQuery } from "@/gqty";
import { _SubgraphErrorPolicy_ } from "@/gqty/schema.generated";
import { calculateNodeHash } from "@/lib/utils";

/**
 * Extract subdomain label from full ENS name
 * e.g., "kristjan.catmisha.eth" → "kristjan"
 */
function extractLabel(ensName: string): string {
  const parts = ensName.split(".");
  return parts[0];
}

/**
 * Hook to fetch a single artist profile by ENS name
 * Returns GQty User - use helpers from subgraphHelpers.ts to access data
 */
export function useArtistProfile(ensName?: string) {
  const { subdomain, $state } = useGqtyQuery();

  if (!ensName) {
    return {
      data: undefined,
      isLoading: false,
      error: null,
    };
  }

  const label = extractLabel(ensName);
  const nodeHash = calculateNodeHash(label);

  const result = subdomain({
    id: nodeHash,
    subgraphError: _SubgraphErrorPolicy_.deny,
  });

  return {
    data: {
      user: result?.owner,
      subdomain: result?.name,
      textRecords: result?.textRecords,
    },
    isLoading: $state.isLoading,
    error: $state.error,
  };
}
