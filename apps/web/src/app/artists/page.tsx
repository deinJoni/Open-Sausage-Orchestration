"use client";

import Link from "next/link";
import { useState } from "react";
import { ArtistQuickActions } from "@/components/artist-quick-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllArtists } from "@/hooks/useAllArtists";
import { useSubgraphQueryTest } from "@/hooks/useSubgraphQueryTest";

type FilterType = "all" | "live" | "offline";

export default function ArtistsPage() {
  const { data: allArtists, isLoading } = useAllArtists();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const nameRegisteredsQuery = useSubgraphQueryTest();
  console.log(nameRegisteredsQuery.nameRegistereds);

  const filteredArtists =
    allArtists?.filter((artist) => {
      // Apply search filter
      const matchesSearch = artist.ensName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Apply status filter
      const matchesFilter =
        filter === "all" ||
        (filter === "live" && artist.isStreaming) ||
        (filter === "offline" && !artist.isStreaming);

      return matchesSearch && matchesFilter;
    }) || [];

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

      {nameRegisteredsQuery?.map((nameRegistered) => (
        <div key={nameRegistered.id}>
          <h2>{nameRegistered.label}</h2>
          <p>{nameRegistered.owner}</p>
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
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card
              className="border-zinc-800 bg-zinc-900/50 p-6"
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
            >
              <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
              <Skeleton className="mx-auto mb-2 h-4 w-32" />
              <Skeleton className="mx-auto mb-4 h-3 w-48" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <h3 className="mb-2 font-semibold text-white text-xl">
            No artists found
          </h3>
          <p className="text-zinc-400">
            {searchQuery
              ? "Try a different search term"
              : "No artists match your filters"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArtists.map((artist) => (
            <Card
              className="group border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-all hover:border-purple-500/50"
              key={artist.ensName}
            >
              <Link href={`/artist/${artist.ensName}`}>
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <img
                      alt={artist.ensName}
                      className={`h-24 w-24 rounded-full border-2 transition-transform group-hover:scale-105 ${
                        artist.isStreaming
                          ? "border-red-500"
                          : "border-zinc-700"
                      }`}
                      src={artist.avatar}
                    />
                    {artist.isStreaming && (
                      <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                        <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-center gap-2">
                  <h3 className="text-center font-semibold text-white">
                    {artist.ensName}
                  </h3>
                  {artist.isStreaming && (
                    <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-red-400 text-xs">
                      LIVE
                    </span>
                  )}
                </div>

                <p className="mb-4 line-clamp-2 text-center text-sm text-zinc-400">
                  {artist.bio}
                </p>

                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>💜 {artist.stats.tipsReceived} tips</span>
                  <span>👁️ {artist.stats.profileViews} views</span>
                </div>
              </Link>

              {artist.taggedArtists.length > 0 && (
                <div className="mt-4 border-zinc-800 border-t pt-3">
                  <p className="mb-2 text-center text-xs text-zinc-500">
                    Streaming with:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {artist.taggedArtists.map((taggedArtist) => (
                      <ArtistQuickActions
                        ensName={taggedArtist}
                        key={taggedArtist}
                      >
                        <button
                          className="flex items-center gap-1.5 rounded-full bg-purple-500/20 px-2.5 py-1.5 transition-all hover:bg-purple-500/30"
                          type="button"
                        >
                          <img
                            alt={taggedArtist}
                            className="h-4 w-4 rounded-full border border-purple-400"
                            src={`https://avatars.jakerunzer.com/${taggedArtist}`}
                          />
                          <span className="text-purple-300 text-xs">
                            {taggedArtist}
                          </span>
                        </button>
                      </ArtistQuickActions>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {!isLoading && filteredArtists.length > 0 && (
        <div className="mt-8 text-center text-sm text-zinc-500">
          Showing {filteredArtists.length} artist
          {filteredArtists.length !== 1 ? "s" : ""}
          {filter !== "all" && ` (${filter})`}
        </div>
      )}
    </div>
  );
}
