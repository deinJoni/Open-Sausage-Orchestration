import { useState } from "react";
import type { ArtistProfile } from "@/types/artist";

// Mock all artists data
const mockAllArtists: ArtistProfile[] = [
	{
		ensName: "nick.eth",
		address: "0x1234567890123456789012345678901234567890",
		bio: "Lead developer of ENS. Building the decentralized web.",
		avatar: "https://avatars.jakerunzer.com/nick.eth",
		socials: [
			{ platform: "twitter", url: "https://twitter.com/nicksdjohnson" },
			{ platform: "github", url: "https://github.com/arachnid" },
		],
		isStreaming: true,
		taggedArtists: ["vitalik.eth"],
		stats: {
			tipsReceived: 15,
			profileViews: 342,
		},
	},
	{
		ensName: "vitalik.eth",
		address: "0x2345678901234567890123456789012345678901",
		bio: "Ethereum co-founder. Building decentralized systems.",
		avatar: "https://avatars.jakerunzer.com/vitalik.eth",
		socials: [
			{ platform: "twitter", url: "https://twitter.com/VitalikButerin" },
			{ platform: "spotify", url: "https://open.spotify.com/artist/example" },
		],
		isStreaming: true,
		taggedArtists: ["nick.eth", "luc.eth"],
		stats: {
			tipsReceived: 89,
			profileViews: 1204,
		},
	},
	{
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
		stats: {
			tipsReceived: 23,
			profileViews: 567,
		},
	},
	{
		ensName: "alice.eth",
		address: "0x4567890123456789012345678901234567890123",
		bio: "Electronic music producer. Streaming live sessions daily.",
		avatar: "https://avatars.jakerunzer.com/alice.eth",
		socials: [
			{ platform: "spotify", url: "https://open.spotify.com/artist/alice" },
			{ platform: "soundcloud", url: "https://soundcloud.com/alice" },
			{ platform: "instagram", url: "https://instagram.com/alicemusic" },
		],
		isStreaming: false,
		taggedArtists: [],
		stats: {
			tipsReceived: 42,
			profileViews: 892,
		},
	},
];

export function useAllArtists() {
	const [isLoading] = useState(false);

	// TODO: Replace with The Graph integration
	// Query all registered artists from subgraph
	// Then resolve full ENS profiles for each

	return {
		data: mockAllArtists,
		isLoading,
		error: null,
	};
}
