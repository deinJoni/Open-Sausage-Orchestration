"use client";

import { ArrowLeft, ExternalLink, Gift } from "lucide-react";
import Link from "next/link";
import { ArtistAvatar } from "@/components/artist-avatar";
import { HlsPlayer } from "@/components/hls-player";
import { StreamEmbed } from "@/components/stream-embed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ResolvedBroadcast } from "@/hooks/use-active-broadcast";

type LiveViewerProps = {
  displayName: string;
  avatar: string;
  liveBroadcast: ResolvedBroadcast | null;
};

export function LiveViewer({
  displayName,
  avatar,
  liveBroadcast,
}: LiveViewerProps) {
  const playback = liveBroadcast?.playback ?? null;
  const isLive = liveBroadcast?.isLive === true;

  if (!(isLive && playback)) {
    return <OfflineCard avatar={avatar} displayName={displayName} />;
  }

  if (playback.type === "iframe") {
    return (
      <FullscreenContainer>
        <div className="flex-1">
          <StreamEmbed
            artistName={displayName}
            showPlatformBadge={false}
            streamUrl={liveBroadcast.streamId}
            taggedArtists={liveBroadcast.guests}
          />
        </div>
        <ChromeBar avatar={avatar} displayName={displayName} />
      </FullscreenContainer>
    );
  }

  if (playback.type === "hls") {
    return (
      <FullscreenContainer>
        <div className="flex-1 bg-background">
          <HlsPlayer
            className="h-full w-full bg-background"
            src={playback.src}
            title={`${displayName} live`}
          />
        </div>
        <ChromeBar avatar={avatar} displayName={displayName} />
      </FullscreenContainer>
    );
  }

  return (
    <ExternalCard
      avatar={avatar}
      displayName={displayName}
      href={playback.href}
    />
  );
}

function FullscreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-16 flex min-h-[100dvh] w-full flex-col bg-background pt-16">
      {children}
    </div>
  );
}

type ChromeBarProps = {
  displayName: string;
  avatar: string;
};

function ChromeBar({ displayName, avatar }: ChromeBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-border border-t bg-background/80 px-4 py-3 backdrop-blur">
      <Link
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
        href={`/${displayName}`}
      >
        <ArtistAvatar
          avatarUrl={avatar}
          className="border border-border"
          name={displayName}
          size="sm"
        />
        <span className="font-medium text-foreground text-sm">
          {displayName}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-live px-2 py-0.5 font-semibold text-live-foreground text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          LIVE
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <Link href={`/${displayName}`}>
          <Button size="sm" variant="ghost">
            View profile
          </Button>
        </Link>
        <Link href={`/${displayName}/gift`}>
          <Button className="gap-2" size="sm">
            <Gift className="h-3.5 w-3.5" />
            Send gift
          </Button>
        </Link>
      </div>
    </div>
  );
}

type OfflineCardProps = {
  displayName: string;
  avatar: string;
};

function OfflineCard({ displayName, avatar }: OfflineCardProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md flex-col items-center justify-center px-4">
      <Card className="w-full border-border bg-background/80 p-8 text-center backdrop-blur">
        <div className="mb-6 flex justify-center">
          <ArtistAvatar
            avatarUrl={avatar}
            className="border-2 border-border"
            name={displayName}
            size="lg"
          />
        </div>
        <h1 className="mb-2 font-bold text-2xl text-foreground">
          {displayName} is not live right now
        </h1>
        <p className="mb-6 text-muted-foreground text-sm">
          Check back soon, or visit their profile.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href={`/${displayName}`}>
            <Button className="w-full gap-2 sm:w-auto" variant="outline">
              <ArrowLeft className="h-4 w-4" />
              View profile
            </Button>
          </Link>
          <Link href={`/${displayName}/gift`}>
            <Button className="w-full gap-2 sm:w-auto">
              <Gift className="h-4 w-4" />
              Send gift
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

type ExternalCardProps = {
  displayName: string;
  avatar: string;
  href: string;
};

function ExternalCard({ displayName, avatar, href }: ExternalCardProps) {
  let host = href;
  try {
    host = new URL(href).host;
  } catch {
    host = href;
  }
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md flex-col items-center justify-center px-4">
      <Card className="w-full border-border bg-background/80 p-8 text-center backdrop-blur">
        <div className="mb-6 flex justify-center">
          <ArtistAvatar
            avatarUrl={avatar}
            className="border-2 border-live"
            name={displayName}
            size="lg"
          />
        </div>
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-live px-2 py-0.5 font-semibold text-live-foreground text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            LIVE
          </span>
        </div>
        <h1 className="mb-2 font-bold text-2xl text-foreground">
          {displayName} is streaming on an external platform
        </h1>
        <p className="mb-6 text-muted-foreground text-sm">{host}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href={`/${displayName}`}>
            <Button className="w-full gap-2 sm:w-auto" variant="outline">
              <ArrowLeft className="h-4 w-4" />
              View profile
            </Button>
          </Link>
          <a href={href} rel="noopener noreferrer" target="_blank">
            <Button className="w-full gap-2 sm:w-auto">
              <ExternalLink className="h-4 w-4" />
              Watch on {host}
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
