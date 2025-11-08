/**
 * Simple helper utilities for working with subgraph data
 * Uses GQty types directly - no transformations needed
 */

import {
  SOCIAL_KEYS,
  WEB3_SOCIAL_KEYS,
  isArtKey,
  getArtTitle,
} from "@/lib/constants";
import type { ArtPiece, SocialLink } from "@/types/artist";

type TextRecord = {
  key?: string;
  value?: string;
};

/**
 * Resolve IPFS URLs to HTTP gateway URLs
 */
export function resolveIPFS(url: string | undefined): string {
  if (!url) return "";

  if (url.startsWith("ipfs://")) {
    const hash = url.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${hash}`;
  }

  return url;
}

/**
 * Get a specific text record value by key
 */
export function getTextRecord(
  records: TextRecord[] | undefined,
  key: string,
): string {
  if (!records) return "";

  const record = records.find((r) => r.key === key);
  return record?.value ?? "";
}

/**
 * Parse social links from text records
 * Supports standard ENS social keys and Web3 social keys
 */
export function getSocials(records: TextRecord[] | undefined): SocialLink[] {
  if (!records) return [];

  const socials: SocialLink[] = [];

  for (const record of records) {
    const key = record.key;
    const value = record.value;

    if (!key || !value) continue;

    if (key === SOCIAL_KEYS.TWITTER) {
      socials.push({ platform: "twitter", url: value });
    } else if (key === SOCIAL_KEYS.GITHUB) {
      socials.push({ platform: "github", url: value });
    } else if (key === SOCIAL_KEYS.DISCORD) {
      socials.push({ platform: "discord", url: value });
    } else if (key === SOCIAL_KEYS.TELEGRAM) {
      socials.push({ platform: "telegram", url: value });
    } else if (key === WEB3_SOCIAL_KEYS.FARCASTER) {
      socials.push({ platform: "farcaster", url: value });
    } else if (key === WEB3_SOCIAL_KEYS.LENS) {
      socials.push({ platform: "lens", url: value });
    }
  }

  return socials;
}

/**
 * Parse art pieces from text records
 * Art keys follow the pattern: art.{customTitle}
 */
export function getArtPieces(records: TextRecord[] | undefined): ArtPiece[] {
  if (!records) return [];

  const artPieces: ArtPiece[] = [];

  for (const record of records) {
    const key = record.key;
    const value = record.value;

    if (!key || !value) continue;

    if (isArtKey(key)) {
      const title = getArtTitle(key);
      if (title) {
        artPieces.push({
          key: key as `art.${string}`,
          title: title,
          url: value,
        });
      }
    }
  }

  return artPieces;
}

/**
 * Derive stream platform from broadcast URL
 */
export function deriveStreamPlatform(
  url: string | undefined,
): "youtube" | "twitch" | undefined {
  if (!url) return undefined;

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return "youtube";
  }

  if (lowerUrl.includes("twitch.tv")) {
    return "twitch";
  }

  return undefined;
}
