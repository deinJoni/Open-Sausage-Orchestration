"use client";

import { ExternalLink, Radio } from "lucide-react";
import Link from "next/link";
import { HlsPlayer } from "@/components/hls-player";
import { StreamEmbed } from "@/components/stream-embed";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { ResolvedBroadcast } from "@/hooks/use-active-broadcast";
import type { Artist } from "@/hooks/use-all-artists";

export type LivestreamCarouselItem = {
  broadcast: ResolvedBroadcast;
  artist?: Artist;
};

type LivestreamCarouselProps = {
  items: LivestreamCarouselItem[];
};

type CarouselTileProps = {
  item: LivestreamCarouselItem;
};

function CarouselTile({ item }: CarouselTileProps) {
  const broadcast = item.broadcast;
  const artistName = item.artist?.subdomain?.name ?? "Artist";
  const playback = broadcast.playback;

  if (playback?.type === "iframe") {
    return (
      <StreamEmbed
        artistName={artistName}
        showPlatformBadge
        streamUrl={broadcast.streamId}
        taggedArtists={broadcast.guests}
      />
    );
  }

  if (playback?.type === "hls") {
    return (
      <Link
        className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background/80 transition-colors hover:border-brand"
        href={`/${artistName}/live`}
      >
        <div className="relative flex-1">
          <HlsPlayer src={playback.src} title={`${artistName} livestream`} />
        </div>
        <div className="flex items-center gap-2 border-border border-t bg-background/80 px-3 py-2 text-muted-foreground text-xs">
          <Radio className="h-3 w-3" />
          <span>{artistName} • Livepeer</span>
        </div>
      </Link>
    );
  }

  if (playback?.type === "external") {
    return (
      <a
        className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background/80 p-6 hover:border-brand"
        href={playback.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ExternalLink className="h-6 w-6 text-brand" />
        <span className="font-medium text-foreground">
          {artistName} is live
        </span>
        <span className="truncate text-muted-foreground text-xs">
          {playback.href}
        </span>
      </a>
    );
  }

  return (
    <div className="flex h-full items-center justify-center rounded-lg bg-background">
      <p className="text-muted-foreground">Stream unavailable</p>
    </div>
  );
}

export function LivestreamCarousel({ items }: LivestreamCarouselProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Carousel
        className="w-full"
        opts={{ loop: true, align: "start", slidesToScroll: 1 }}
      >
        <CarouselContent className="md:-ml-4 ml-0">
          {items.map((item, index) => (
            <CarouselItem
              className="basis-full pl-0 md:basis-1/3 md:pl-4"
              key={item.broadcast.id ?? `broadcast-${index}`}
            >
              <div className="h-[400px]">
                <CarouselTile item={item} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
