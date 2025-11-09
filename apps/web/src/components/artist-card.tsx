"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@/gqty";
import { getTextRecord, ipfsToHttp } from "@/lib/utils";
import { ArtistQuickActions } from "./artist-quick-actions";
import { Card } from "./ui/card";

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

  const cardClassName = isLive
    ? "group relative overflow-hidden border-border bg-card p-6 backdrop-blur transition-all hover:border-brand/50 hover:shadow-lg hover:shadow-brand/20 before:absolute before:inset-0 before:bg-gradient-to-br before:from-brand/10 before:to-brand-secondary/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
    : "group border-border bg-card p-6 backdrop-blur transition-all hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10";

  return (
    <motion.div>
      <Card className={cardClassName}>
        <Link href={`/artist/${artist.subdomain?.name ?? ""}`}>
          {/* Avatar section */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              {avatar ? (
                <Image
                  alt={artist.subdomain?.name ?? ""}
                  className={`h-24 w-24 rounded-full border-2 transition-transform group-hover:scale-105 ${
                    isLive ? "border-live" : "border-border"
                  }`}
                  height={96}
                  src={ipfsToHttp(avatar)}
                  width={96}
                />
              ) : (
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-full border-2 bg-surface-elevated text-4xl transition-transform group-hover:scale-105 ${
                    isLive ? "border-live" : "border-border"
                  }`}
                >
                  👤
                </div>
              )}

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
            <h3 className="text-center font-semibold text-white">
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
        </Link>

        {/* Tagged artists */}
        {artist.activeBroadcast?.broadcastWith?.() &&
          artist.activeBroadcast.broadcastWith().length > 0 && (
            <div className="relative z-10 mt-4 border-border border-t pt-3">
              <p className="mb-2 text-center text-muted-foreground text-xs">
                Streaming with:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {artist.activeBroadcast.broadcastWith().map((taggedArtist) => {
                  const taggedAvatar = getTextRecord(
                    taggedArtist.subdomain?.textRecords?.(),
                    "avatar"
                  );
                  return (
                    <ArtistQuickActions
                      ensName={taggedArtist.subdomain?.name ?? ""}
                      key={taggedArtist.subdomain?.name ?? ""}
                    >
                      <button
                        className="flex items-center gap-1.5 rounded-full bg-brand/20 px-2.5 py-1.5 transition-all hover:bg-brand/30"
                        type="button"
                      >
                        {taggedAvatar ? (
                          <Image
                            alt={taggedArtist.subdomain?.name ?? ""}
                            className="h-4 w-4 rounded-full border border-brand"
                            height={16}
                            src={ipfsToHttp(taggedAvatar)}
                            width={16}
                          />
                        ) : (
                          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-brand bg-surface-elevated text-[8px]">
                            👤
                          </div>
                        )}
                        <span className="text-brand text-xs">
                          {taggedArtist.subdomain?.name ?? ""}
                        </span>
                      </button>
                    </ArtistQuickActions>
                  );
                })}
              </div>
            </div>
          )}
      </Card>
    </motion.div>
  );
};
