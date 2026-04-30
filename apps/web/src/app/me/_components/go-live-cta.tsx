"use client";

import { Radio } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActiveBroadcast } from "@/hooks/use-active-broadcast";
import { TIME } from "@/lib/constants";

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

export function GoLiveCta() {
  const account = useAccount();
  const activeBroadcast = useActiveBroadcast(account.address);
  const broadcast = activeBroadcast.data;
  const isLive = activeBroadcast.isLive && broadcast !== null;
  const [duration, setDuration] = useState("0m");

  useEffect(() => {
    const startedAt = broadcast?.startedAt;
    if (!startedAt) {
      return;
    }
    const tick = () => setDuration(formatDuration(startedAt));
    tick();
    const interval = setInterval(tick, TIME.MS_PER_MINUTE);
    return () => clearInterval(interval);
  }, [broadcast?.startedAt]);

  return (
    <Card
      className={`relative overflow-hidden border p-6 backdrop-blur ${
        isLive ? "border-live/40 bg-live/5" : "border-border bg-background/80"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isLive ? "bg-live/20 text-live" : "bg-muted text-muted-foreground"
            }`}
          >
            <Radio className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">
                {isLive ? "You're live" : "Go Live"}
              </h3>
              {isLive && (
                <span className="flex items-center gap-1.5 rounded-full bg-live px-2 py-0.5 font-semibold text-live-foreground text-xs">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  LIVE
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {isLive
                ? `Streaming for ${duration}`
                : "Start a broadcast to your fans"}
            </p>
          </div>
        </div>
        <Link href="/me/live">
          <Button variant={isLive ? "outline" : "default"}>
            {isLive ? "Manage stream" : "Go live"}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
