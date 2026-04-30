"use client";

import { ExternalLink, Radio, Tv, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ResolvedBroadcast } from "@/hooks/use-active-broadcast";
import { useUpdateBroadcast } from "@/hooks/use-update-broadcast";
import { TIME } from "@/lib/constants";

type LiveBroadcastCardProps = {
  broadcast: ResolvedBroadcast;
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
    return { name: "Twitch", icon: <Tv className="h-4 w-4" /> };
  }
  return { name: "External", icon: <ExternalLink className="h-4 w-4" /> };
}

export function LiveBroadcastCard({ broadcast }: LiveBroadcastCardProps) {
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

  const provider = getProviderLabel(broadcast);
  const externalLink =
    broadcast.provider === "livepeer" ? null : broadcast.streamId;

  const handleEnd = () => {
    updateBroadcast.end(broadcast.id);
  };

  return (
    <TooltipProvider>
      <Card className="relative overflow-hidden border-live/30 bg-background/80 p-6 backdrop-blur before:absolute before:inset-0 before:bg-live/10">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-2 rounded-full bg-live px-3 py-1 font-semibold text-live-foreground text-xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                LIVE
              </span>
              <span className="text-md text-muted-foreground">{duration}</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-md text-muted-foreground">
              {provider.icon}
              <span>{provider.name}</span>
            </div>
            {externalLink ? (
              <a
                className="group flex items-center gap-2 text-brand hover:text-brand"
                href={externalLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="truncate text-md">{externalLink}</span>
                <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ) : (
              <span className="text-md text-muted-foreground">
                Playback ID: {broadcast.streamId}
              </span>
            )}
          </div>

          {broadcast.title && (
            <p className="text-foreground text-sm">{broadcast.title}</p>
          )}

          <Button
            className="w-full border-border hover:border-live/50 hover:bg-live/10"
            disabled={updateBroadcast.isEnding}
            onClick={handleEnd}
            variant="outline"
          >
            {updateBroadcast.isEnding ? "Ending..." : "End Stream"}
          </Button>

          {broadcast.guests.length > 0 && (
            <div className="text-center text-muted-foreground text-xs">
              with {broadcast.guests.length} collaborator
              {broadcast.guests.length === 1 ? "" : "s"}
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
}
