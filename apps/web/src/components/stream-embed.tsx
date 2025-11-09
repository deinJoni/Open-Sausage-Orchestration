"use client";

import { Gift } from "lucide-react";
import { convertToEmbedUrl } from "@/lib/broadcast";
import { ArtistAvatar } from "./artist-avatar";
import { ArtistQuickActions } from "./artist-quick-actions";
import { DonationPopover } from "./donation-modal";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type StreamEmbedProps = {
  streamUrl: string;
  streamPlatform: string;
  artistName?: string;
  walletAddress?: string;
  showPlatformBadge?: boolean;
  taggedArtists?: string[];
};

export function StreamEmbed({
  streamUrl,
  artistName,
  walletAddress,
  showPlatformBadge = true,
  taggedArtists = [],
}: StreamEmbedProps) {
  // Convert the URL to embeddable format
  const embedUrl = convertToEmbedUrl(streamUrl);

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
        <div className="relative flex-1">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
            src={embedUrl}
            title={`${artistName} livestream`}
          />
        </div>
      {showPlatformBadge && (
        <div className="border-border border-t bg-card p-3 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Left: Artist info + gift button */}
            {artistName && (
              <div className="flex items-center gap-2">
                <ArtistQuickActions ensName={artistName}>
                  <button
                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    type="button"
                  >
                    <ArtistAvatar
                      avatarUrl={`https://avatars.jakerunzer.com/${artistName}`}
                      className="border border-border"
                      name={artistName}
                      size="xs"
                    />
                    <span className="text-muted-foreground text-xs">
                      {artistName}
                    </span>
                  </button>
                </ArtistQuickActions>

                {/* Tagged Artists Avatars */}
                {taggedArtists.length > 0 && (
                  <div className="flex">
                    {taggedArtists.map((artist, index) => (
                      <Tooltip key={artist}>
                        <TooltipTrigger asChild>
                          <ArtistQuickActions ensName={artist}>
                            <button
                              className={`transition-transform hover:z-10 hover:scale-110 ${index > 0 ? "-ml-2" : ""}`}
                              type="button"
                            >
                              <ArtistAvatar
                                avatarUrl={`https://avatars.jakerunzer.com/${artist}`}
                                className="border border-brand"
                                name={artist}
                                size="xs"
                              />
                            </button>
                          </ArtistQuickActions>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{artist}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}

                {artistName && (
                  <DonationPopover
                    ensName={artistName}
                    walletAddress={walletAddress}
                  >
                    <Button
                      className="h-7 gap-1.5 text-xs"
                      size="sm"
                      variant="outline"
                    >
                      <Gift className="h-3 w-3" />
                    </Button>
                  </DonationPopover>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
}
