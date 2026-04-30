import "server-only";
import { db, schema } from "@osopit/db";
import { and, desc, eq, isNull, lt, or, sql } from "drizzle-orm";
import { getStreamAdapter } from "@/lib/streams/registry";
import type {
  PlaybackDescriptor,
  StreamProviderId,
  StreamRef,
} from "@/lib/streams/types";

export type BroadcastRecord = typeof schema.broadcasts.$inferSelect;

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

const STALE_AFTER_MS = 90_000;

function toStreamRef(row: BroadcastRecord): StreamRef {
  return {
    provider: row.streamProvider as StreamProviderId,
    id: row.streamId,
    protocol: row.streamProtocol === "iframe" ? "iframe" : "hls",
  };
}

async function resolvePlayback(
  row: BroadcastRecord
): Promise<PlaybackDescriptor | null> {
  try {
    const adapter = getStreamAdapter(row.streamProvider as StreamProviderId);
    return await adapter.resolvePlayback(toStreamRef(row));
  } catch {
    return null;
  }
}

async function loadGuests(broadcastId: string): Promise<string[]> {
  const rows = await db
    .select({ wallet: schema.broadcastGuests.guestWallet })
    .from(schema.broadcastGuests)
    .where(
      and(
        eq(schema.broadcastGuests.broadcastId, broadcastId),
        isNull(schema.broadcastGuests.leftAt)
      )
    );
  return rows.map((r) => r.wallet);
}

export async function shapeBroadcast(
  row: BroadcastRecord
): Promise<ResolvedBroadcast> {
  const playback = await resolvePlayback(row);
  const guests = await loadGuests(row.id);
  return {
    id: row.id,
    userId: row.userId,
    isLive: row.isLive,
    provider: row.streamProvider as StreamProviderId,
    streamId: row.streamId,
    title: row.title,
    thumbnailUrl: row.thumbnailUrl,
    startedAt: row.startedAt ? row.startedAt.toISOString() : null,
    endedAt: row.endedAt ? row.endedAt.toISOString() : null,
    guests,
    playback,
  };
}

export async function getBroadcastById(
  id: string
): Promise<ResolvedBroadcast | null> {
  const rows = await db
    .select()
    .from(schema.broadcasts)
    .where(eq(schema.broadcasts.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return null;
  }
  return await shapeBroadcast(row);
}

export async function listActiveBroadcasts(opts?: {
  wallet?: string;
}): Promise<ResolvedBroadcast[]> {
  const filters = [eq(schema.broadcasts.isLive, true)];
  if (opts?.wallet) {
    filters.push(eq(schema.broadcasts.userId, opts.wallet.toLowerCase()));
  }
  const rows = await db
    .select()
    .from(schema.broadcasts)
    .where(and(...filters))
    .orderBy(desc(schema.broadcasts.startedAt));
  return await Promise.all(rows.map(shapeBroadcast));
}

export async function endStaleBroadcasts(): Promise<{ ended: number }> {
  const cutoff = new Date(Date.now() - STALE_AFTER_MS);
  const result = await db
    .update(schema.broadcasts)
    .set({
      isLive: false,
      endedAt: sql`COALESCE(${schema.broadcasts.endedAt}, now())`,
    })
    .where(
      and(
        eq(schema.broadcasts.isLive, true),
        or(
          lt(schema.broadcasts.lastHeartbeatAt, cutoff),
          isNull(schema.broadcasts.lastHeartbeatAt)
        )
      )
    )
    .returning({
      id: schema.broadcasts.id,
      provider: schema.broadcasts.streamProvider,
      providerStreamId: schema.broadcasts.ingestSecretRef,
      streamId: schema.broadcasts.streamId,
    });

  for (const row of result) {
    try {
      const adapter = getStreamAdapter(row.provider as StreamProviderId);
      if (adapter.deleteStream) {
        await adapter.deleteStream(
          {
            provider: row.provider as StreamProviderId,
            id: row.streamId,
          },
          row.providerStreamId ?? undefined
        );
      }
    } catch {
      // best-effort cleanup
    }
  }

  return { ended: result.length };
}
