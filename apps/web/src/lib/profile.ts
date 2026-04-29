import { type ParsedBroadcast, parseBroadcastPayload } from "./broadcast";
import { getTextRecord } from "./utils";

export type TextRecord = {
  key: string;
  value: string;
};

export type ProfileInput = {
  ownerAddress: string;
  subdomain: { name: string; node: string } | null;
  rawTextRecords:
    | Array<{ key?: string | null; value?: string | null }>
    | null
    | undefined;
};

export type ArtistProfile = {
  address: string;
  subdomain: { name: string; node: string } | null;
  textRecords: TextRecord[];
  broadcast: ParsedBroadcast;
  // Back-compat fields (flattened from `broadcast`).
  // Prefer `broadcast` in new code.
  isStreaming: boolean;
  streamUrl?: string;
  streamPlatform?: "youtube" | "twitch";
  taggedArtists: string[];
};

function normalizeTextRecords(
  records: ProfileInput["rawTextRecords"]
): TextRecord[] {
  if (!records) {
    return [];
  }
  return records.map((record) => ({
    key: record?.key ?? "",
    value: record?.value ?? "",
  }));
}

/**
 * Build the canonical profile object from raw subgraph data.
 * Single source of truth for shape + broadcast parsing — used by both
 * server-side queries and client-side hooks.
 */
export function buildProfile(input: ProfileInput): ArtistProfile {
  const textRecords = normalizeTextRecords(input.rawTextRecords);
  const broadcastValue = getTextRecord(textRecords, "app.osopit.broadcast");
  const broadcast = parseBroadcastPayload(broadcastValue);

  return {
    address: input.ownerAddress,
    subdomain: input.subdomain,
    textRecords,
    broadcast,
    isStreaming: broadcast.isLive,
    streamUrl: broadcast.url ?? undefined,
    streamPlatform: broadcast.platform ?? undefined,
    taggedArtists: broadcast.taggedArtists,
  };
}
