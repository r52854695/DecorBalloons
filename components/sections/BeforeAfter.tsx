"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SvgBalloon } from "@/components/decor/BalloonGlyph";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/utils";

/**
 * "From ordinary to unforgettable" — the section that has to justify the price
 * of the service without stating one.
 *
 * A pinned viewport plays an empty room being decorated, one layer per scroll
 * beat. It is the clearest demonstration of what the business actually sells,
 * which is why it earns a tall scroll and a sticky stage.
 *
 * Everything is driven by motion values off a single `useScroll`; the only
 * React state is the caption index, which changes at most five times over the
 * whole section rather than once per frame.
 */

const STAGES = [
  { at: 0.0, label: "An ordinary room", note: "Where most celebrations start." },
  { at: 0.22, label: "Balloons go up", note: "Hand-clustered, colour matched to your palette." },
  { at: 0.4, label: "The backdrop lands", note: "A focal point for every photograph of the night." },
  { at: 0.56, label: "The table is styled", note: "Cake, cloth and detailing arranged together." },
  { at: 0.72, label: "Lighting warms it", note: "Fairy lights and candles, set for after dark." },
  { at: 0.88, label: "Ready", note: "The same room, two hours later." },
];

/** Fades and lifts a group of SVG elements into place across a scroll beat. */
function Layer({
  progress,
  start,
  children,
  lift = 20,
}: {
  progress: MotionValue<number>;
  start: number;
  children: ReactNode;
  lift?: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.11], [0, 1]);
  const y = useTransform(progress, [start, start + 0.11], [lift, 0]);
  return (
    <motion.g style={{ opacity, y }} className="will-change-transform">
      {children}
    </motion.g>
  );
}

/* ── the room, drawn once and shared by both the animated and static paths ── */

function RoomBack() {
  return (
    <>
      <rect x="0" y="0" width="900" height="560" fill="url(#ba-wall)" />
      <rect x="0" y="430" width="900" height="130" fill="#efe4d8" />
      <rect x="0" y="418" width="900" height="13" fill="#e6d8c8" />
      {/* window */}
      <rect x="78" y="104" width="164" height="196" rx="3" fill="#fdf8f1" />
      <rect
        x="78"
        y="104"
        width="164"
        height="196"
        rx="3"
        fill="none"
        stroke="#dccbb6"
        strokeWidth="2.5"
      />
      <line x1="160" y1="104" x2="160" y2="300" stroke="#dccbb6" strokeWidth="2" />
      <line x1="78" y1="202" x2="242" y2="202" stroke="#dccbb6" strokeWidth="2" />
    </>
  );
}

function Console() {
  return (
    <g>
      <rect x="322" y="348" width="316" height="11" rx="4" fill="#e0cfba" />
      <rect x="340" y="359" width="10" height="60" fill="#e6d8c8" />
      <rect x="610" y="359" width="10" height="60" fill="#e6d8c8" />
      <rect x="322" y="348" width="316" height="3" fill="#c0805f" opacity="0.35" />
    </g>
  );
}

function BackdropRing() {
  return (
    <g>
      <circle cx="480" cy="238" r="132" fill="#fbf3ed" opacity="0.75" />
      <circle cx="480" cy="238" r="132" fill="none" stroke="#c0805f" strokeWidth="6" />
    </g>
  );
}

const GARLAND = [
  { x: 598, y: 86, r: 26, c: "#E6BCA4" },
  { x: 640, y: 62, r: 20, c: "#C0805F" },
  { x: 668, y: 104, r: 30, c: "#F3EBE2" },
  { x: 706, y: 78, r: 18, c: "#101D30" },
  { x: 726, y: 126, r: 27, c: "#D09A7C" },
  { x: 764, y: 108, r: 21, c: "#E6BCA4" },
  { x: 784, y: 158, r: 29, c: "#C0805F" },
  { x: 818, y: 140, r: 19, c: "#F6E7DC" },
  { x: 838, y: 194, r: 25, c: "#E6BCA4" },
  { x: 866, y: 232, r: 21, c: "#A2624A" },
  { x: 856, y: 278, r: 27, c: "#F3EBE2" },
  { x: 300, y: 128, r: 22, c: "#E6BCA4" },
  { x: 272, y: 96, r: 17, c: "#C0805F" },
  { x: 320, y: 84, r: 14, c: "#F6E7DC" },
];

