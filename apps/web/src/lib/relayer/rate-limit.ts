import "server-only";

/**
 * Minimal in-memory sliding-window rate limiter for the relay endpoint.
 *
 * Resets on cold starts (single-instance Vercel functions). For prod scale,
 * swap the `Map` for Upstash Redis or similar — interface is preserved.
 *
 * Two named buckets are exported:
 *   - `perRecipient`: one register per recipient address per 24h.
 *     A recipient can only own one subdomain anyway (registry enforces it),
 *     so this is belt-and-suspenders against repeated submission.
 *   - `perIp`: ten registers per source IP per hour.
 *     Catches bot traffic that rotates recipient addresses.
 */

type Bucket = {
  capacity: number;
  windowMs: number;
  hits: Map<string, number[]>;
};

function take(
  bucket: Bucket,
  key: string
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const cutoff = now - bucket.windowMs;
  const previous = bucket.hits.get(key) ?? [];
  const fresh = previous.filter((t) => t > cutoff);

  if (fresh.length >= bucket.capacity) {
    const oldest = fresh[0] ?? now;
    return { allowed: false, retryAfterMs: oldest + bucket.windowMs - now };
  }

  fresh.push(now);
  bucket.hits.set(key, fresh);
  return { allowed: true };
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const recipientBucket: Bucket = {
  capacity: 1,
  windowMs: DAY_MS,
  hits: new Map(),
};

const ipBucket: Bucket = {
  capacity: 10,
  windowMs: HOUR_MS,
  hits: new Map(),
};

export const rateLimit = {
  perRecipient(address: string) {
    return take(recipientBucket, address.toLowerCase());
  },
  perIp(ip: string) {
    return take(ipBucket, ip);
  },
};
