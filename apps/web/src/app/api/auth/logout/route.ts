import { getSessionStore } from "@/lib/auth/session";

export async function POST(): Promise<Response> {
  const session = await getSessionStore();
  session.destroy();
  return Response.json({ ok: true });
}
