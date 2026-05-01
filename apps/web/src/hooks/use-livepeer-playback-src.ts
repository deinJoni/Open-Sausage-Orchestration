"use client";

import type { Src } from "@livepeer/react";
import { useQuery } from "@tanstack/react-query";

type PlaybackSrcResponse = { src: Src[] | null };

async function fetchPlaybackSrc(broadcastId: string): Promise<Src[] | null> {
  const res = await fetch(`/api/broadcast/${broadcastId}/playback-src`);
  if (!res.ok) {
    throw new Error(`playback-src ${res.status}`);
  }
  const data = (await res.json()) as PlaybackSrcResponse;
  return data.src;
}

export function useLivepeerPlaybackSrc(broadcastId: string | null) {
  const query = useQuery({
    queryKey: ["livepeer-playback-src", broadcastId],
    queryFn: () => fetchPlaybackSrc(broadcastId as string),
    enabled: Boolean(broadcastId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
  return {
    src: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
