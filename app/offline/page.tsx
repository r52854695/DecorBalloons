import type { Metadata } from "next";
import Link from "next/link";
import { business, formatPhone, telHref, whatsappHref } from "@/data/business";

export const metadata: Metadata = {
  title: "You are offline",
  robots: { index: false, follow: false },
};

/**
 * Shown by the service worker when a navigation fails and nothing useful is
 * cached.
 *
 * Deliberately still useful rather than a dead end: the phone number and
 * WhatsApp link are `tel:`/`wa.me` handoffs that work with no connection at
 * all, so someone who lost signal mid-enquiry can still reach the studio.
 */
export default function OfflinePage() {
  return (
    <section className="section-y">
      <div className="shell max-w-xl pt-[calc(7rem+var(--marquee-h))] text-center">
        <p className="eyebrow">No connection</p>
        <h1 className="mt-3 font-display text-[2rem] leading-tight text-ink md:text-[2.6rem]">
          You are offline.
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
          The page you asked for needs a connection. Anything you have already
          looked at should still open.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={telHref(business.primaryPhone)}
            className="rounded-full bg-ink px-6 py-3 text-[0.85rem] font-semibold text-ivory"
          >
            Call {formatPhone(business.primaryPhone)}
          </a>
          <a href={whatsappHref()} className="text-[0.85rem] text-ink-muted underline">
            Or message us on WhatsApp
          </a>
          <Link href="/" className="mt-2 text-[0.8rem] text-ink-faint underline">
            Try the homepage again
          </Link>
        </div>
      </div>
    </section>
  );
}
