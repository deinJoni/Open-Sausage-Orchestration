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

export type ArtistProfile = {
  ensName: string;
  address: string;
  bio: string;
  avatar: string;
  socials: SocialLink[];
  isStreaming: boolean;
  streamUrl?: string;
  streamPlatform?: "twitch" | "youtube";
  taggedArtists: string[];
};
