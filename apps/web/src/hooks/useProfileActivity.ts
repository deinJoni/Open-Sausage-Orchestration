/**
 * Hook to fetch profile activity history (text record changes)
 *
 * TODO: Real implementation should:
 * 1. Query subgraph NameLabel entities where subdomain.name = ensName
 * 2. Order by blockTimestamp desc
 * 3. Return array of changes with timestamp, txHash, key, value
 *
 * Query example:
 * ```graphql
 * query GetProfileActivity($subdomainName: String!) {
 *   nameLabels(
 *     where: { subdomain_: { name: $subdomainName } }
 *     orderBy: blockTimestamp
 *     orderDirection: desc
 *     first: 10
 *   ) {
 *     id
 *     key
 *     value
 *     blockTimestamp
 *     transactionHash
 *   }
 * }
 * ```
 */

import { TIME } from "@/lib/constants";

export type ProfileActivity = {
  key: string;
  value: string;
  timestamp: number;
  txHash: string;
  displayText: string;
};

export function useProfileActivity(ensName: string | null) {
  // TODO: Replace with real subgraph query
  // For now, return mock activity data
  const mockActivities: ProfileActivity[] = ensName
    ? [
        {
          key: "description",
          value: "Updated my bio to reflect new music style",
          timestamp: Date.now() - TIME.MS_PER_DAY, // 1 day ago
          txHash: "0xabc123...",
          displayText: "Updated bio",
        },
        {
          key: "avatar",
          value: "ipfs://QmNewAvatar123...",
          timestamp: Date.now() - TIME.MS_PER_2_DAYS, // 2 days ago
          txHash: "0xdef456...",
          displayText: "Changed avatar",
        },
        {
          key: "app.osopit.socials",
          value: JSON.stringify([{ platform: "spotify", url: "https://..." }]),
          timestamp: Date.now() - TIME.MS_PER_WEEK, // 1 week ago
          txHash: "0xghi789...",
          displayText: "Added Spotify link",
        },
        {
          key: "app.osopit.streaming",
          value: "true|twitch|artist1|artist2",
          timestamp: Date.now() - TIME.MS_PER_2_WEEKS, // 2 weeks ago
          txHash: "0xjkl012...",
          displayText: "Started streaming",
        },
      ]
    : [];

  return {
    activities: mockActivities,
    isLoading: false,
    error: null,
  };
}
