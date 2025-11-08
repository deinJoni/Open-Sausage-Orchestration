/**
 * Social link type for artist profiles
 * Used by getSocials() helper to parse text records
 */
export type SocialLink = {
  platform:
    | "spotify"
    | "soundcloud"
    | "twitch"
    | "youtube"
    | "twitter"
    | "instagram"
    | "custom"
    | "github"
    | "discord"
    | "telegram"
    | "farcaster"
    | "lens";
  label?: string;
  url: string;
};

/**
 * Artist profile type
 * Contains all editable profile information
 */
export type ArtistProfile = {
  bio?: string;
  avatar?: string;
  socials?: SocialLink[];
};

/**
 * Full artist profile with streaming information
 * Used for public artist pages
 */
export type FullArtistProfile = ArtistProfile & {
  ensName: string;
  isStreaming: boolean;
  streamUrl?: string;
  streamPlatform?: "youtube" | "twitch";
  taggedArtists?: string[];
};

/**
 * Individual social platform text record
 * Maps to ENS standard social keys (com.twitter, com.github, etc.)
 */
export type SocialPlatformRecord = {
  platform: SocialLink["platform"];
  url: string;
};

/**
 * Art piece stored in ENS text records
 * Key format: art.{customTitle}
 * Value: URL to mp3/mp4/image file
 */
export type ArtPiece = {
  key: `art.${string}`; // e.g., "art.MyTrackTitle"
  title: string; // extracted from key, e.g., "MyTrackTitle"
  url: string; // URL to the file
};
