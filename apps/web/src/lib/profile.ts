import { type ParsedBroadcast, parseBroadcastPayload } from "./broadcast";
import {
  SOCIAL_KEYS,
  type SocialKey,
  WEB3_SOCIAL_KEYS,
  type Web3SocialKey,
} from "./constants";
import { getTextRecord, ipfsToHttp } from "./utils";

export type TextRecord = {
  key: string;
  value: string;
};

export type ProfileSocials = Partial<Record<SocialKey | Web3SocialKey, string>>;

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
  /** Resolved (IPFS → HTTPS) avatar URL; "" if none. */
  avatar: string;
  description: string;
  email: string;
  /** Personal website. */
  url: string;
  /** Resolved header/banner image URL; "" if none. */
  header: string;
  socials: ProfileSocials;
  broadcast: ParsedBroadcast;
  /** Raw records — only used by the profile edit form for diff/dirty tracking. */
  textRecords: TextRecord[];
  // Back-compat fields (flattened from `broadcast`).
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

function buildSocials(records: TextRecord[]): ProfileSocials {
  const socials: ProfileSocials = {};
  for (const key of SOCIAL_KEYS) {
    const value = getTextRecord(records, key);
    if (value) {
      socials[key] = value;
    }
  }
  for (const key of WEB3_SOCIAL_KEYS) {
    const value = getTextRecord(records, key);
    if (value) {
      socials[key] = value;
    }
  }
  return socials;
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
    avatar: ipfsToHttp(getTextRecord(textRecords, "avatar")),
    description: getTextRecord(textRecords, "description"),
    email: getTextRecord(textRecords, "email"),
    url: getTextRecord(textRecords, "url"),
    header: ipfsToHttp(getTextRecord(textRecords, "header")),
    socials: buildSocials(textRecords),
    broadcast,
    textRecords,
    isStreaming: broadcast.isLive,
    streamUrl: broadcast.url ?? undefined,
    streamPlatform: broadcast.platform ?? undefined,
    taggedArtists: broadcast.taggedArtists,
  };
}
