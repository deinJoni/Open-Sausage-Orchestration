import { getSrc } from "@livepeer/react/external";
import { Livepeer } from "livepeer";
import { env } from "@/env";
import { getBroadcastById } from "@/lib/broadcast-service";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await ctx.params;
  const broadcast = await getBroadcastById(id);
  if (!broadcast) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  if (broadcast.provider !== "livepeer") {
    return Response.json({ error: "wrong_provider" }, { status: 400 });
  }

  const livepeer = new Livepeer({ apiKey: env.LIVEPEER_API_KEY });
  const response = await livepeer.playback.get(broadcast.streamId);
  const src = getSrc(response.playbackInfo);

  return Response.json(
    { src },
    { headers: { "Cache-Control": "private, max-age=30" } }
  );
}
