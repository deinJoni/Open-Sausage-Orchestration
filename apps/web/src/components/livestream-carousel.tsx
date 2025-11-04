"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ArtistProfile } from "@/types/artist";
import { ArtistQuickActions } from "./artist-quick-actions";
import { StreamEmbed } from "./stream-embed";

interface LivestreamCarouselProps {
	streamers: ArtistProfile[];
}

export function LivestreamCarousel({ streamers }: LivestreamCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	if (!streamers || streamers.length === 0) {
		return null;
	}

	const currentStreamer = streamers[currentIndex];

	const handlePrevious = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? streamers.length - 1 : prev - 1
		);
	};

	const handleNext = () => {
		setCurrentIndex((prev) =>
			prev === streamers.length - 1 ? 0 : prev + 1
		);
	};

	return (
		<div className="mb-12 w-full">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-bold text-white text-2xl">
					🔴 Live Now
				</h2>
				{streamers.length > 1 && (
					<div className="flex items-center gap-2">
						<span className="text-sm text-zinc-400">
							{currentIndex + 1} / {streamers.length}
						</span>
						<div className="flex gap-1">
							<Button
								onClick={handlePrevious}
								size="icon"
								variant="outline"
								className="h-8 w-8 border-zinc-700 hover:border-purple-500"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								onClick={handleNext}
								size="icon"
								variant="outline"
								className="h-8 w-8 border-zinc-700 hover:border-purple-500"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				)}
			</div>

			<div className="relative">
				{/* Stream Embed */}
				{currentStreamer.streamUrl && currentStreamer.streamPlatform ? (
					<StreamEmbed
						artistName={currentStreamer.ensName}
						showPlatformBadge
						streamPlatform={currentStreamer.streamPlatform}
						streamUrl={currentStreamer.streamUrl}
						taggedArtists={currentStreamer.taggedArtists}
					/>
				) : (
					<div className="flex aspect-video items-center justify-center rounded-lg border border-zinc-800 bg-zinc-800">
						<p className="text-zinc-400">Stream unavailable</p>
					</div>
				)}

				{/* Streamer Info Bar */}
				<div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900/90 p-4 backdrop-blur">
					<ArtistQuickActions ensName={currentStreamer.ensName}>
						<button
							className="flex items-center gap-4 transition-opacity hover:opacity-80"
							type="button"
						>
							<img
								alt={currentStreamer.ensName}
								className="h-12 w-12 rounded-full border-2 border-red-500"
								src={currentStreamer.avatar}
							/>
							<div className="flex-1 text-left">
								<p className="font-semibold text-white">
									{currentStreamer.ensName}
								</p>
								<p className="text-sm text-zinc-400 line-clamp-1">
									{currentStreamer.bio}
								</p>
							</div>
						</button>
					</ArtistQuickActions>
				</div>
			</div>

			{/* Navigation Dots */}
			{streamers.length > 1 && (
				<div className="mt-4 flex justify-center gap-2">
					{streamers.map((_, index) => (
						<button
							className={`h-2 w-2 rounded-full transition-all ${
								index === currentIndex
									? "w-8 bg-purple-500"
									: "bg-zinc-700 hover:bg-zinc-600"
							}`}
							key={`dot-${streamers[index]?.ensName || index}`}
							type="button"
							onClick={() => setCurrentIndex(index)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
