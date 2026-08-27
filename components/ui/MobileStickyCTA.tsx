"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { business, formatPhone, telHref } from "@/data/business";
import { track } from "@/lib/analytics/events";

/**
 * Bottom CTA bar for phones.
 *
 * Appears only after the hero has been scrolled past, so it never covers the
 * first thing a visitor sees. A matching spacer is rendered in the root layout
 * so the bar can never sit on top of the last of the footer content.
 */
export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 520;
    setVisible((prev) => (prev === next ? prev : next));
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-ivory/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <div className="flex items-center gap-2.5 px-4 py-3">
            <a
              href={telHref(business.primaryPhone)}
              onClick={() => track("call_clicked", { source: "mobile_sticky" })}
              aria-label={`Call ${formatPhone(business.primaryPhone)}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/18 text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z" />
              </svg>
            </a>
            <Link
              href="/contact"
              onClick={() => track("hero_cta_clicked", { source: "mobile_sticky" })}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ivory"
            >
              <span aria-hidden="true">🎈</span>
              Plan my celebration
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
