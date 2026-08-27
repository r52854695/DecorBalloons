"use client";

import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { TextReveal, type RevealLine } from "@/components/motion/TextReveal";
import type { Photo } from "@/data/photos";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven photographic showcase.
 *
 * The same pinned, staged treatment as the "From ordinary to unforgettable"
 * transformation, but built from real photographs instead of drawn layers: the
 * stage stays fixed while the page scrolls and each photograph takes over from
 * the last, paired with the part of the setup it shows.
 *
 * Pairing each frame with one line of the setup's contents is what stops this
 * being a slideshow — the visitor reads *what goes into the work* while looking
 * at it, which is the argument the section exists to make.
 *
 * Everything runs off one `useScroll`; the only React state is the caption
 * index, which changes a handful of times across the whole section.
 */
export function CinematicShowcase({
  eyebrow,
  lines,
  photos,
  steps,
  className,
}: {
  eyebrow?: string;
  lines: RevealLine[];
  photos: Photo[];
  /** One caption per frame — usually what the setup includes. */
  steps: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionBudget();
  const [active, setActive] = useState(0);

  // Cap the sequence: past ~5 frames the section outstays its welcome.
  const frames = photos.slice(0, Math.min(5, Math.max(photos.length, 1)));
  const n = frames.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!mounted.current) return;
    const next = Math.min(n - 1, Math.floor(v * n));
    setActive((prev) => (prev === next ? prev : next));
  });

  const heading = (
    <>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <TextReveal as="h2" lines={lines} className="mt-4 font-display text-display text-ink" />
    </>
  );

  /* ── reduced motion: no pinning, no scroll-driven frames ── */
  if (reduced || n === 0) {
    return (
      <section className={cn("section-y bg-ivory", className)} aria-label="Photographs of this setup">
        <div className="shell">
          {heading}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {frames.map((p, i) => (
              <figure key={p.src}>
                <div className="relative aspect-4/3 overflow-hidden rounded-[6px] bg-cream">
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover" />
                </div>
                {steps[i] && (
                  <figcaption className="mt-3 text-[0.88rem] text-ink-muted">{steps[i]}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={cn("relative bg-ivory", className)}
      style={{ height: `${Math.max(2, n) * 85}svh` }}
      aria-label="Photographs of this setup"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="shell">
          {heading}

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
            {/* stage */}
            <div className="relative aspect-4/3 overflow-hidden rounded-[6px] border border-sand bg-cream shadow-[var(--shadow-raise)] sm:aspect-16/10 lg:aspect-3/2">
              {frames.map((p, i) => (
                <Frame
                  key={p.src}
                  photo={p}
                  index={i}
                  total={n}
                  progress={scrollYProgress}
                  priority={i === 0}
                />
              ))}

              {/* frame counter */}
              <div className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-ink/55 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.12em] text-ivory backdrop-blur-sm">
                {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </div>
            </div>

            {/* step rail — mirrors the transformation section */}
            <ol className="flex gap-3 lg:flex-col lg:gap-0" aria-label="What this setup includes">
              {frames.map((_, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex-1 border-t pt-2.5 transition-colors duration-500 lg:border-t-0 lg:border-l lg:pt-0 lg:pb-3.5 lg:pl-4",
                    i <= active ? "border-rose-deep" : "border-sand",
                  )}
                >
                  <p
                    className={cn(
                      "hidden text-[0.86rem] leading-snug transition-colors duration-500 lg:block",
                      i === active
                        ? "text-ink"
                        : i < active
                          ? "text-ink-muted"
                          : "text-ink-faint",
                    )}
                  >
                    {steps[i] ?? `Frame ${i + 1}`}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* caption for narrow screens, where the rail collapses to bars */}
          <p className="mt-5 text-center text-sm text-ink-muted lg:hidden" aria-live="polite">
            {steps[active] ?? ""}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * One frame of the sequence. Fades and scales through its own slice of the
 * scroll range, with the previous frame still behind it so there is never a
 * gap of empty stage between two photographs.
 */
function Frame({
  photo,
  index,
  total,
  progress,
  priority,
}: {
  photo: Photo;
  index: number;
  total: number;
  progress: MotionValue<number>;
  priority: boolean;
}) {
  const span = 1 / total;
  const start = index * span;
  const wipe = span * 0.55;

  /*
   * Frames are revealed with a wipe, not a cross-fade.
   *
   * Two photographs at partial opacity do not blend, they ghost — the previous
   * backdrop's lettering reads straight through the next one. Wiping the
   * incoming frame down over the one beneath keeps every pixel fully opaque, so
   * the transition reads as a cut in film rather than a dissolve, and each
   * frame simply stays once revealed (later frames paint above earlier ones).
   *
   * The input range must also stay inside [0, 1] and strictly increase: scroll
   * progress is normalised, and Motion binds these values to native WAAPI
   * animations, where an out-of-bounds range yields keyframe offsets the
   * browser rejects with "Offsets must be monotonically non-decreasing" —
   * which previously took the whole page down.
   */
  const from = Math.max(0, start - wipe);
  const to = Math.max(from + 0.001, start);

  const cut = useTransform(progress, [from, to], [100, 0]);
  const clipPath = useMotionTemplate`inset(${cut}% 0% 0% 0%)`;

  // A slow push on the whole stack, so the stage is never completely static.
  const scale = useTransform(progress, [from, Math.min(1, start + span)], [1.06, 1]);

  return (
    <motion.div
      style={index === 0 ? undefined : { clipPath }}
      className="absolute inset-0"
    >
      <motion.div style={{ scale }} className="absolute inset-0 will-change-transform">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
