"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { DonationModal } from "@/components/donation-modal";
import { StreamEmbed } from "@/components/stream-embed";

const SOCIAL_ICONS: Record<string, string> = {
	spotify: "🎵",
	soundcloud: "🎧",
	twitch: "📺",
	youtube: "▶️",
	twitter: "🐦",
	instagram: "📷",
	github: "🔧",
	custom: "🔗",
};

export default function ArtistProfilePage() {
	const params = useParams();
	const ensName = params.ensName as string;
	const { data: artist, isLoading } = useArtistProfile(ensName);
	const [showDonationModal, setShowDonationModal] = useState(false);

	if (isLoading) {
		return (
			<div className="mx-auto max-w-5xl px-4 py-12">
				<div className="mb-8 space-y-4">
					<Skeleton className="h-64 w-full rounded-lg" />
					<div className="flex items-center gap-6">
						<Skeleton className="h-32 w-32 rounded-full" />
						<div className="flex-1 space-y-3">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-full max-w-lg" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!artist) {
		return (
			<div className="mx-auto max-w-4xl px-4 py-12 text-center">
				<div className="mb-4 text-5xl">🤔</div>
				<h2 className="mb-2 font-bold text-white text-2xl">
					Artist not found
				</h2>
				<p className="mb-6 text-zinc-400">
					This artist profile doesn't exist or hasn't been created yet.
				</p>
				<Button asChild variant="outline">
					<Link href="/">Go Home</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl px-4 py-8">
			{/* Back Button */}
			<div className="mb-6">
				<Button asChild size="sm" variant="ghost">
					<Link href="/artists">← Back to Artists</Link>
				</Button>
			</div>

			{/* Stream Embed - Show if artist is currently streaming */}
			{artist.isStreaming && artist.streamUrl && artist.streamPlatform && (
				<div className="mb-8">
					<StreamEmbed
						artistName={artist.ensName}
						streamPlatform={artist.streamPlatform}
						streamUrl={artist.streamUrl}
						taggedArtists={artist.taggedArtists}
					/>
				</div>
			)}

			{/* Profile Header - Compact */}
			<div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start">
				{/* Avatar */}
				<div className="flex-shrink-0">
					<img
						alt={artist.ensName}
						className={`h-32 w-32 rounded-full border-4 ${
							artist.isStreaming ? "border-red-500" : "border-zinc-700"
						}`}
						src={artist.avatar}
					/>
				</div>

				{/* Name + Bio + Action */}
				<div className="flex-1 space-y-4">
					<div>
						<h1 className="mb-2 font-bold text-white text-4xl">{artist.ensName}</h1>
						<p className="text-lg text-zinc-300">{artist.bio}</p>
					</div>

					<Button
						className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
						size="lg"
						onClick={() => setShowDonationModal(true)}
					>
						💜 Send Gift
					</Button>
				</div>
			</div>

			{/* Social Links */}
			{artist.socials.length > 0 && (
				<div>
					<h3 className="mb-4 font-semibold text-white text-xl">
						🔗 Connect & Listen
					</h3>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{artist.socials.map((social, index) => (
							<a
								className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-purple-500/50 hover:bg-zinc-900/80"
								href={social.url}
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								rel="noopener noreferrer"
								target="_blank"
							>
								<span className="text-2xl">
									{SOCIAL_ICONS[social.platform] || "🔗"}
								</span>
								<div className="flex-1 overflow-hidden">
									<div className="font-medium text-white capitalize">
										{social.label || social.platform}
									</div>
									<div className="text-xs text-zinc-500 truncate">
										{social.url}
									</div>
								</div>
								<span className="text-zinc-500">→</span>
							</a>
						))}
					</div>
				</div>
			)}

			{/* Donation Modal */}
			{showDonationModal && (
				<DonationModal
					artistEnsName={artist.ensName}
					onClose={() => setShowDonationModal(false)}
				/>
			)}
		</div>
	);
}
