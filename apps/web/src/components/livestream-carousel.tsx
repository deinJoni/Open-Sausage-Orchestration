"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ActiveBroadcasts } from "@/hooks/use-active-broadcast";
import { getTextRecord, ipfsToHttp } from "@/lib/utils";
import { ArtistQuickActions } from "./artist-quick-actions";
import { StreamEmbed } from "./stream-embed";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

type LivestreamCarouselProps = {
  broadcasts: ActiveBroadcasts;
};

export function LivestreamCarousel({ broadcasts }: LivestreamCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  if (!broadcasts || broadcasts.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
          align: "center",
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {broadcasts.map((broadcast, index) => {
            const avatar = getTextRecord(
              broadcast.subdomain?.textRecords?.(),
              "avatar"
            );
            const description = getTextRecord(
              broadcast.subdomain?.textRecords?.(),
              "description"
            );
            return (
              <CarouselItem
                key={broadcast.subdomain?.name ?? `broadcast-${index}`}
              >
                <div className="relative">
                  {/* Stream Embed */}
                  {broadcast.activeBroadcast?.broadcastUrl ? (
                    <StreamEmbed
                      artistName={broadcast.subdomain?.name ?? ""}
                      showPlatformBadge
                      streamPlatform={"youtube"} // TODO make this dynamic or remove it even...
                      streamUrl={broadcast.activeBroadcast?.broadcastUrl}
                      taggedArtists={
                        broadcast.activeBroadcast
                          ?.broadcastWith?.()
                          ?.map((b) => b.subdomain?.name ?? "") ?? []
                      }
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-lg border border-border bg-surface-elevated">
                      <p className="text-muted-foreground">
                        Stream unavailable
                      </p>
                    </div>
                  )}

                  {/* Streamer Info Bar */}
                  <div className="mt-2 rounded-lg border border-border bg-card p-4 backdrop-blur">
                    <ArtistQuickActions
                      ensName={broadcast.subdomain?.name ?? ""}
                    >
                      <button
                        className="flex items-center gap-4 transition-opacity hover:opacity-80"
                        type="button"
                      >
                        {avatar ? (
                          <Image
                            alt={broadcast.subdomain?.name ?? ""}
                            className="h-12 w-12 rounded-full border-2 border-live"
                            height={48}
                            src={ipfsToHttp(avatar)}
                            width={48}
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-live bg-surface-elevated text-2xl">
                            👤
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-white">
                            {broadcast.subdomain?.name ?? ""}
                          </p>
                          <p className="line-clamp-1 text-muted-foreground text-sm">
                            {description || "Description"}
                          </p>
                        </div>
                      </button>
                    </ArtistQuickActions>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Navigation Dots */}
      {broadcasts.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {broadcasts.map((broadcast, index) => (
            <button
              aria-label={`Go to stream ${index + 1} of ${broadcasts.length}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-12 bg-gradient-to-r from-live to-brand shadow-brand/50 shadow-lg"
                  : "w-2 bg-muted-foreground/30 hover:scale-125 hover:bg-muted-foreground/60"
              }`}
              key={`dot-${broadcast.subdomain?.name ?? index}`}
              onClick={() => api?.scrollTo(index)}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}
