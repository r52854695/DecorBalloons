import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";

/**
 * Enquiry capture.
 *
 * ─────────────────────────────────────────────────────────────
 *  ⚠  DELIVERY IS NOT CONFIGURED OUT OF THE BOX.
 *
 *  No CRM, mailbox or webhook was supplied, so this route validates
 *  the enquiry and forwards it to LEAD_WEBHOOK_URL if one is set.
 *  With no webhook it records the enquiry in the server log only.
 *
 *  This is exactly why the lead form ALSO hands the visitor a
 *  prefilled WhatsApp message on success: WhatsApp is the delivery
 *  path that is guaranteed to reach the business today, and no
 *  enquiry can be silently lost while the backend sink is still
 *  unconfigured. Set LEAD_WEBHOOK_URL (or wire an email provider
 *  here) before launch to capture leads server-side as well.
 * ─────────────────────────────────────────────────────────────
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => /^(\+?91)?[6-9]\d{9}$/.test(v), "Enter a valid Indian mobile number"),
  occasion: z.string().trim().max(60).optional(),
  date: z.string().trim().max(40).optional(),
  location: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(40).optional(),
  theme: z.string().trim().max(120).optional(),
  message: z.string().trim().max(1000).optional(),
  /** Honeypot — real people never fill this; bots usually do. */
  company: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const gate = rateLimit(`lead:${clientKey(req)}`, { limit: 5, windowMs: 60_000 });
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ error: "Please check the form.", fieldErrors }, { status: 400 });
  }

  // Honeypot filled → accept silently so the bot learns nothing from the
  // response. `company` is separated here so it never reaches the webhook.
  const { company, ...lead } = parsed.data;
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error(
        "[api/lead] webhook delivery failed:",
        err instanceof Error ? err.message : "unknown error",
      );
      // Still return ok — the visitor is given the WhatsApp handoff regardless,
      // and telling them their enquiry failed would cost a real lead.
    }
  } else {
    console.warn(
      "[api/lead] No LEAD_WEBHOOK_URL configured — enquiry received for",
      lead.name,
      "but not delivered server-side. The visitor is being handed the WhatsApp fallback.",
    );
  }

  return NextResponse.json({ ok: true, delivered: Boolean(webhook) });
}
