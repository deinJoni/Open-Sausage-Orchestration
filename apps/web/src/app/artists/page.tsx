"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArtistQuickActions } from "@/components/artist-quick-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllArtists } from "@/hooks/use-all-artists";
import { ARTISTS_GRID_SIZE } from "@/lib/constants";
import { getTextRecord, ipfsToHttp } from "@/lib/utils";

type FilterType = "all" | "live" | "offline";

export default function ArtistsPage() {
  const { data: allArtists, isLoading } = useAllArtists();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredArtists =
    allArtists?.filter((artist) => {
      // Apply search filter
      const matchesSearch = artist.subdomain?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Apply status filter
      const matchesFilter =
        filter === "all" ||
        (filter === "live" && artist.activeBroadcast?.isLive) ||
        (filter === "offline" && !artist.activeBroadcast?.isLive);

      return matchesSearch && matchesFilter;
    }) || [];

  const renderSkeletons = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...new Array(ARTISTS_GRID_SIZE)].map((_, i) => (
        <Card
          className="border-border bg-card p-6"
          key={`artist-skeleton-${String(i)}`}
        >
          <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
          <Skeleton className="mx-auto mb-2 h-4 w-32" />
          <Skeleton className="mx-auto mb-4 h-3 w-48" />
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => {
    const emptyMessage = searchQuery
      ? "Try a different search term"
      : "No artists match your filters";

    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-5xl">🔍</div>
        <h3 className="mb-2 font-semibold text-white text-xl">
          No artists found
        </h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  };

  const renderArtistsGrid = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/** biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <LIFE IS SHORT, CODE IS LONG> */}
      {filteredArtists.map((artist) => {
        const avatar = getTextRecord(
          artist.subdomain?.textRecords?.(),
          "avatar"
        );
        const description = getTextRecord(
          artist.subdomain?.textRecords?.(),
          "description"
        );
        const isLive = artist.activeBroadcast?.isLive;
        const avatarBorderColor = isLive ? "border-live" : "border-border";
        const cardClassName = isLive
          ? "group relative overflow-hidden border-border bg-card p-6 backdrop-blur transition-all hover:border-brand/50 hover:shadow-lg hover:shadow-brand/20 before:absolute before:inset-0 before:bg-gradient-to-br before:from-brand/10 before:to-fuchsia-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
          : "group border-border bg-card p-6 backdrop-blur transition-all hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10";

        return (
          <Card className={cardClassName} key={artist.subdomain?.name ?? ""}>
            <Link href={`/artist/${artist.subdomain?.name ?? ""}`}>
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  {avatar ? (
                    <Image
                      alt={artist.subdomain?.name ?? ""}
                      className={`h-24 w-24 rounded-full border-2 transition-transform group-hover:scale-105 ${avatarBorderColor}`}
                      height={96}
                      src={ipfsToHttp(avatar)}
                      width={96}
                    />
                  ) : (
                    <div
                      className={`flex h-24 w-24 items-center justify-center rounded-full border-2 bg-surface-elevated text-4xl transition-transform group-hover:scale-105 ${avatarBorderColor}`}
                    >
                      👤
                    </div>
                  )}
                  {artist.activeBroadcast?.isLive && (
                    <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-live">
                      <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-center justify-center gap-2">
                <h3 className="text-center font-semibold text-white">
                  {artist.subdomain?.name ?? ""}
                </h3>
                {artist.activeBroadcast?.isLive && (
                  <span className="rounded-full bg-live/20 px-2 py-0.5 text-live text-xs">
                    LIVE
                  </span>
                )}
              </div>

              {description && (
                <p className="mb-4 line-clamp-2 text-center text-muted-foreground text-sm">
                  {description}
                </p>
              )}
            </Link>

            {artist.activeBroadcast?.broadcastWith?.() &&
              artist.activeBroadcast.broadcastWith().length > 0 && (
                <div className="relative z-10 mt-4 border-border border-t pt-3">
                  <p className="mb-2 text-center text-muted-foreground text-xs">
                    Streaming with:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {artist.activeBroadcast
                      .broadcastWith()
                      .map((taggedArtist) => {
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
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-4 flex justify-center">
        <Button asChild size="sm" variant="outline">
          <Link href="/">← Back to Live Streams</Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="mb-3 font-bold text-5xl text-white">
          <span className="bg-gradient-to-r from-brand to-fuchsia-400 bg-clip-text text-transparent">
            Discover
          </span>{" "}
          Artists
        </h1>
        <p className="mb-2 text-foreground text-lg">
          {allArtists?.length || 0} talented artists on the platform
        </p>
        {allArtists && allArtists.length > 0 && (
          <p className="text-muted-foreground text-sm">
            {allArtists.filter((a) => a.activeBroadcast?.isLive).length}{" "}
            streaming live now
          </p>
        )}
      </div>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            className={filter === "all" ? "bg-brand" : ""}
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
          >
            All
          </Button>
          <Button
            className={filter === "live" ? "bg-live" : ""}
            onClick={() => setFilter("live")}
            variant={filter === "live" ? "default" : "outline"}
          >
            🔴 Live Now
          </Button>
          <Button
            className={filter === "offline" ? "bg-surface-elevated" : ""}
            onClick={() => setFilter("offline")}
            variant={filter === "offline" ? "default" : "outline"}
          >
            Offline
          </Button>
        </div>

        <Input
          className="sm:w-64"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search artists..."
          type="search"
          value={searchQuery}
        />
      </div>

      {/* Artists Grid */}
      {isLoading && renderSkeletons()}
      {!isLoading && filteredArtists.length === 0 && renderEmptyState()}
      {!isLoading && filteredArtists.length > 0 && renderArtistsGrid()}

      {/* Stats Summary */}
      {!isLoading &&
        filteredArtists.length > 0 &&
        (() => {
          const liveCount = filteredArtists.filter(
            (a) => a.activeBroadcast?.isLive
          ).length;
          const offlineCount = filteredArtists.length - liveCount;

          return (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="rounded-lg border border-border bg-card px-4 py-2">
                <span className="text-muted-foreground">Total:</span>{" "}
                <span className="font-semibold text-white">
                  {filteredArtists.length}
                </span>
              </div>
              {liveCount > 0 && (
                <div className="rounded-lg border border-live/30 bg-live/10 px-4 py-2">
                  <span className="text-live">🔴 Live:</span>{" "}
                  <span className="font-semibold text-live">{liveCount}</span>
                </div>
              )}
              {offlineCount > 0 && (
                <div className="rounded-lg border border-border bg-card px-4 py-2">
                  <span className="text-muted-foreground">Offline:</span>{" "}
                  <span className="font-semibold text-foreground">
                    {offlineCount}
                  </span>
                </div>
              )}
            </div>
          );
        })()}
    </div>
  );
}
