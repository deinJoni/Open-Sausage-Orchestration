export interface SocialLink {
	platform:
		| "spotify"
		| "soundcloud"
		| "twitch"
		| "youtube"
		| "twitter"
		| "instagram"
		| "custom";
	label?: string;
	url: string;
}

export interface ArtistProfile {
	ensName: string;
	address: string;
	bio: string;
	avatar: string;
	socials: SocialLink[];
	isStreaming: boolean;
	streamUrl?: string;
	streamPlatform?: "twitch" | "youtube";
	taggedArtists: string[];
	stats: {
		tipsReceived: number;
		profileViews: number;
	};
}
