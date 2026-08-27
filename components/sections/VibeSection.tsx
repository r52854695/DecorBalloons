"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { TextReveal } from "@/components/motion/TextReveal";
import { vibes, type Vibe } from "@/data/vibes";

/**
 * "Choose your vibe" — horizontal storytelling driven by vertical scroll.
 *
 * Scroll hijacking is only applied where it behaves well: on a fine-pointer
 * desktop viewport. On phones the same panels become a native scroll-snap
 * carousel, because commandeering touch scrolling on a small screen is how
 * this pattern earns its bad reputation. Under reduced motion it degrades
 * again, to a plain stacked grid.
 */

function VibePanel({ vibe, index, scene }: { vibe: Vibe; index: number; scene: ReactNode }) {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-[6px] border border-sand/70 bg-paper"
      aria-labelledby={`vibe-${vibe.slug}`}
    >
      {/*
        A percentage height, not an aspect ratio: these panels live inside a
        fixed-height sticky stage, and an aspect-driven scene on a 46vw panel
        computes taller than the panel itself, pushing every word of the copy
        out of the visible area.
      */}
      <div className="relative h-[48%] shrink-0 overflow-hidden bg-cream">
        {scene}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
        <h3 id={`vibe-${vibe.slug}`} className="mt-2 font-display text-3xl text-ink md:text-4xl">
          {vibe.name}
        </h3>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">{vibe.blurb}</p>

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
          {vibe.swatches.map((s) => (
            <li key={s.hex} className="flex items-center gap-2 text-[0.76rem] text-ink-soft">
              <span
                aria-hidden="true"
                className="block h-4 w-4 rounded-full ring-1 ring-ink/10"
                style={{ backgroundColor: s.hex }}
              />
              {s.name}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <Link
            href={`/occasions/${vibe.suits[0]}`}
            className="link-draw text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-ink"
          >
            See it for {vibe.suits[0].replace(/-/g, " ")} →
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * `scenes` are rendered on the server and passed in — this component is
 * client-side for the scroll-driven track, and five inline SVG scenes would
 * otherwise ship to the browser and be hydrated for nothing.
 */
export function VibeSection({ scenes }: { scenes: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced, mobile } = useMotionBudget();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /*
   * Track geometry: a 6vw lead-in, then 5 panels of 46vw separated by 3vw
   * gaps = 6 + 230 + 12 = 248vw. To land the last panel flush against the
   * right edge it travels 248 − 100 = 148vw. Expressing this in viewport
   * units avoids measuring the DOM and re-rendering on every resize.
   */
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-148vw"]);
  // scaleX is a unitless factor, not a percentage.
  const rail = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const heading = (
    <>
      <p className="eyebrow">Choose your vibe</p>
      <TextReveal
        as="h2"
        lines={["Every celebration", { text: "has a feeling.", className: "italic text-rose-deep" }]}
        className="mt-4 font-display text-display text-ink"
      />
    </>
  );

  /* ── phones and reduced motion: no hijacking ── */
  if (mobile || reduced) {
    return (
      <section className="section-y bg-ivory" aria-labelledby="vibe-heading">
        <div className="shell">
          {heading}
          <span id="vibe-heading" className="sr-only">
            Choose your decoration style
          </span>
        </div>

        {reduced ? (
          <div className="shell mt-10 grid gap-6 sm:grid-cols-2">
            {vibes.map((v, i) => (
              <VibePanel key={v.slug} vibe={v} index={i} scene={scenes[i]} />
            ))}
          </div>
        ) : (
          <div
            className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Decoration styles, scroll horizontally"
            tabIndex={0}
          >
            {vibes.map((v, i) => (
              <div key={v.slug} className="w-[80vw] shrink-0 snap-center sm:w-[62vw]">
                <VibePanel vibe={v} index={i} scene={scenes[i]} />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  /* ── desktop: vertical scroll drives horizontal travel ── */
  return (
    <section ref={ref} className="relative h-[330svh] bg-ivory" aria-labelledby="vibe-heading">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="shell shrink-0">
          {heading}
          <span id="vibe-heading" className="sr-only">
            Choose your decoration style
          </span>
        </div>

        <motion.div
          style={{ x }}
          className="mt-8 flex shrink-0 gap-[3vw] pl-[6vw] will-change-transform"
        >
          {vibes.map((v, i) => (
            <div key={v.slug} className="h-[58svh] w-[46vw] shrink-0">
              <VibePanel vibe={v} index={i} scene={scenes[i]} />
            </div>
          ))}
        </motion.div>

        <div className="shell mt-8 shrink-0">
          <div className="h-px w-full bg-sand" aria-hidden="true">
            <motion.div style={{ scaleX: rail }} className="h-px origin-left bg-rose-deep" />
          </div>
        </div>
      </div>

      {/* The panels are also reachable as a plain list for assistive tech and
          for anyone who lands here without the scroll interaction. */}
      <ul className="sr-only">
        {vibes.map((v) => (
          <li key={v.slug}>
            {v.name}: {v.blurb}
          </li>
        ))}
      </ul>
    </section>
  );
}
