import { db, schema } from "@osopit/db";
import { and, eq } from "drizzle-orm";
import { dispatchStreamWebhook } from "@/lib/streams/webhooks";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ provider: string }> }
): Promise<Response> {
  const params = await ctx.params;
  let event: Awaited<ReturnType<typeof dispatchStreamWebhook>>;
  try {
    event = await dispatchStreamWebhook(params.provider, req);
  } catch (err) {
    const message = err instanceof Error ? err.message : "webhook_error";
    return Response.json({ error: message }, { status: 400 });
  }

  if (!event) {
    return Response.json({ ok: true, ignored: true });
  }

  const isLive = event.event === "started";
  await db
    .update(schema.broadcasts)
    .set({
      isLive,
      startedAt: isLive ? new Date() : undefined,
      endedAt: isLive ? null : new Date(),
      lastHeartbeatAt: new Date(),
    })
    .where(
      and(
        eq(schema.broadcasts.streamProvider, event.ref.provider),
        eq(schema.broadcasts.streamId, event.ref.id)
      )
    );

  return Response.json({ ok: true });
}
