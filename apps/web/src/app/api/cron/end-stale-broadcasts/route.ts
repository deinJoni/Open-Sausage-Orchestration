import { env } from "@/env";
import { endStaleBroadcasts } from "@/lib/broadcast-service";

function isAuthorized(req: Request): boolean {
  const header = req.headers.get("authorization");
  if (header === `Bearer ${env.CRON_SECRET}`) {
    return true;
  }
  if (req.headers.get("x-vercel-cron") === "1") {
    return true;
  }
  return false;
}

export async function GET(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await endStaleBroadcasts();
  return Response.json(result);
}

export async function POST(req: Request): Promise<Response> {
  return await GET(req);
}
