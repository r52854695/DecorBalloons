/**
 * Provider-agnostic analytics.
 *
 * The site never imports a vendor SDK. Events are pushed to `dataLayer` (GTM),
 * forwarded to `gtag` if a GA4 snippet happens to be installed, and always
 * re-dispatched as a DOM CustomEvent so any other tool can subscribe without
 * this file changing. Swapping providers is a tag-manager decision, not a code
 * change — brief section 55.
 */

export const ANALYTICS_EVENTS = [
  "hero_cta_clicked",
  "whatsapp_clicked",
  "call_clicked",
  "chat_opened",
  "chat_completed",
  "lead_form_started",
  "lead_form_submitted",
  "occasion_selected",
  "gallery_opened",
  "party_mode_activated",
  "decoration_viewed",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, payload: Payload = {}): void {
  if (typeof window === "undefined") return;

  const detail = { event, ...payload };

  try {
    window.dataLayer?.push(detail);
    window.gtag?.("event", event, payload);
    window.dispatchEvent(new CustomEvent("decorballoons:analytics", { detail }));
  } catch {
    // Analytics must never break the page it is measuring.
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, payload);
  }
}
