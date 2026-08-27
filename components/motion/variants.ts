import type { Variants } from "motion/react";

/**
 * The motion design system.
 *
 * One shared set of curves and variants so that every reveal on the site
 * feels like it came from the same hand. Components import from here rather
 * than inlining transitions — brief section 53.
 */

/** Matches --ease-out-soft in globals.css. */
export const EASE = [0.22, 1, 0.36, 1] as const;
/** Slightly sharper — used for elements that should feel precise, like CTAs. */
export const EASE_FINE = [0.16, 1, 0.3, 1] as const;

export const DUR = {
  fast: 0.35,
  base: 0.62,
  slow: 0.9,
  cinematic: 1.25,
} as const;

/**
 * Every `show` state is a function of a `custom` delay rather than a plain
 * object.
 *
 * The reason: a `transition` prop on a motion component REPLACES the
 * transition declared inside its variants. Passing `transition={{ delay }}`
 * to stagger a reveal therefore silently discards the duration and easing
 * below and falls back to motion's defaults — every reveal on the site would
 * play on a curve nobody designed. Threading the delay through `custom`
 * keeps the timing and the offset in the same place.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (d = 0) => ({ opacity: 1, transition: { duration: DUR.slow, ease: EASE, delay: d } }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE, delay: d } }),
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE, delay: d } }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: (d = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: DUR.slow, ease: EASE, delay: d },
  }),
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 44 },
  show: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: DUR.base, ease: EASE, delay: d } }),
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -44 },
  show: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: DUR.base, ease: EASE, delay: d } }),
};

/**
 * Image reveal: the picture scales down from slightly oversized while its
 * mask lifts. Reads as film rather than as a fade.
 */
export const imageReveal: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 },
  show: (d = 0) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: { duration: DUR.cinematic, ease: EASE_FINE, delay: d },
  }),
};

/**
 * One line of a headline rising out of its own overflow-hidden box.
 *
 * Note for anyone wiring this up: the element carrying this variant must NOT
 * be the one observed for `whileInView`. At rest it sits fully outside its
 * clipping parent, so its visible area is zero, and IntersectionObserver —
 * which intersects against ancestor clip rects — reports it as never on
 * screen. Observe the heading that wraps the lines instead and let the lines
 * inherit. See TextReveal.
 */
export const textLine: Variants = {
  hidden: { y: "110%" },
  show: (d = 0) => ({ y: "0%", transition: { duration: 0.95, ease: EASE_FINE, delay: d } }),
};

/** Container that walks its children in sequence. */
export const stagger = (each = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

/**
 * Idle balloon drift. Deliberately long and low-amplitude: it should be
 * noticed peripherally, never tracked by the eye.
 */
export const balloonFloat = (i = 0) => ({
  y: [0, -14, 0],
  rotate: [0, i % 2 === 0 ? 2.4 : -2.4, 0],
  transition: {
    duration: 7 + (i % 4) * 1.4,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: i * 0.42,
  },
});

/**
 * Shared viewport config.
 *
 * `amount` is "some" (threshold 0), NOT a fraction, and that is deliberate.
 * A fractional threshold is measured against the ELEMENT's own size, so an
 * element taller than the viewport can never reach it — a 1700px grid in a
 * 900px window tops out around a ratio of 0.5, and at the moment it scrolls
 * into view it is closer to 0.2. Any container-level reveal using amount:0.25
 * therefore stays stuck at opacity 0 and the section renders blank.
 *
 * There is deliberately NO negative `margin` either. Pulling the trigger
 * boundary up looks tidier in theory, but it narrows the qualifying band for
 * anything sitting just below the fold on load, and content that was already
 * on screen stayed at opacity 0 until the visitor happened to scroll. Given
 * the failure mode is "the page renders blank", first contact with the real
 * viewport is the right trade.
 */
export const inView = { once: true, amount: "some" } as const;

export const variantMap = {
  fadeIn,
  fadeUp,
  fadeDown,
  scaleIn,
  slideLeft,
  slideRight,
  imageReveal,
} as const;

export type VariantName = keyof typeof variantMap;
