"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { ArtistCard } from "@/components/artist-card";
import { LivestreamCarousel } from "@/components/livestream-carousel";
import {
  FILTER_OPTIONS,
  StickyFilterBar,
} from "@/components/sticky-filter-bar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllArtists } from "@/hooks/use-all-artists";
import { ARTISTS_GRID_SIZE } from "@/lib/constants";

const LoadingSkeleton = () => (
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

// Type-safe filter parser for nuqs
const filterParser = parseAsStringLiteral(FILTER_OPTIONS);

export default function Home() {
  const { data: allArtists, isLoading } = useAllArtists();

  // URL state management with nuqs - single source of truth
  const [filter, setFilter] = useQueryState(
    "filter",
    filterParser.withDefault("all")
  );

  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
    throttleMs: 300, // Built-in debouncing!
  });

  // Calculate stats
  const liveArtists =
    allArtists?.filter((a) => a.activeBroadcast?.isLive) || [];
  const totalArtists = allArtists?.length || 0;
  const liveCount = liveArtists.length;
  const offlineCount = totalArtists - liveCount;

  // Filter artists based on search and filter
  const filteredArtists =
    allArtists?.filter((artist) => {
      const matchesSearch = artist.subdomain?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "live" && artist.activeBroadcast?.isLive) ||
        (filter === "offline" && !artist.activeBroadcast?.isLive);

      return matchesSearch && matchesFilter;
    }) || [];

  const renderEmptyState = () => {
    const emptyConfig = {
      all: {
        emoji: "👥",
        title: "No artists yet",
        message: "Be the first to join the platform!",
      },
      live: {
        emoji: "😴",
        title: "No one's live right now",
        message: "Check back later or browse all artists below",
      },
      offline: {
        emoji: "📴",
        title: "All artists are live!",
        message: "Everyone is streaming right now",
      },
    };

    const config = searchQuery
      ? {
          emoji: "🔍",
          title: "No artists found",
          message: "Try a different search term",
        }
      : emptyConfig[filter];

    return (
      <div className="py-24 text-center">
        <div className="mb-4 text-7xl">{config.emoji}</div>
        <h3 className="mb-2 font-bold text-2xl">{config.title}</h3>
        <p className="text-lg text-muted-foreground">{config.message}</p>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 h-[60vh] animate-pulse rounded-xl bg-surface-elevated" />
          <div className="mb-8 h-20 animate-pulse rounded-lg bg-surface-elevated" />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Skip to content link for keyboard users */}
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        href="#artist-grid"
      >
        Skip to artists
      </a>

      <section className="mx-auto w-full bg-[#f8f4ff] pt-5 pb-5 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row">
          <div className="flex flex-1 flex-col items-center gap-6 border-none text-center">
            {/* Hero Section: Live Streams */}
            {liveArtists.length > 0 && (
              <div className="w-full rounded-md border-[1px] border-black bg-white p-8 text-left shadow-[0_4px_0_rgba(0,0,0,0.55)]">
                <span
                  className={
                    "mx-4 rounded-full border-2 bg-red-500 px-3 py-1 font-semibold text-white text-xs uppercase tracking-[0.3em]"
                  }
                >
                  <span className="rounded-full py-1 font-semibold text-white text-xs uppercase tracking-[0.3em]">
                    LIVE
                  </span>
                </span>
                <div className="mx-auto max-w-7xl border-none px-4 py-8">
                  <LivestreamCarousel broadcasts={liveArtists} />
                </div>
              </div>
            )}

            <section className="w-full rounded-md border-[1px] border-black bg-white p-8 pt-4 text-left shadow-[0_4px_0_rgba(0,0,0.55,0.55)]">
              <h2 className="px-4 font-black text-2xl text-gray-950">Artist</h2>

              {/* Sticky Filter Bar - always show theme switcher */}
              <StickyFilterBar
                filter={filter}
                liveCount={liveCount}
                offlineCount={offlineCount}
                searchQuery={searchQuery}
                setFilter={setFilter}
                setSearchQuery={setSearchQuery}
                showThemeSwitcher={true}
                themeSwitcher={<ThemeSwitcher />}
                totalArtists={totalArtists}
              />

              {/* Artist Grid Section */}
              <div className="mx-auto w-full px-4" id="artist-grid">
                {filteredArtists.length === 0 && renderEmptyState()}
                {filteredArtists.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredArtists.map((artist) => (
                      <ArtistCard
                        artist={artist}
                        key={artist.subdomain?.name ?? ""}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
