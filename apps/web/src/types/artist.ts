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
    | "github";
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
