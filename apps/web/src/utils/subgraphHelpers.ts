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
 * Socials are stored as JSON array in "app.osopit.socials" key
 */
export function getSocials(records: TextRecord[] | undefined): SocialLink[] {
  if (!records) return [];

  // Find the app.osopit.socials record
  const socialsRecord = records.find((r) => r.key === "app.osopit.socials");
  
  if (!socialsRecord?.value) return [];

  try {
    // Parse the JSON array
    const parsed = JSON.parse(socialsRecord.value);
    if (Array.isArray(parsed)) {
      return parsed as SocialLink[];
    }
    return [];
  } catch (error) {
    console.error("Failed to parse socials JSON:", error);
    return [];
  }
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
