"use client";

import Link from "next/link";
import { LivestreamCarousel } from "@/components/livestream-carousel";
import { Button } from "@/components/ui/button";
import { useActiveBroadcasts } from "@/hooks/use-active-broadcast";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  const { data: activeBroadcasts, isLoading } = useActiveBroadcasts();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading streams...</p>
      </div>
    );
  }

  if (!activeBroadcasts || activeBroadcasts.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="text-7xl">😴</div>
        <h1 className="font-bold text-3xl text-white">
          No one's live right now
        </h1>
        <p className="text-muted-foreground">
          Check back later to watch live streams!
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/artists">Browse All Artists</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <LivestreamCarousel broadcasts={activeBroadcasts} />

      <ThemeSwitcher />

      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/artists">Browse All Artists →</Link>
        </Button>
      </div>
    </div>
  );
}
