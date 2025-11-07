import { useState } from "react";
import type { ArtistProfile } from "@/types/artist";

// Mock active streamers
const mockActiveStreamers: ArtistProfile[] = [
  {
    ensName: "nick.eth",
    address: "0x1234567890123456789012345678901234567890",
    bio: "Lead developer of ENS. Building the decentralized web.",
    avatar: "https://avatars.jakerunzer.com/nick.eth",
    socials: [
      { platform: "twitter", url: "https://twitter.com/nicksdjohnson" },
    ],
    isStreaming: true,
    streamUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    streamPlatform: "youtube",
    taggedArtists: ["vitalik.eth"],
  },
  {
    ensName: "vitalik.eth",
    address: "0x2345678901234567890123456789012345678901",
    bio: "Ethereum co-founder. Building decentralized systems.",
    avatar: "https://avatars.jakerunzer.com/vitalik.eth",
    socials: [
      { platform: "twitter", url: "https://twitter.com/VitalikButerin" },
    ],
    isStreaming: true,
    streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    streamPlatform: "youtube",
    taggedArtists: ["nick.eth", "luc.eth"],
  },
];

export function useActiveStreamers() {
  const [isLoading] = useState(false);

  // TODO: Replace with The Graph integration
  // Query subgraph for artists where app.osopit.streaming = "true"
  // Then resolve full ENS profiles for each

  return {
    data: mockActiveStreamers,
    isLoading,
    error: null,
  };
}
