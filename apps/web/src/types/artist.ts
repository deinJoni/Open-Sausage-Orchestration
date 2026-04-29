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
