import { generateNonce } from "siwe";
import { getSessionStore } from "@/lib/auth/session";

export async function POST(): Promise<Response> {
  const session = await getSessionStore();
  const nonce = generateNonce();
  session.nonce = nonce;
  await session.save();
  return Response.json({ nonce });
}
