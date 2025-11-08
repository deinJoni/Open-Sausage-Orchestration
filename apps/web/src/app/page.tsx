"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LivestreamCarousel } from "@/components/livestream-carousel";
import { useActiveStreamers } from "@/hooks/useActiveBroadcasts";

export default function Home() {
	const { data: activeStreamers, isLoading } = useActiveStreamers();

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-zinc-400">Loading streams...</p>
			</div>
		);
	}

	if (!activeStreamers || activeStreamers.length === 0) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-6 px-4">
				<div className="text-7xl">😴</div>
				<h1 className="font-bold text-white text-3xl">No one's live right now</h1>
				<p className="text-zinc-400">Check back later to watch live streams!</p>
				<Button asChild className="mt-4" variant="outline">
					<Link href="/artists">Browse All Artists</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<LivestreamCarousel streamers={activeStreamers} />

			<div className="mt-8 text-center">
				<Button asChild variant="outline">
					<Link href="/artists">Browse All Artists →</Link>
				</Button>
			</div>
		</div>
	);
}
