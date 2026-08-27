import { NextResponse } from "next/server";
import { getProvider, planBriefSchema } from "@/lib/ai";
import { clientKey, rateLimit } from "@/lib/rate-limit";

/**
 * Party Pal recommendation endpoint.
 *
 * Runs on the server so OPENAI_API_KEY is never exposed to the browser. The
 * request body is schema-validated before it reaches any provider, and every
 * string field is length-capped in the schema so nothing unbounded is
 * forwarded to a model.
 */

export const runtime = "nodejs";
/** Never cached — every brief is different and none should be shared. */
export const dynamic = "force-dynamic";

const LIMIT = { limit: 12, windowMs: 60_000 };

export async function POST(req: Request) {
  const gate = rateLimit(`chat:${clientKey(req)}`, LIMIT);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Give it a moment and try again." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = planBriefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "That brief did not look right. Please try again." },
      { status: 400 },
    );
  }

  try {
    const recommendation = await getProvider().recommend(parsed.data);
    return NextResponse.json(
      { recommendation },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    // Log the shape of the failure, never the payload or any credential.
    console.error(
      "[api/chat] recommendation failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return NextResponse.json(
      { error: "We could not build a plan just now. Please message us directly." },
      { status: 500 },
    );
  }
}
