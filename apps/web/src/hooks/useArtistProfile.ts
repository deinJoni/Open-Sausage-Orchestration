import { useQuery as useGqtyQuery } from "@/gqty";
import { _SubgraphErrorPolicy_ } from "@/gqty/schema.generated";
import type { ArtistProfile } from "@/types/artist";
import {
  getTextRecord,
  getSocials,
  resolveIPFS,
} from "@/utils/subgraphHelpers";

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
 * Queries the subgraph and transforms the data into ArtistProfile format
 */
export function useArtistProfile(ensName?: string) {
  const { subdomains, $refetch } = useGqtyQuery();

  if (!ensName) {
    return {
      data: undefined,
      isLoading: false,
      error: null,
      refetch: async () => {},
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

  // Transform subgraph data into ArtistProfile format
  const data: ArtistProfile | undefined =
    result && result.length > 0
      ? {
          bio: getTextRecord(result[0].textRecords(), "description"),
          avatar: resolveIPFS(getTextRecord(result[0].textRecords(), "avatar")),
          socials: getSocials(result[0].textRecords()),
        }
      : undefined;
        console.log("result",data);
  return {
    data,
    isLoading: false,
    error: null,
    refetch: $refetch,
  };
}
