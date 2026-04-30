import { listActiveBroadcasts } from "@/lib/broadcast-service";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const wallet = url.searchParams.get("wallet")?.toLowerCase() ?? undefined;
  const broadcasts = await listActiveBroadcasts({ wallet });
  return Response.json({ broadcasts });
}
