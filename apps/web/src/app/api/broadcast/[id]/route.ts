import { getBroadcastById } from "@/lib/broadcast-service";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
): Promise<Response> {
  const params = await ctx.params;
  const broadcast = await getBroadcastById(params.id);
  if (!broadcast) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json({ broadcast });
}
