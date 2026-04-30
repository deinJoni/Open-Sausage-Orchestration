import { db, schema } from "@osopit/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authErrorResponse, requireSession } from "@/lib/auth/session";
import { getStreamAdapter } from "@/lib/streams/registry";
import type { StreamProviderId } from "@/lib/streams/types";

const EndBody = z.object({ broadcastId: z.string().uuid() });

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireSession();
    const body = await req.json().catch(() => null);
    const parsed = EndBody.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "invalid_body" }, { status: 400 });
    }

    const updated = await db
      .update(schema.broadcasts)
      .set({ isLive: false, endedAt: new Date() })
      .where(
        and(
          eq(schema.broadcasts.id, parsed.data.broadcastId),
          eq(schema.broadcasts.userId, session.wallet)
        )
      )
      .returning();

    const row = updated[0];
    if (!row) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    try {
      const adapter = getStreamAdapter(row.streamProvider as StreamProviderId);
      if (adapter.deleteStream) {
        await adapter.deleteStream(
          {
            provider: row.streamProvider as StreamProviderId,
            id: row.streamId,
          },
          row.ingestSecretRef ?? undefined
        );
      }
    } catch {
      // best-effort
    }

    return Response.json({ ok: true });
  } catch (err) {
    const authResp = authErrorResponse(err);
    if (authResp) {
      return authResp;
    }
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
