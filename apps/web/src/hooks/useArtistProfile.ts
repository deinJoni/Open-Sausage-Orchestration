import { useState } from "react";
import type { ArtistProfile } from "@/types/artist";

// Mock data for development
const mockProfiles: Record<string, ArtistProfile> = {
  "nick.eth": {
    ensName: "nick.eth",
    address: "0x1234567890123456789012345678901234567890",
    bio: "Lead developer of ENS. Building the decentralized web.",
    avatar: "https://avatars.jakerunzer.com/nick.eth",
    socials: [
      { platform: "twitter", url: "https://twitter.com/nicksdjohnson" },
      { platform: "github", url: "https://github.com/arachnid" },
    ],
    isStreaming: true,
    streamUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    streamPlatform: "youtube",
    taggedArtists: ["vitalik.eth"],
  },
  "vitalik.eth": {
    ensName: "vitalik.eth",
    address: "0x2345678901234567890123456789012345678901",
    bio: "Ethereum co-founder. Building decentralized systems.",
    avatar: "https://avatars.jakerunzer.com/vitalik.eth",
    socials: [
      { platform: "twitter", url: "https://twitter.com/VitalikButerin" },
      { platform: "spotify", url: "https://open.spotify.com/artist/example" },
    ],
    isStreaming: true,
    streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    streamPlatform: "youtube",
    taggedArtists: ["nick.eth", "luc.eth"],
  },
  "luc.eth": {
    ensName: "luc.eth",
    address: "0x3456789012345678901234567890123456789012",
    bio: "VP of Operations at ENS Labs. Passionate about web3 music.",
    avatar: "https://avatars.jakerunzer.com/luc.eth",
    socials: [
      { platform: "twitter", url: "https://twitter.com/lucemans" },
      { platform: "twitch", url: "https://twitch.tv/lucemans" },
      { platform: "soundcloud", url: "https://soundcloud.com/example" },
    ],
    isStreaming: false,
    taggedArtists: [],
  },
};

export function useArtistProfile(ensName?: string) {
  const [isLoading] = useState(false);

  // TODO: Replace with real ENS integration
  // This should read text records from ENS:
  // - description → bio
  // - avatar → avatar URL
  // - app.osopit.streaming → isStreaming
  // - app.osopit.tags → taggedArtists
  // - app.osopit.socials → socials JSON

  const data = ensName ? mockProfiles[ensName] : undefined;

  return {
    data,
    isLoading,
    error: null,
  };
}