function Garland() {
  return (
    <g>
      {GARLAND.map((b, i) => (
        <SvgBalloon key={i} id={`ba-g${i}`} x={b.x} y={b.y} r={b.r} color={b.c} rot={(i % 3) * 6 - 6} />
      ))}
    </g>
  );
}

function TableStyling() {
  return (
    <g>
      {/* cloth */}
      <path d="M 388 348 h 184 l 10 62 h -204 z" fill="#fbf5ee" />
      {/* cake */}
      <rect x="452" y="300" width="58" height="40" rx="5" fill="#f3ded0" />
      <rect x="452" y="300" width="58" height="8" rx="4" fill="#e6bca4" />
      <rect x="462" y="276" width="38" height="26" rx="4" fill="#fbf0e6" />
      <rect x="462" y="276" width="38" height="6" rx="3" fill="#d09a7c" />
      <rect x="479.5" y="258" width="3" height="18" rx="1.5" fill="#c0805f" />
      {/* side plates */}
      <ellipse cx="408" cy="344" rx="20" ry="6" fill="#fdf8f2" />
      <ellipse cx="556" cy="344" rx="20" ry="6" fill="#fdf8f2" />
      <rect x="398" y="322" width="20" height="22" rx="3" fill="#f6e7dc" />
      <rect x="546" y="326" width="20" height="18" rx="3" fill="#f6e7dc" />
    </g>
  );
}

function Lighting() {
  // Rounded to 2dp so the server and client emit byte-identical coordinates —
  // see the `r2` note in decor/scenes.tsx.
  const v = (n: number) => Math.round(n * 100) / 100;
  const pts = Array.from({ length: 18 }, (_, i) => {
    const t = i / 17;
    const u = 1 - t;
    return [
      v(u * u * -10 + 2 * u * t * 450 + t * t * 910),
      v(u * u * 40 + 2 * u * t * 96 + t * t * 34),
    ] as const;
  });
  return (
    <g>
      <path
        d={`M ${pts.map((p) => `${p[0]} ${p[1]}`).join(" L ")}`}
        fill="none"
        stroke="#d8c3ae"
        strokeWidth="1.4"
        opacity="0.8"
      />
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py + 6} r="5" fill="url(#ba-glow)" />
      ))}
      {/* candle flames on the table */}
      <path d="M 481 256 q 5 6 0 11 q -5 -5 0 -11 z" fill="#e8a54e" />
      <ellipse cx="480" cy="330" rx="150" ry="70" fill="url(#ba-warm)" />
    </g>
  );
}

function FloorDetail() {
  return (
    <g>
      <SvgBalloon id="ba-f1" x={200} y={396} r={30} color="#E6BCA4" rot={-8} />
      <SvgBalloon id="ba-f2" x={248} y={408} r={22} color="#C0805F" rot={7} />
      <SvgBalloon id="ba-f3" x={700} y={402} r={27} color="#F3EBE2" rot={5} />
      <SvgBalloon id="ba-f4" x={744} y={412} r={20} color="#101D30" rot={-6} />
    </g>
  );
}

