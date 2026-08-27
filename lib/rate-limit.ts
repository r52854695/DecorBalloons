/**
 * Fixed-window in-memory rate limiter.
 *
 * Scope and limitation, stated plainly: this counts per server instance and
 * resets on redeploy. That is genuinely sufficient for a single-region site of
 * this size and it costs nothing, but it is NOT a distributed limit — if this
 * is ever deployed across multiple serverless regions or scaled horizontally,
 * swap the Map for Redis/Upstash behind this same interface. It exists to stop
 * one visitor (or one script) burning the AI budget, not to stop a botnet.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Opportunistic cleanup so the Map cannot grow without bound. */
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, b] of buckets) if (b.resetAt <= now) buckets.delete(key);
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    ok: existing.count <= limit,
    remaining,
    retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

/**
 * Best-effort client identity. Behind a proxy the left-most x-forwarded-for
 * entry is the client; without a trusted proxy this is spoofable, which is
 * acceptable for budget protection but must not be used for anything
 * security-sensitive.
 */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
