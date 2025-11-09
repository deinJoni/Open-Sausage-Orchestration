"use client";

import { AnimatePresence, motion } from "framer-motion";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
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

// Type-safe filter parser for nuqs
const filterParser = parseAsStringLiteral(FILTER_OPTIONS);

export default function Home() {
  const { data: allArtists, isLoading } = useAllArtists();
  const gridRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

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

  // Auto-scroll when filter/search changes (not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (filteredArtists.length > 0 && gridRef.current) {
      // Small delay for Framer Motion animation to start
      setTimeout(() => {
        gridRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [filteredArtists.length]);

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
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="py-24 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4 text-7xl">{config.emoji}</div>
        <h3 className="mb-2 font-bold text-2xl text-white">{config.title}</h3>
        <p className="text-lg text-muted-foreground">{config.message}</p>
      </motion.div>
    );
  };

  const renderArtistsGrid = () => (
    <motion.div
      animate="show"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      initial="hidden"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {filteredArtists.map((artist) => (
        <ArtistCard artist={artist} key={artist.subdomain?.name ?? ""} />
      ))}
    </motion.div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 h-[60vh] animate-pulse rounded-xl bg-surface-elevated" />
          <div className="mb-8 h-20 animate-pulse rounded-lg bg-surface-elevated" />
          {renderSkeletons()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Skip to content link for keyboard users */}
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        href="#artist-grid"
      >
        Skip to artists
      </a>

      {/* Hero Section: Live Streams */}
      <AnimatePresence mode="wait">
        {liveArtists.length > 0 && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="border-b bg-surface-elevated/50"
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto max-w-7xl px-4 py-8">
              <div className="mb-6">
                <h2 className="font-bold text-3xl text-white">
                  <span className="bg-gradient-to-r from-live to-brand bg-clip-text text-transparent">
                    Live Now
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  {liveCount} {liveCount === 1 ? "artist" : "artists"} streaming
                </p>
              </div>
              <LivestreamCarousel broadcasts={liveArtists} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <div
        className="mx-auto max-w-7xl px-4 py-8"
        id="artist-grid"
        ref={gridRef}
      >
        {filteredArtists.length === 0 && renderEmptyState()}
        {filteredArtists.length > 0 && renderArtistsGrid()}
      </div>
    </div>
  );
}
