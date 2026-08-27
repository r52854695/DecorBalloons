"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { BalloonGlyph } from "@/components/decor/BalloonGlyph";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import type { MegaItem } from "@/data/mega-menu";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The feature panel: a large photograph of whatever is currently hovered.
 *
 * The image is keyed on its src and swapped with `AnimatePresence mode="wait"`,
 * so the outgoing frame finishes before the incoming one starts — cross-fading
 * two photographs at partial opacity ghosts rather than blends (the same reason
 * the decoration showcase wipes instead of dissolving).
 *
 * Only ONE image is mounted at a time. That is deliberate: a menu holding
 * thirty categories must not put thirty photographs on the page.
 */
export function MegaMenuPreview({
  item,
  eyebrow,
}: {
  item: MegaItem;
  eyebrow: string;
}) {
  const { reduced } = useMotionBudget();
  const key = item.photo?.src ?? item.label;

  const frame = (
    <div className="absolute inset-0">
      {item.photo ? (
        <Image
          src={item.photo.src}
          alt={item.photo.alt}
          fill
          sizes="(min-width: 1280px) 34vw, 40vw"
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full bg-cream" />
      )}
      {/* Gradient sits on the image so the copy below stays readable
          whatever the photograph happens to be. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-ink/92 via-ink/45 to-ink/10"
      />
    </div>
  );

  return (
    <div
      className="relative h-full min-h-[19rem] overflow-hidden rounded-[6px] bg-cream"
      style={{ "--accent": `var(--color-${item.accent})` } as React.CSSProperties}
    >
      {reduced ? (
        frame
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="absolute inset-0"
          >
            {frame}
          </motion.div>
        </AnimatePresence>
      )}

      {/* One small branded accent, drifting. A single balloon — the brief asks
          for a whisper, not a cartoon.

          Driven by CSS, not Motion: an infinite Motion animation inside a
          subtree AnimatePresence manages never settles, which froze the
          `mode="wait"` swaps below and left the drawer mounted long after it
          closed. See the .mm-drift rule in globals.css. */}
      {!reduced && (
        <div aria-hidden="true" className="mm-drift pointer-events-none absolute right-5 top-5 opacity-70">
          <BalloonGlyph id={`mm-${item.accent}`} color="#E6BCA4" size={30} string={false} />
        </div>
      )}

      <div className="relative flex h-full flex-col justify-end p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${key}-copy`}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: EASE, delay: reduced ? 0 : 0.08 }}
          >
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-rose-light">
              {eyebrow}
            </p>
            <p className="mt-2 font-display text-2xl leading-tight text-ivory">
              {item.label}
            </p>
            <p className="mt-1.5 max-w-[26ch] text-[0.83rem] leading-relaxed text-ivory/75">
              {item.description}
            </p>

            {item.href && (
              <Link
                href={item.href}
                tabIndex={-1}
                className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ivory"
              >
                Explore
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
