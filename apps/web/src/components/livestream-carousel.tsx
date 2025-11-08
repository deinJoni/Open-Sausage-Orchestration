"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ActiveBroadcasts } from "@/hooks/use-active-broadcast";
import { ArtistQuickActions } from "./artist-quick-actions";
import { StreamEmbed } from "./stream-embed";
import { Button } from "./ui/button";

type LivestreamCarouselProps = {
  broadcasts: ActiveBroadcasts;
};

export function LivestreamCarousel({ broadcasts }: LivestreamCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!broadcasts || broadcasts.length === 0) {
    return null;
  }

  const currentBroadcast = broadcasts[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? broadcasts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === broadcasts.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mb-12 w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-2xl text-white">🔴 Live Now</h2>
        {broadcasts.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">
              {currentIndex + 1} / {broadcasts.length}
            </span>
            <div className="flex gap-1">
              <Button
                className="h-8 w-8 border-zinc-700 hover:border-purple-500"
                onClick={handlePrevious}
                size="icon"
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                className="h-8 w-8 border-zinc-700 hover:border-purple-500"
                onClick={handleNext}
                size="icon"
                variant="outline"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Stream Embed */}
        {currentBroadcast.activeBroadcast?.broadcastUrl ? (
          <StreamEmbed
            artistName={currentBroadcast.subdomain?.name ?? ""}
            showPlatformBadge
            streamPlatform={"youtube"} // TODO make this dynamic or remove it even...
            streamUrl={currentBroadcast.activeBroadcast?.broadcastUrl}
            taggedArtists={
              currentBroadcast.activeBroadcast
                ?.broadcastWith?.()
                ?.map((broadcast) => broadcast.subdomain?.name ?? "") ?? []
            }
          />
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg border border-zinc-800 bg-zinc-800">
            <p className="text-zinc-400">Stream unavailable</p>
          </div>
        )}

        {/* Streamer Info Bar */}
        <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900/90 p-4 backdrop-blur">
          <ArtistQuickActions ensName={currentBroadcast.subdomain?.name ?? ""}>
            {" "}
            {/* TODO fix this */}
            <button
              className="flex items-center gap-4 transition-opacity hover:opacity-80"
              type="button"
            >
              <Image
                alt={currentBroadcast.subdomain?.name ?? ""}
                className="h-12 w-12 rounded-full border-2 border-red-500"
                height={48}
                src={
                  currentBroadcast.subdomain
                    ?.textRecords?.()
                    ?.find((record) => record.key === "avatar")?.value ??
                  "Avatar"
                }
                width={48}
              />
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">
                  {currentBroadcast.subdomain?.name ?? ""}
                </p>
                <p className="line-clamp-1 text-sm text-zinc-400">
                  {currentBroadcast.subdomain
                    ?.textRecords?.()
                    ?.find((record) => record.key === "description")?.value ??
                    "Description"}
                </p>
              </div>
            </button>
          </ArtistQuickActions>
        </div>
      </div>

      {/* Navigation Dots */}
      {broadcasts.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {broadcasts.map((_, index) => (
            <button
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-purple-500"
                  : "bg-zinc-700 hover:bg-zinc-600"
              }`}
              key={`dot-${broadcasts[index]?.subdomain?.name ?? index}`}
              onClick={() => setCurrentIndex(index)}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}
