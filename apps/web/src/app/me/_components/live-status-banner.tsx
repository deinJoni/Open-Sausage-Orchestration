"use client";

import { ExternalLink, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { OwnedProfile } from "@/hooks/use-owned-profile";
import { useUpdateBroadcast } from "@/hooks/use-update-broadcast";
import { TIME } from "@/lib/constants";

type LiveStatusBannerProps = {
  profile: OwnedProfile;
  onViewDetails?: () => void;
};

/**
 * Format duration from timestamp to "Xh Ym" format
 */
function formatDuration(startedAt: bigint): string {
  const startMs = Number(startedAt) * TIME.MS_PER_SECOND;
  const now = Date.now();
  const diffMs = now - startMs;

  const hours = Math.floor(diffMs / TIME.MS_PER_HOUR);
  const minutes = Math.floor((diffMs % TIME.MS_PER_HOUR) / TIME.MS_PER_MINUTE);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Detect platform from URL
 */
function getPlatform(url: string): { name: string; icon: React.ReactNode } {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return { name: "YouTube", icon: <Youtube className="h-4 w-4" /> };
  }

  if (lowerUrl.includes("twitch.tv")) {
    return { name: "Twitch", icon: <span className="text-lg">📺</span> };
  }

  return { name: "Stream", icon: <ExternalLink className="h-4 w-4" /> };
}

/**
 * Compact live status banner shown at top of /me page when user is streaming
 * Provides quick access to stream controls without scrolling
 */
export function LiveStatusBanner({
  profile,
  onViewDetails,
}: LiveStatusBannerProps) {
  const [duration, setDuration] = useState("0m");
  const updateBroadcast = useUpdateBroadcast();

  const activeBroadcast = profile.user?.activeBroadcast;

  // Update duration every minute
  useEffect(() => {
    if (!activeBroadcast?.startedAt) {
      return;
    }

    const updateTimer = () => {
      setDuration(formatDuration(activeBroadcast.startedAt));
    };

    updateTimer(); // Initial update
    const interval = setInterval(updateTimer, TIME.MS_PER_MINUTE);

    return () => clearInterval(interval);
  }, [activeBroadcast?.startedAt]);

  if (!(activeBroadcast?.broadcastUrl && activeBroadcast.isLive)) {
    return null;
  }

  const platform = getPlatform(activeBroadcast.broadcastUrl);

  const handleEndStream = () => {
    updateBroadcast.mutate({
      isLive: false,
      broadcastUrl: "",
      guestWalletAddresses: [],
    });
  };

  return (
    <div
      aria-live="polite"
      className="relative overflow-hidden rounded-lg border border-live/30 bg-live/10 backdrop-blur"
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Live indicator + Platform + Duration */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-6 items-center gap-2 rounded-full bg-live px-3 py-1 font-semibold text-live-foreground text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </span>

          <div className="flex items-center gap-2 text-foreground text-sm">
            {platform.icon}
            <span className="font-medium">{platform.name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{duration}</span>
          </div>

          {/* Stream URL - show truncated version on mobile */}
          <a
            className="group flex items-center gap-1.5 text-brand text-xs hover:text-brand sm:text-sm"
            href={activeBroadcast.broadcastUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="max-w-[200px] truncate sm:max-w-xs">
              {activeBroadcast.broadcastUrl}
            </span>
            <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              aria-label="View broadcast details"
              onClick={onViewDetails}
              size="sm"
              variant="ghost"
            >
              View Details
            </Button>
          )}
          <Button
            aria-label="End live stream"
            className="border-live/50 hover:bg-live/20"
            disabled={updateBroadcast.isPending}
            onClick={handleEndStream}
            size="sm"
            variant="outline"
          >
            {updateBroadcast.isPending ? "Ending..." : "End Stream"}
          </Button>
        </div>
      </div>
    </div>
  );
}
