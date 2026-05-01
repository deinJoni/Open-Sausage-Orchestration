"use client";

import {
  Container as PlayerContainer,
  ErrorIndicator as PlayerErrorIndicator,
  LoadingIndicator as PlayerLoadingIndicator,
  Root as PlayerRoot,
  Video as PlayerVideo,
} from "@livepeer/react/player";
import { Loader2 } from "lucide-react";
import { useLivepeerPlaybackSrc } from "@/hooks/use-livepeer-playback-src";

type LivepeerPlayerProps = {
  broadcastId: string;
  title: string;
  className?: string;
  muted?: boolean;
  controls?: boolean;
};

export function LivepeerPlayer({
  broadcastId,
  title,
  className,
  muted = true,
  controls = true,
}: LivepeerPlayerProps) {
  const playback = useLivepeerPlaybackSrc(broadcastId);

  return (
    <PlayerRoot aspectRatio={null} lowLatency src={playback.src}>
      <PlayerContainer
        className={
          className ?? "relative h-full w-full overflow-hidden bg-background"
        }
      >
        <PlayerVideo
          className="h-full w-full"
          controls={controls}
          muted={muted}
          playsInline
          title={title}
        />
        <PlayerLoadingIndicator asChild>
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 text-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </PlayerLoadingIndicator>
        {playback.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 text-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        <PlayerErrorIndicator
          className="absolute inset-0 flex items-center justify-center bg-background/80 px-4 text-center text-foreground text-sm"
          matcher="all"
        >
          Stream unavailable
        </PlayerErrorIndicator>
      </PlayerContainer>
    </PlayerRoot>
  );
}
