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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...new Array(ARTISTS_GRID_SIZE)].map((_, i) => (
        <Card
          className="border-zinc-800 bg-zinc-900/50 p-6"
          key={`artist-skeleton-${String(i)}`}
        >
          <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
          <Skeleton className="mx-auto mb-2 h-4 w-32" />
          <Skeleton className="mx-auto mb-4 h-3 w-48" />
          <Skeleton className="h-10 w-full" />
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
        <p className="text-zinc-400">{emptyMessage}</p>
      </div>
    );
  };

  const renderArtistsGrid = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredArtists.map((artist) => {
        const avatarBorderColor = artist.activeBroadcast?.isLive
          ? "border-red-500"
          : "border-zinc-700";

        return (
          <Card
            className="group border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-all hover:border-purple-500/50"
            key={artist.subdomain?.name ?? ""}
          >
            <Link href={`/artist/${artist.subdomain?.name ?? ""}`}>
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <Image
                    alt={
                      artist.subdomain
                        ?.textRecords?.()
                        ?.find((record) => record.key === "avatar")?.value ??
                      "Avatar"
                    }
                    className={`h-24 w-24 rounded-full border-2 transition-transform group-hover:scale-105 ${avatarBorderColor}`}
                    height={96}
                    src={
                      artist.subdomain
                        ?.textRecords?.()
                        ?.find((record) => record.key === "avatar")?.value ??
                      "Avatar"
                    }
                    width={96}
                  />
                  {artist.activeBroadcast?.isLive && (
                    <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
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
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-red-400 text-xs">
                    LIVE
                  </span>
                )}
              </div>

              <p className="mb-4 line-clamp-2 text-center text-sm text-zinc-400">
                {artist.subdomain
                  ?.textRecords?.()
                  ?.find((record) => record.key === "description")?.value ??
                  "Description"}
              </p>
            </Link>

            <div className="mt-4 border-zinc-800 border-t pt-3">
              <p className="mb-2 text-center text-xs text-zinc-500">
                Streaming with:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {artist.activeBroadcast
                  ?.broadcastWith?.()
                  ?.map((taggedArtist) => (
                    <ArtistQuickActions
                      ensName={taggedArtist.subdomain?.name ?? ""}
                      key={taggedArtist.subdomain?.name ?? ""}
                    >
                      <button
                        className="flex items-center gap-1.5 rounded-full bg-purple-500/20 px-2.5 py-1.5 transition-all hover:bg-purple-500/30"
                        type="button"
                      >
                        <Image
                          alt={taggedArtist.subdomain?.name ?? ""}
                          className="h-4 w-4 rounded-full border border-purple-400"
                          height={16}
                          src={`https://avatars.jakerunzer.com/${taggedArtist}`}
                          width={16}
                        />
                        <span className="text-purple-300 text-xs">
                          {taggedArtist.subdomain?.name ?? ""}
                        </span>
                      </button>
                    </ArtistQuickActions>
                  ))}
              </div>
            </div>
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

      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-4xl text-white">🎵 All Artists</h1>
        <p className="text-zinc-400">Discover and support talented artists</p>
      </div>

      {filteredArtists.map((artist) => (
        <div
          className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
          key={artist.subdomain?.name ?? ""}
        >
          <div className="mb-2">
            <span className="text-sm text-zinc-400">Key:</span>
            <span className="ml-2 text-white">
              {artist.subdomain
                ?.textRecords?.()
                ?.find((record) => record.key === "avatar")?.key ?? "Avatar"}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-sm text-zinc-400">Value:</span>
            <span className="ml-2 text-white">
              {artist.subdomain
                ?.textRecords?.()
                ?.find((record) => record.key === "avatar")?.value ?? "Avatar"}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-sm text-zinc-400">Subdomain:</span>
            <span className="ml-2 text-white">
              {artist.subdomain?.name ?? ""}
            </span>
          </div>
          <div>
            <span className="text-sm text-zinc-400">Owner:</span>
            <span className="ml-2 font-mono text-white text-xs">
              {artist.subdomain?.owner?.address ?? ""}
            </span>
          </div>
        </div>
      ))}

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            className={filter === "all" ? "bg-purple-500" : ""}
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
          >
            All
          </Button>
          <Button
            className={filter === "live" ? "bg-red-500" : ""}
            onClick={() => setFilter("live")}
            variant={filter === "live" ? "default" : "outline"}
          >
            🔴 Live Now
          </Button>
          <Button
            className={filter === "offline" ? "bg-zinc-600" : ""}
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
          const artistLabel =
            filteredArtists.length === 1 ? "artist" : "artists";
          return (
            <div className="mt-8 text-center text-sm text-zinc-500">
              Showing {filteredArtists.length} {artistLabel}
              {filter !== "all" && ` (${filter})`}
            </div>
          );
        })()}
    </div>
  );
}
