"use client";

import {
  AudioEnabledIndicator,
  AudioEnabledTrigger,
  Container as BroadcastContainer,
  Controls as BroadcastControls,
  ErrorIndicator as BroadcastErrorIndicator,
  LoadingIndicator as BroadcastLoadingIndicator,
  Root as BroadcastRoot,
  Video as BroadcastVideo,
  EnabledIndicator,
  EnabledTrigger,
  VideoEnabledIndicator,
  VideoEnabledTrigger,
} from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import {
  Loader2,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IngestCredentials } from "@/lib/streams/types";

type BrowserBroadcasterProps = {
  ingest: IngestCredentials;
  className?: string;
};

function resolveIngestUrl(ingest: IngestCredentials): string | null {
  if (ingest.type === "whip") {
    return ingest.whipUrl;
  }
  if (ingest.whipUrl) {
    return ingest.whipUrl;
  }
  return getIngest(ingest.streamKey);
}

export function BrowserBroadcaster({
  ingest,
  className,
}: BrowserBroadcasterProps) {
  const ingestUrl = resolveIngestUrl(ingest);

  return (
    <BroadcastRoot aspectRatio={16 / 9} ingestUrl={ingestUrl}>
      <BroadcastContainer
        className={
          className ??
          "relative overflow-hidden rounded-md border border-border bg-black"
        }
      >
        <BroadcastVideo className="h-full w-full" title="Broadcast preview" />

        <BroadcastLoadingIndicator asChild>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </BroadcastLoadingIndicator>

        <BroadcastErrorIndicator
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 text-center text-sm text-white"
          matcher="permissions"
        >
          <span className="font-semibold">Camera or microphone blocked</span>
          <span className="text-white/70 text-xs">
            Allow access in your browser settings to broadcast.
          </span>
        </BroadcastErrorIndicator>

        <BroadcastErrorIndicator
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 text-center text-sm text-white"
          matcher="fallback"
        >
          <span className="font-semibold">
            Couldn't start the in-browser broadcast
          </span>
          <span className="text-white/70 text-xs">
            Try a recent Chrome, Edge, or Safari, or use the OBS option below.
          </span>
        </BroadcastErrorIndicator>

        <EnabledIndicator
          className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-live px-2 py-0.5 font-semibold text-live-foreground text-xs"
          matcher={true}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          LIVE
        </EnabledIndicator>

        <BroadcastControls className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-2 rounded-md bg-black/60 px-3 py-2 backdrop-blur">
          <EnabledTrigger asChild>
            <Button size="sm" type="button">
              <EnabledIndicator asChild matcher={false}>
                <span>Go live</span>
              </EnabledIndicator>
              <EnabledIndicator asChild matcher={true}>
                <span>Stop</span>
              </EnabledIndicator>
            </Button>
          </EnabledTrigger>

          <div className="flex items-center gap-1">
            <AudioEnabledTrigger asChild>
              <Button
                className="text-white hover:bg-white/10 hover:text-white"
                size="icon"
                type="button"
                variant="ghost"
              >
                <AudioEnabledIndicator asChild matcher={true}>
                  <Mic className="h-4 w-4" />
                </AudioEnabledIndicator>
                <AudioEnabledIndicator asChild matcher={false}>
                  <MicOff className="h-4 w-4" />
                </AudioEnabledIndicator>
              </Button>
            </AudioEnabledTrigger>

            <VideoEnabledTrigger asChild>
              <Button
                className="text-white hover:bg-white/10 hover:text-white"
                size="icon"
                type="button"
                variant="ghost"
              >
                <VideoEnabledIndicator asChild matcher={true}>
                  <VideoIcon className="h-4 w-4" />
                </VideoEnabledIndicator>
                <VideoEnabledIndicator asChild matcher={false}>
                  <VideoOff className="h-4 w-4" />
                </VideoEnabledIndicator>
              </Button>
            </VideoEnabledTrigger>
          </div>
        </BroadcastControls>
      </BroadcastContainer>
    </BroadcastRoot>
  );
}
