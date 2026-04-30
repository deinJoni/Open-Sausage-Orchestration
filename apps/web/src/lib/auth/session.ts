import { db, schema } from "@osopit/db";
import { eq } from "drizzle-orm";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { env } from "@/env";

export type SessionData = {
  walletAddress?: string;
  nonce?: string;
};

const COOKIE_NAME = "osopit_session";

const sessionOptions: SessionOptions = {
  cookieName: COOKIE_NAME,
  password: env.SESSION_SECRET,
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NEXT_PUBLIC_APP_ENV === "prod",
    path: "/",
  },
};

export async function getSessionStore() {
  const cookieStore = await cookies();
  return await getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function getSession(): Promise<{ wallet: string } | null> {
  const store = await getSessionStore();
  if (!store.walletAddress) {
    return null;
  }
  return { wallet: store.walletAddress };
}

export async function requireSession(): Promise<{ wallet: string }> {
  const session = await getSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}

export async function requireOwnerOf(
  walletAddress: string
): Promise<{ wallet: string }> {
  const session = await requireSession();
  if (session.wallet.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new ForbiddenError();
  }
  return session;
}

export async function lookupUserByWallet(walletAddress: string) {
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.walletAddress, walletAddress.toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

export class UnauthorizedError extends Error {
  status = 401;
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  status = 403;
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}

export function authErrorResponse(err: unknown): Response | null {
  if (err instanceof UnauthorizedError) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (err instanceof ForbiddenError) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  return null;
}
