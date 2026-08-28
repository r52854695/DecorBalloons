import Link from "next/link";
import { business, formatPhone, telHref } from "@/data/business";

/**
 * The thin scrolling strip above the navigation.
 *
 * Two things are load-bearing here:
 *
 * 1. **The track is duplicated.** A marquee that translates a single copy from
 *    100% to -100% shows a visible gap as it wraps. Rendering the list twice
 *    and translating by exactly -50% means the second copy is in position the
 *    instant the first leaves, so the loop is seamless. The duplicate is
 *    aria-hidden — it is the same sentences, and a screen reader should not
 *    read them twice.
 *
 * 2. **It can be stopped.** Content that moves on its own for more than five
 *    seconds needs a way to stop it (WCAG 2.2.2). It pauses on hover and on
 *    keyboard focus, and under `prefers-reduced-motion` it does not animate at
 *    all — it becomes a normal horizontally scrollable strip the reader moves
 *    themselves.
 *
 * Claims are limited to things the site already commits to elsewhere. The
 * reference strip runs "Fastest decor in town!"; that is an unverifiable
 * superlative about a real business, so it is not repeated here.
 */
const ITEMS: { text: string; href: string }[] = [
  { text: `Same-day setup available — subject to slots`, href: "/contact" },
  { text: `Our own team sets up and clears away`, href: "/how-it-works" },
  { text: `Serving ${business.city} and nearby areas`, href: "/contact" },
  { text: `Clear quote before we start`, href: "/how-it-works" },
  { text: `Call or WhatsApp ${formatPhone(business.primaryPhone)}`, href: telHref(business.primaryPhone) },
];

function Track({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center"
      {...(duplicate ? { "aria-hidden": "true" } : {})}
    >
      {ITEMS.map((item) =>
        item.href.startsWith("tel:") ? (
          <a
            key={item.text}
            href={item.href}
            tabIndex={duplicate ? -1 : undefined}
            className="flex items-center gap-2 whitespace-nowrap px-5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-rose-deep"
          >
            {item.text}
            <span aria-hidden="true" className="text-rose-light">
              •
            </span>
          </a>
        ) : (
          <Link
            key={item.text}
            href={item.href}
            tabIndex={duplicate ? -1 : undefined}
            className="flex items-center gap-2 whitespace-nowrap px-5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-rose-deep"
          >
            {item.text}
            <span aria-hidden="true" className="text-rose-light">
              •
            </span>
          </Link>
        ),
      )}
    </div>
  );
}

export function AnnouncementMarquee() {
  return (
    <div className="marquee-strip relative w-full overflow-hidden border-b border-sand/70 bg-ivory">
      <div className="marquee-track flex items-center py-1.5">
        <Track />
        <Track duplicate />
      </div>
    </div>
  );
}
