/**
 * Hook to fetch profile activity history (text record changes)
 * Queries textRecords from the subgraph and formats them for display
 */

import { useQuery as useGqtyQuery } from "@/gqty";
import { _SubgraphErrorPolicy_, OrderDirection, TextRecord_orderBy } from "@/gqty/schema.generated";

export type ProfileActivity = {
  key: string;
  timestamp: number;
  txHash: string;
  displayText: string;
};

/**
 * Extract subdomain label from full ENS name
 * e.g., "kristjan.catmisha.eth" → "kristjan"
 */
function extractLabel(ensName: string): string {
  const parts = ensName.split(".");
  return parts[0];
}

/**
 * Generate human-readable display text for a text record change
 */
function getDisplayText(key: string): string {
  // Profile fields
  if (key === "description") return "Updated bio";
  if (key === "avatar") return "Changed avatar";
  
  // Social links
  if (key === "app.osopit.socials") return "Updated social links";
  
  // Streaming
  if (key === "app.osopit.broadcast") return "Updated streaming status";
  
  // Generic text record
  return `Updated ${key}`;
}

export function useProfileActivity(ensName: string | null) {
  const { textRecords, $refetch } = useGqtyQuery();

  if (!ensName) {
    return {
      activities: [] as ProfileActivity[],
      isLoading: false,
      error: null,
      refetch: async () => {},
    };
  }

  const label = extractLabel(ensName);

  // Query text records for this subdomain, ordered by most recent first
  const records = textRecords({
    where: {
      subdomain_: {
        name: label,
      },
    },
    orderBy: TextRecord_orderBy.updatedAt,
    orderDirection: OrderDirection.desc,
    first: 10,
    subgraphError: _SubgraphErrorPolicy_.deny,
  });

  // Transform text records into activity feed items (one row per text record)
  const activities: ProfileActivity[] = records
    ? records.map((record) => {
        const blockTimestamp = record.blockTimestamp ? Number(record.blockTimestamp) : 0;
        const updatedAt = record.updatedAt ? Number(record.updatedAt) : 0;
        const timestamp = (blockTimestamp || updatedAt) * 1000; // Convert to milliseconds
        const txHash = record.transactionHash?.toString() || "";
        const key = record.key || "";

        return {
          key,
          timestamp,
          txHash,
          displayText: getDisplayText(key),
        };
      })
    : [];

  return {
    activities,
    isLoading: false,
    error: null,
    refetch: $refetch,
  };
}
