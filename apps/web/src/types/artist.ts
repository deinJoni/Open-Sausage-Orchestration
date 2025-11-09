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
