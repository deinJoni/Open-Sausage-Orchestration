/**
 * Mapping between SocialLink platform types and ENS text record keys
 * Used to transform UI social links into ENS text records
 */

import type { SocialLink } from "@/types/artist";
import type { AllValidKeys } from "./constants";

type SocialPlatform = Exclude<SocialLink["platform"], "custom">;

/**
 * Map social platform identifiers to their ENS text record keys
 */
export const SOCIAL_PLATFORM_TO_ENS_KEY: Record<SocialPlatform, AllValidKeys> =
  {
    twitter: "com.twitter",
    github: "com.github",
    discord: "com.discord",
    telegram: "com.telegram",
    spotify: "com.spotify",
    soundcloud: "com.soundcloud",
    youtube: "com.youtube",
    instagram: "com.instagram",
    twitch: "com.twitch",
    farcaster: "social.farcaster",
    lens: "social.lens",
  } as const;

/**
 * Convert array of social links to ENS text record format
 */
export function socialLinksToTextRecords(
  socials: SocialLink[]
): Array<{ key: AllValidKeys; value: string }> {
  const records: Array<{ key: AllValidKeys; value: string }> = [];

  for (const social of socials) {
    if (social.platform === "custom") {
      continue; // Skip custom links - they don't map to standard ENS keys
    }

    const ensKey = SOCIAL_PLATFORM_TO_ENS_KEY[social.platform];
    if (ensKey && social.url) {
      records.push({ key: ensKey, value: social.url });
    }
  }

  return records;
}
