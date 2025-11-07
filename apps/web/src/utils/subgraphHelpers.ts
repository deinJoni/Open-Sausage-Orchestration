/**
 * Simple helper utilities for working with subgraph data
 * Uses GQty types directly - no transformations needed
 */

import type { SocialLink } from "@/types/artist";

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
 */
export function getSocials(records: TextRecord[] | undefined): SocialLink[] {
  if (!records) return [];

  const socials: SocialLink[] = [];

  for (const record of records) {
    const key = record.key;
    const value = record.value;

    if (!key || !value) continue;

    if (key === "com.twitter") {
      socials.push({ platform: "twitter", url: value });
    } else if (key === "com.github") {
      socials.push({ platform: "github", url: value });
    } else if (key === "com.discord") {
      socials.push({ platform: "custom", label: "Discord", url: value });
    } else if (key === "com.telegram") {
      socials.push({ platform: "custom", label: "Telegram", url: value });
    } else if (key === "social.farcaster") {
      socials.push({ platform: "custom", label: "Farcaster", url: value });
    } else if (key === "social.lens") {
      socials.push({ platform: "custom", label: "Lens", url: value });
    }
  }

  return socials;
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
