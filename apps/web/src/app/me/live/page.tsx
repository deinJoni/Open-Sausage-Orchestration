"use client";

import { ArrowLeft, Copy, Info, Radio } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { LiveBroadcastCard } from "@/app/me/_components/live-broadcast-card";
import { StartBroadcastForm } from "@/app/me/_components/start-broadcast-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActiveBroadcast } from "@/hooks/use-active-broadcast";
import { useOwnedProfile } from "@/hooks/use-owned-profile";
import { useUpdateBroadcast } from "@/hooks/use-update-broadcast";
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

export default function MeLivePage() {
  const account = useAccount();
  const activeBroadcast = useActiveBroadcast(account.address);
  const updateBroadcast = useUpdateBroadcast();
  const ownedProfile = useOwnedProfile();

  const broadcast = activeBroadcast.data;
  const isLive = activeBroadcast.isLive && broadcast !== null;
  const subdomainName = ownedProfile.data?.subdomain?.name ?? "";

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

  // If we landed on this page with an already-active broadcast (refresh, navigation
  // from /me), the in-memory `activeBroadcastId` in useUpdateBroadcast is null and
  // heartbeat isn't running. Adopt the existing broadcast so heartbeat resumes.
  const adoptBroadcast = updateBroadcast.adoptBroadcast;
  const broadcastId = broadcast?.id ?? null;
  const sessionActiveId = updateBroadcast.activeBroadcastId;
  useEffect(() => {
    if (!broadcastId) {
      return;
    }
    if (sessionActiveId === broadcastId) {
      return;
    }
    adoptBroadcast(broadcastId);
  }, [broadcastId, sessionActiveId, adoptBroadcast]);

  if (!(isLive && broadcast)) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl space-y-6 p-4 pb-safe">
        <div>
          <Link
            className="mb-4 inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
            href="/me"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to settings
          </Link>
          <h1 className="font-bold text-2xl text-foreground">Go Live</h1>
          <p className="text-muted-foreground text-sm">
            Start a broadcast to your fans.
          </p>
        </div>

        <StartBroadcastForm />
      </div>
    );
  }

  const liveUrl =
    typeof window !== "undefined" && subdomainName
      ? `${window.location.origin}/${subdomainName}/live`
      : "";

  const handleCopyLiveUrl = () => {
    if (!liveUrl) {
      return;
    }
    navigator.clipboard.writeText(liveUrl).then(
      () => toast.success("Live link copied"),
      () => toast.error("Copy failed")
    );
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl space-y-6 p-4 pb-safe">
      <div>
        <Link
          className="mb-4 inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
          href="/me"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to settings
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex h-7 items-center gap-2 rounded-full bg-live px-3 py-1 font-semibold text-live-foreground text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </span>
          <span className="text-muted-foreground text-sm">
            Streaming for {duration}
          </span>
        </div>
        <h1 className="mt-2 font-bold text-2xl text-foreground">
          Your broadcast
        </h1>
      </div>

      <LiveBroadcastCard broadcast={broadcast} />

      {broadcast.provider === "livepeer" && !updateBroadcast.ingest && (
        <Card className="flex items-start gap-3 border-border bg-background/80 p-4 backdrop-blur">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <div className="space-y-1 text-muted-foreground text-sm">
            <p className="text-foreground">RTMP credentials hidden</p>
            <p>
              Stream keys are shown only once when you start a stream. If you've
              lost them, end this broadcast and start a new one to receive fresh
              credentials.
            </p>
          </div>
        </Card>
      )}

      {subdomainName && (
        <Card className="border-border bg-background/80 p-4 backdrop-blur">
          <div className="mb-3 flex items-center gap-2">
            <Radio className="h-4 w-4 text-brand" />
            <h3 className="font-semibold text-foreground">
              Share your live page
            </h3>
          </div>
          <p className="mb-3 text-muted-foreground text-sm">
            Send this link to your fans — it's the lean-back view of your
            stream.
          </p>
          <div className="flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-2">
            <span className="flex-1 truncate text-foreground text-sm">
              {liveUrl}
            </span>
            <Button
              aria-label="Copy live link"
              onClick={handleCopyLiveUrl}
              size="sm"
              variant="outline"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Link href={`/${subdomainName}/live`}>
              <Button size="sm" variant="ghost">
                Open
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
