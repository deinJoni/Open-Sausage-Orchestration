"use client";

import { ExternalLink, Radio, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ResolvedBroadcast } from "@/hooks/use-active-broadcast";
import { useUpdateBroadcast } from "@/hooks/use-update-broadcast";
import { TIME } from "@/lib/constants";

type LiveStatusBannerProps = {
  broadcast: ResolvedBroadcast;
  onViewDetails?: () => void;
};

function formatDuration(startedAtIso: string): string {
  const startMs = new Date(startedAtIso).getTime();
  const diffMs = Date.now() - startMs;
  const hours = Math.floor(diffMs / TIME.MS_PER_HOUR);
  const minutes = Math.floor((diffMs % TIME.MS_PER_HOUR) / TIME.MS_PER_MINUTE);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function getProviderLabel(broadcast: ResolvedBroadcast): {
  name: string;
  icon: React.ReactNode;
} {
  if (broadcast.provider === "livepeer") {
    return { name: "Livepeer", icon: <Radio className="h-4 w-4" /> };
  }
  const url = broadcast.streamId.toLowerCase();
  if (url.includes("youtube") || url.includes("youtu.be")) {
    return { name: "YouTube", icon: <Youtube className="h-4 w-4" /> };
  }
  if (url.includes("twitch.tv")) {
    return { name: "Twitch", icon: <span className="text-lg">📺</span> };
  }
  return { name: "External", icon: <ExternalLink className="h-4 w-4" /> };
}

export function LiveStatusBanner({
  broadcast,
  onViewDetails,
}: LiveStatusBannerProps) {
  const [duration, setDuration] = useState("0m");
  const updateBroadcast = useUpdateBroadcast();

  useEffect(() => {
    if (!broadcast.startedAt) {
      return;
    }
    const tick = () => setDuration(formatDuration(broadcast.startedAt ?? ""));
    tick();
    const interval = setInterval(tick, TIME.MS_PER_MINUTE);
    return () => clearInterval(interval);
  }, [broadcast.startedAt]);

  if (!broadcast.isLive) {
    return null;
  }

  const provider = getProviderLabel(broadcast);
  const externalLink =
    broadcast.provider === "livepeer" ? null : broadcast.streamId;

  const handleEnd = () => {
    updateBroadcast.end(broadcast.id);
  };

  return (
    <div
      aria-live="polite"
      className="relative overflow-hidden rounded-lg border border-live/30 bg-live/10 backdrop-blur"
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-6 items-center gap-2 rounded-full bg-live px-3 py-1 font-semibold text-live-foreground text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </span>

          <div className="flex items-center gap-2 text-foreground text-sm">
            {provider.icon}
            <span className="font-medium">{provider.name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{duration}</span>
          </div>

          {externalLink && (
            <a
              className="group flex items-center gap-1.5 text-brand text-xs hover:text-brand sm:text-sm"
              href={externalLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="max-w-[200px] truncate sm:max-w-xs">
                {externalLink}
              </span>
              <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          )}
        </div>

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
            disabled={updateBroadcast.isEnding}
            onClick={handleEnd}
            size="sm"
            variant="outline"
          >
            {updateBroadcast.isEnding ? "Ending..." : "End Stream"}
          </Button>
        </div>
      </div>
    </div>
  );
}
