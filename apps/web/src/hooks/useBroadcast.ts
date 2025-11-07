import { useQuery as useGqtyQuery } from "@/gqty";
import {
  _SubgraphErrorPolicy_,
  type Broadcast,
} from "@/gqty/schema.generated";

/**
 * Extract subdomain label from full ENS name
 * e.g., "kristjan.catmisha.eth" → "kristjan"
 */
function extractLabel(ensName: string): string {
  const parts = ensName.split(".");
  return parts[0];
}

/**
 * Hook to fetch active broadcast details for a user
 * Returns GQty Broadcast - use helpers from subgraphHelpers.ts to access data
 * Only call this when user.activeBroadcast exists
 */
export function useBroadcast(ensName?: string) {
  const { subdomains } = useGqtyQuery();

  if (!ensName) {
    return {
      data: null,
      isLoading: false,
      error: null,
    };
  }

  const label = extractLabel(ensName);

  const result = subdomains({
    where: {
      name: label,
    },
    first: 1,
    subgraphError: _SubgraphErrorPolicy_.deny,
  });

  const data: Broadcast | null =
    result && result.length > 0 ? result[0].owner?.activeBroadcast ?? null : null;

  return {
    data,
    isLoading: false,
    error: null,
  };
}