function Defs() {
  return (
    <defs>
      <linearGradient id="ba-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fdfaf6" />
        <stop offset="100%" stopColor="#f2e8dc" />
      </linearGradient>
      <radialGradient id="ba-glow">
        <stop offset="0%" stopColor="#ffd9a0" />
        <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ba-warm">
        <stop offset="0%" stopColor="#f6c98c" stopOpacity="0.42" />
        <stop offset="100%" stopColor="#f6c98c" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionBudget();
  const [stage, setStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /**
   * Scroll progress can fire while React is still committing — most visibly
   * when a viewport change (a phone rotating) swaps this section between its
   * animated and reduced-motion trees, which React reports as "state update on
   * a component that hasn't mounted yet". The mounted ref makes the handler a
   * no-op outside a committed tree.
   */
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!mounted.current) return;
    let next = 0;
    for (let i = 0; i < STAGES.length; i++) if (v >= STAGES[i].at) next = i;
    setStage((prev) => (prev === next ? prev : next));
  });

  const heading = (
    <TextReveal
      as="h2"
      lines={["From ordinary", { text: "to unforgettable.", className: "italic text-rose-deep" }]}
      className="font-display text-display text-ink"
    />
  );

  /* Reduced motion: no pinning, no scroll-driven build — just the finished
     room and the same story told as text. */
  if (reduced) {
    return (
      <section className="section-y bg-ivory" aria-labelledby="transform-heading">
        <div className="shell">
          <p className="eyebrow">The transformation</p>
          {heading}
          <span id="transform-heading" className="sr-only">
            From an ordinary room to a finished celebration
          </span>
          <div className="mt-10 overflow-hidden rounded-[6px] border border-sand bg-cream">
            <svg viewBox="0 0 900 560" className="h-auto w-full" role="img" aria-label="A room decorated with a balloon garland, a circular backdrop, a styled cake table and warm lighting">
              <Defs />
              <RoomBack />
              <BackdropRing />
              <Garland />
              <Console />
              <TableStyling />
              <Lighting />
              <FloorDetail />
            </svg>
          </div>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STAGES.map((s) => (
              <li key={s.label} className="border-l border-sand pl-4">
                <p className="font-display text-lg text-ink">{s.label}</p>
                <p className="text-sm text-ink-muted">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[300svh] bg-ivory" aria-labelledby="transform-heading">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="shell">
          <p className="eyebrow">The transformation</p>
          {heading}
          <span id="transform-heading" className="sr-only">
            From an ordinary room to a finished celebration
          </span>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
            <div className="overflow-hidden rounded-[6px] border border-sand bg-cream shadow-[var(--shadow-raise)]">
              <svg
                viewBox="0 0 900 560"
                className="h-auto w-full"
                role="img"
                aria-label="A room being decorated: balloons, backdrop, styled table and warm lighting appear in sequence"
              >
                <Defs />
                <RoomBack />
                <Layer progress={scrollYProgress} start={STAGES[2].at} lift={14}>
                  <BackdropRing />
                </Layer>
                <Layer progress={scrollYProgress} start={STAGES[1].at} lift={26}>
                  <Garland />
                </Layer>
                <Console />
                <Layer progress={scrollYProgress} start={STAGES[3].at} lift={12}>
                  <TableStyling />
                </Layer>
                <Layer progress={scrollYProgress} start={STAGES[4].at} lift={0}>
                  <Lighting />
                </Layer>
                <Layer progress={scrollYProgress} start={STAGES[5].at} lift={16}>
                  <FloorDetail />
                </Layer>
              </svg>
            </div>

            {/* stage rail */}
            <ol className="flex gap-4 lg:flex-col lg:gap-0" aria-label="Transformation steps">
              {STAGES.map((s, i) => (
                <li
                  key={s.label}
                  className={cn(
                    "flex-1 border-t pt-2.5 transition-colors duration-500 lg:border-t-0 lg:border-l lg:pt-0 lg:pb-3.5 lg:pl-4",
                    i <= stage ? "border-rose-deep" : "border-sand",
                  )}
                >
                  <p
                    className={cn(
                      "font-display text-[0.95rem] leading-tight transition-colors duration-500 lg:text-lg",
                      i === stage ? "text-ink" : i < stage ? "text-ink-muted" : "text-ink-faint",
                    )}
                  >
                    <span className="hidden lg:inline">{s.label}</span>
                  </p>
                  <p
                    className={cn(
                      "hidden text-[0.78rem] leading-snug transition-opacity duration-500 lg:block",
                      i === stage ? "text-ink-muted opacity-100" : "text-ink-faint opacity-0",
                    )}
                  >
                    {s.note}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* caption for narrow screens, where the rail collapses to bars */}
          <p className="mt-5 text-center text-sm text-ink-muted lg:hidden" aria-live="polite">
            <span className="font-display text-lg text-ink">{STAGES[stage].label}</span>
            <span className="mt-0.5 block">{STAGES[stage].note}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
