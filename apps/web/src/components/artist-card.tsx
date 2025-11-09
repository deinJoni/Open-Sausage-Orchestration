"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { User } from "@/gqty";
import { getTextRecord } from "@/lib/utils";
import { ArtistAvatar } from "./artist-avatar";
import { AvatarGroup } from "./avatar-group";
import { Card } from "./ui/card";
import { TooltipProvider } from "./ui/tooltip";

type ArtistCardProps = {
  artist: User;
};

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const avatar = getTextRecord(artist.subdomain?.textRecords?.(), "avatar");
  const description = getTextRecord(
    artist.subdomain?.textRecords?.(),
    "description"
  );
  const isLive = artist.activeBroadcast?.isLive;
  const taggedArtists =
    artist.activeBroadcast?.broadcastWith?.()?.filter(Boolean) || [];

  const cardClassName = isLive
    ? "group relative overflow-hidden border-border bg-card p-6 backdrop-blur transition-all hover:border-brand/50 hover:shadow-lg hover:shadow-brand/20 before:absolute before:inset-0 before:bg-brand/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
    : "group relative border-border bg-card p-6 backdrop-blur transition-all hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10";

  return (
    <TooltipProvider>
      <motion.div className="h-full">
        <Card className={`${cardClassName} h-full`}>
          <Link href={`/artist/${artist.subdomain?.name ?? ""}`}>
            {/* Avatar section */}
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <ArtistAvatar
                  avatarUrl={avatar}
                  className={`border-2 transition-transform group-hover:scale-105 ${
                    isLive ? "border-live" : "border-border"
                  }`}
                  name={artist.subdomain?.name ?? ""}
                  size="lg"
                />

                {/* Live indicator with screen reader text */}
                {isLive && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-live"
                    >
                      <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
                    </span>
                    <span className="sr-only">Currently live</span>
                  </>
                )}
              </div>
            </div>

            {/* Name and live badge */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <h3 className="text-center font-semibold text-primary">
                {artist.subdomain?.name ?? ""}
              </h3>
              {isLive && (
                <span className="rounded-full bg-live/20 px-2 py-0.5 text-live text-xs">
                  LIVE
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="mb-4 line-clamp-2 text-center text-muted-foreground text-sm">
                {description}
              </p>
            )}

            {/* Tagged Artists */}
            {taggedArtists.length > 0 && (
              <div className="mt-4 flex justify-center">
                <AvatarGroup artists={taggedArtists} size="sm" />
              </div>
            )}
          </Link>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};
