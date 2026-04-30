"use client";

import { useQuery } from "@tanstack/react-query";
import type { PlaybackDescriptor, StreamProviderId } from "@/lib/streams/types";

export type ResolvedBroadcast = {
  id: string;
  userId: string;
  isLive: boolean;
  provider: StreamProviderId;
  streamId: string;
  title: string | null;
  thumbnailUrl: string | null;
  startedAt: string | null;
  endedAt: string | null;
  guests: string[];
  playback: PlaybackDescriptor | null;
};

const ACTIVE_KEY = ["broadcasts", "active"] as const;

async function fetchActive(wallet?: string): Promise<ResolvedBroadcast[]> {
  const url = wallet
    ? `/api/broadcast/active?wallet=${encodeURIComponent(wallet.toLowerCase())}`
    : "/api/broadcast/active";
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as { broadcasts: ResolvedBroadcast[] };
  return data.broadcasts;
}

export function useActiveBroadcasts() {
  return useQuery({
    queryKey: [...ACTIVE_KEY, "all"],
    queryFn: () => fetchActive(),
    refetchInterval: 15_000,
    staleTime: 5000,
  });
}

export function useActiveBroadcast(wallet?: string | null) {
  const lower = wallet ? wallet.toLowerCase() : null;
  const query = useQuery({
    queryKey: [...ACTIVE_KEY, "user", lower],
    queryFn: () => fetchActive(lower ?? undefined),
    enabled: Boolean(lower),
    refetchInterval: 15_000,
    staleTime: 5000,
  });
  const broadcast = query.data?.[0] ?? null;
  return {
    data: broadcast,
    isLive: Boolean(broadcast?.isLive),
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
