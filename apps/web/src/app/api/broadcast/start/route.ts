import { db, schema } from "@osopit/db";
import { z } from "zod";
import { authErrorResponse, requireSession } from "@/lib/auth/session";
import { shapeBroadcast } from "@/lib/broadcast-service";
import { getStreamAdapter } from "@/lib/streams/registry";
import type { StreamProviderId } from "@/lib/streams/types";

const StartBody = z.object({
  provider: z.enum(["livepeer", "iframe", "external"]),
  title: z.string().trim().max(200).optional(),
  url: z.string().url().optional(),
  guests: z.array(z.string()).max(20).optional(),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireSession();
    const body = await req.json().catch(() => null);
    const parsed = StartBody.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "invalid_body", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const provider = parsed.data.provider as StreamProviderId;
    const adapter = getStreamAdapter(provider);
    if (!adapter.createStream) {
      return Response.json({ error: "provider_unsupported" }, { status: 400 });
    }

    const created = await adapter.createStream({
      userWallet: session.wallet,
      title: parsed.data.title,
      url: parsed.data.url,
    });

    await db
      .insert(schema.users)
      .values({ walletAddress: session.wallet })
      .onConflictDoNothing();

    const isLive = provider !== "livepeer";
    const inserted = await db
      .insert(schema.broadcasts)
      .values({
        userId: session.wallet,
        isLive,
        streamProvider: provider,
        streamId: created.ref.id,
        streamProtocol: created.ref.protocol ?? null,
        ingestSecretRef: created.providerStreamId ?? null,
        title: parsed.data.title ?? null,
        startedAt: isLive ? new Date() : null,
        lastHeartbeatAt: new Date(),
      })
      .returning();

    const row = inserted[0];
    if (!row) {
      throw new Error("Failed to insert broadcast");
    }

    const guests = parsed.data.guests ?? [];
    if (guests.length > 0) {
      await db.insert(schema.broadcastGuests).values(
        guests.map((g) => ({
          broadcastId: row.id,
          guestWallet: g.toLowerCase(),
        }))
      );
    }

    const shaped = await shapeBroadcast(row);
    return Response.json({
      broadcast: shaped,
      ingest: created.ingest ?? null,
    });
  } catch (err) {
    const authResp = authErrorResponse(err);
    if (authResp) {
      return authResp;
    }
    const message = err instanceof Error ? err.message : "internal_error";
    return Response.json({ error: message }, { status: 500 });
  }
}
