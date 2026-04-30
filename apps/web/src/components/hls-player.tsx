"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

type HlsPlayerProps = {
  src: string;
  title: string;
  className?: string;
};

export function HlsPlayer({ src, title, className }: HlsPlayerProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);

  return (
    <video
      autoPlay
      className={className ?? "h-full w-full bg-background"}
      controls
      muted
      playsInline
      ref={ref}
      title={title}
    />
  );
}
