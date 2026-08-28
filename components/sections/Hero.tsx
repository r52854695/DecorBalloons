"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { FloatingBalloons } from "@/components/decor/FloatingBalloons";
import { TextReveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { EASE, EASE_FINE } from "@/components/motion/variants";
import { Button } from "@/components/ui/Button";
import { business } from "@/data/business";

/**
 * Hero.
 *
 * Composition: type first, work second. The headline gets the full shell width
 * so it can run at editorial scale, and the decoration itself sits in a
 * letterboxed band beneath it that is deliberately cropped by the fold — the
 * crop is the invitation to scroll, so no arrow is doing that job alone.
 *
 * Intro order follows brief §18 (ground, scene, balloons, headline, support,
 * CTAs, cue) and finishes inside ~1.6s. Every delay below is part of that one
 * sequence; they are not independent flourishes.
 *
 * `bandScene` arrives already rendered from the server: Hero is a client
 * component (it drives scroll-linked transforms), so a DecorScene built here
 * would be bundled and hydrated for artwork that never changes.
 */
export function Hero({ bandScene }: { bandScene: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotionBudget();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The band drifts up and dims slightly as the next section arrives.
  const bandY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const bandScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const veil = useTransform(scrollYProgress, [0, 0.9], [0, 0.55]);

  const intro = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.85, ease: EASE },
        };

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-svh flex-col overflow-hidden bg-ivory"
      aria-labelledby="hero-heading"
    >
      {/* ground: a warm glow rising from where the band sits */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 105%, #f7e9dc 0%, rgba(247,233,220,0) 62%)",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        {...(reduced
          ? {}
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.3, duration: 1.1, ease: EASE },
            })}
      >
        <FloatingBalloons progress={scrollYProgress} />
      </motion.div>

      {/* ── type ── */}
      <div className="shell relative z-30 flex flex-1 flex-col justify-center pt-[calc(6rem+var(--marquee-h))] pb-6 md:pt-[calc(7rem+var(--marquee-h))] md:pb-8">
        <motion.p
          {...intro(0.42)}
          className="eyebrow flex items-center gap-3"
        >
          <span aria-hidden="true" className="inline-block h-px w-8 bg-rose-deep/50" />
          Balloon &amp; event decoration · {business.city}
        </motion.p>

        <TextReveal
          as="h1"
          delay={0.5}
          immediate
          className="mt-5 max-w-[16ch] font-display text-hero text-ink md:mt-7"
          lines={[
            "Make every",
            { text: "moment", className: "italic text-rose-deep" },
            "worth celebrating.",
          ]}
        />
        <span id="hero-heading" className="sr-only">
          {business.name} — premium balloon decoration in {business.city}
        </span>

        <motion.p
          {...intro(1.0)}
          className="mt-6 max-w-2xl text-lead text-ink-muted"
        >
          Premium balloon decorations for birthdays, anniversaries, baby showers,
          proposals and unforgettable celebrations in {business.city}.
        </motion.p>

        <motion.div {...intro(1.15)} className="mt-8 flex flex-wrap items-center gap-3">
          <MagneticButton>
            <Button
              href="/contact"
              variant="primary"
              size="lg"
              arrow
              analytics="hero_cta_clicked"
              analyticsData={{ source: "hero_primary" }}
            >
              Plan my celebration
            </Button>
          </MagneticButton>
          <Button
            href="/decorations"
            variant="outline"
            size="lg"
            analytics="hero_cta_clicked"
            analyticsData={{ source: "hero_secondary" }}
          >
            Explore decorations
          </Button>
        </motion.div>

        {/* Honest micro-proof: statements about how we work, not invented numbers. */}
        <motion.ul
          {...intro(1.32)}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.78rem] text-ink-faint"
        >
          {["Set up by our own team", "Custom themes and colours", `Across ${business.city}`].map(
            (t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-rose">
                  ✦
                </span>
                {t}
              </li>
            ),
          )}
        </motion.ul>
      </div>

      {/* ── the work, cropped by the fold ── */}
      <motion.div
        className="relative z-20 h-[30svh] min-h-[215px] w-full md:h-[32svh]"
        {...(reduced
          ? {}
          : {
              initial: { opacity: 0, y: 44, scale: 0.97 },
              animate: { opacity: 1, y: 0, scale: 1 },
              transition: { delay: 0.16, duration: 1.15, ease: EASE_FINE },
            })}
      >
        <div className="shell-wide h-full">
          <div className="relative h-full overflow-hidden rounded-t-[2rem] border border-sand/80 border-b-0 bg-cream shadow-[var(--shadow-float)] md:rounded-t-[3rem]">
            <motion.div
              className="absolute inset-0"
              style={reduced ? undefined : { y: bandY, scale: bandScale }}
            >
              {bandScene}
            </motion.div>
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-ink"
              style={reduced ? { opacity: 0 } : { opacity: veil }}
            />
          </div>
        </div>

        {/* scroll cue */}
        <motion.div
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 1.5, duration: 0.7 },
              })}
          // Hidden on phones: the trust list wraps to two lines there and
          // collides with this, and a scroll hint earns nothing on touch.
          className="pointer-events-none absolute -top-11 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        >
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-ink-faint">
            Scroll
          </span>
          <span aria-hidden="true" className="relative block h-9 w-px overflow-hidden bg-ink/15">
            {!reduced && (
              <motion.span
                className="absolute inset-x-0 top-0 block h-3 bg-rose-deep"
                animate={{ y: [-12, 36] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
