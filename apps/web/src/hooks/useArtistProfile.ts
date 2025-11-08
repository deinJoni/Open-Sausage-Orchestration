import { useQuery as useGqtyQuery } from "@/gqty";
import { _SubgraphErrorPolicy_ } from "@/gqty/schema.generated";
import type { ArtistProfile, FullArtistProfile } from "@/types/artist";
import {
  getTextRecord,
  getSocials,
  resolveIPFS,
  deriveStreamPlatform,
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
 * Parse broadcast text record value
 * Format: "true|url|userId1|userId2|..."
 */
function parseBroadcast(value: string | undefined): {
  isLive: boolean;
  url?: string;
  taggedArtists?: string[];
} {
  if (!value) return { isLive: false };

  const parts = value.split("|");
  const isLive = parts[0] === "true";
  
  if (!isLive) return { isLive: false };

  return {
    isLive: true,
    url: parts[1] || undefined,
    taggedArtists: parts.slice(2).filter(Boolean),
  };
}

/**
 * Hook to fetch a single artist profile by ENS name
 * Queries the subgraph and transforms the data into ArtistProfile format
 */
export function useArtistProfile(ensName?: string, includeStreaming = false) {
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
  let data: ArtistProfile | FullArtistProfile | undefined;
  
  if (result && result.length > 0) {
    const textRecords = result[0].textRecords();
    const baseProfile: ArtistProfile = {
      bio: getTextRecord(textRecords, "description"),
      avatar: resolveIPFS(getTextRecord(textRecords, "avatar")),
      socials: getSocials(textRecords),
    };

    if (includeStreaming) {
      const broadcastValue = getTextRecord(textRecords, "app.osopit.broadcast");
      const broadcast = parseBroadcast(broadcastValue);
      
      data = {
        ...baseProfile,
        ensName,
        isStreaming: broadcast.isLive,
        streamUrl: broadcast.url,
        streamPlatform: deriveStreamPlatform(broadcast.url),
        taggedArtists: broadcast.taggedArtists,
      } as FullArtistProfile;
    } else {
      data = baseProfile;
    }
  }

  return {
    data,
    isLoading: false,
    error: null,
    refetch: $refetch,
  };
}
