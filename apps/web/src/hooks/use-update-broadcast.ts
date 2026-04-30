"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import type { ResolvedBroadcast } from "@/hooks/use-active-broadcast";
import { useSiwe } from "@/hooks/use-siwe";
import type { IngestCredentials, StreamProviderId } from "@/lib/streams/types";

export type StartBroadcastInput = {
  provider: StreamProviderId;
  title?: string;
  url?: string;
  guests?: string[];
};

export type StartBroadcastResponse = {
  broadcast: ResolvedBroadcast;
  ingest: IngestCredentials | null;
};

const HEARTBEAT_INTERVAL_MS = 30_000;

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`${res.status} ${errBody || res.statusText}`);
  }
  return (await res.json()) as T;
}

export function useUpdateBroadcast() {
  const account = useAccount();
  const siwe = useSiwe();
  const queryClient = useQueryClient();
  const [activeBroadcastId, setActiveBroadcastId] = useState<string | null>(
    null
  );
  const [ingest, setIngest] = useState<IngestCredentials | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopHeartbeat = () => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  };

  const startHeartbeat = (broadcastId: string) => {
    stopHeartbeat();
    heartbeatRef.current = setInterval(async () => {
      try {
        await fetch("/api/broadcast/heartbeat", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ broadcastId }),
        });
      } catch {
        // ignore — next interval will retry
      }
    }, HEARTBEAT_INTERVAL_MS);
  };

  useEffect(
    () => () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    },
    []
  );

  const ensureSession = async () => {
    if (siwe.isWalletMatched) {
      return;
    }
    if (!account.address) {
      throw new Error("Connect your wallet first");
    }
    await siwe.signInAsync();
  };

  const start = useMutation({
    mutationFn: async (input: StartBroadcastInput) => {
      await ensureSession();
      const data = await postJson<StartBroadcastResponse>(
        "/api/broadcast/start",
        input
      );
      return data;
    },
    onSuccess: (data) => {
      setActiveBroadcastId(data.broadcast.id);
      setIngest(data.ingest);
      startHeartbeat(data.broadcast.id);
      queryClient.invalidateQueries({ queryKey: ["broadcasts", "active"] });
      toast.success("Broadcast started");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to start");
    },
  });

  const end = useMutation({
    mutationFn: async (broadcastId?: string) => {
      const id = broadcastId ?? activeBroadcastId;
      if (!id) {
        throw new Error("No active broadcast");
      }
      await ensureSession();
      await postJson("/api/broadcast/end", { broadcastId: id });
      return id;
    },
    onSuccess: () => {
      stopHeartbeat();
      setActiveBroadcastId(null);
      setIngest(null);
      queryClient.invalidateQueries({ queryKey: ["broadcasts", "active"] });
      toast.success("Broadcast ended");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to end");
    },
  });

  const adoptBroadcast = (broadcastId: string) => {
    setActiveBroadcastId(broadcastId);
    startHeartbeat(broadcastId);
  };

  return {
    start: start.mutate,
    startAsync: start.mutateAsync,
    end: end.mutate,
    endAsync: end.mutateAsync,
    isStarting: start.isPending,
    isEnding: end.isPending,
    isPending: start.isPending || end.isPending,
    activeBroadcastId,
    ingest,
    adoptBroadcast,
  };
}
