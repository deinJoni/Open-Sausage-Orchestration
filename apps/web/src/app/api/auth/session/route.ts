import { getSession } from "@/lib/auth/session";

export async function GET(): Promise<Response> {
  const session = await getSession();
  return Response.json({ wallet: session?.wallet ?? null });
}
