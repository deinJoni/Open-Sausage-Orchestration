import { db, schema } from "@osopit/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authErrorResponse, requireSession } from "@/lib/auth/session";

const HeartbeatBody = z.object({ broadcastId: z.string().uuid() });

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireSession();
    const body = await req.json().catch(() => null);
    const parsed = HeartbeatBody.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "invalid_body" }, { status: 400 });
    }

    const updated = await db
      .update(schema.broadcasts)
      .set({ lastHeartbeatAt: new Date(), isLive: true })
      .where(
        and(
          eq(schema.broadcasts.id, parsed.data.broadcastId),
          eq(schema.broadcasts.userId, session.wallet)
        )
      )
      .returning({ id: schema.broadcasts.id });

    if (updated.length === 0) {
      return Response.json({ error: "not_found" }, { status: 404 });
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
