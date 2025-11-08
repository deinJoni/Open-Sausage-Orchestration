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
 * Parse broadcast text record value
 * Format: "true|url|userId1|userId2|..."
 */
function parseBroadcast(value: string | undefined): {
  isLive: boolean;
  url?: string;
  taggedArtists?: string[];
} {
  if (!value) {
    return { isLive: false };
  }

  const parts = value.split("|");
  const isLive = parts[0] === "true";

  if (!isLive) {
    return { isLive: false };
  }

  return {
    isLive: true,
    url: parts[1] || undefined,
    taggedArtists: parts.slice(2).filter(Boolean),
  };
}

/**
 * Derive stream platform from broadcast URL
 */
function deriveStreamPlatform(
  url: string | undefined
): "youtube" | "twitch" | undefined {
  if (!url) {
    return;
  }

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return "youtube";
  }

  if (lowerUrl.includes("twitch.tv")) {
    return "twitch";
  }

  return;
}

/**
 * Hook to fetch a single artist profile by ENS name
 * Returns GQty subdomain data with streaming info
 */
export function useArtistProfile(ensName?: string) {
  const { subdomain, $state } = useGqtyQuery({ suspense: false });

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

  // Parse broadcast data
  const broadcastRecord = result
    ?.textRecords?.()
    ?.find((record) => record.key === "app.osopit.broadcast");
  const broadcast = parseBroadcast(broadcastRecord?.value);

  const data = {
    user: result?.owner,
    subdomain: result?.name,
    textRecords: result?.textRecords,
    isStreaming: broadcast.isLive,
    streamUrl: broadcast.url,
    streamPlatform: deriveStreamPlatform(broadcast.url),
    taggedArtists: broadcast.taggedArtists,
  };

  return {
    data,
    isLoading: $state.isLoading,
    error: $state.error,
  };
}

export type ArtistProfile = NonNullable<
  Awaited<ReturnType<typeof useArtistProfile>>["data"]
>;
