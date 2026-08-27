"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useMotionBudget } from "./useMotionBudget";
import { inView, stagger, variantMap, type VariantName } from "./variants";

/**
 * Pre-created motion components.
 *
 * Deliberately a fixed map rather than `motion.create(tag)` called during
 * render: that would mint a brand-new component type on every render and
 * remount the whole subtree, throwing away DOM and any in-flight animation.
 */
const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  figure: motion.figure,
  header: motion.header,
} as const;

export type RevealTag = keyof typeof TAGS;

type ScrollRevealProps = {
  children: ReactNode;
  variant?: VariantName;
  delay?: number;
  className?: string;
  as?: RevealTag;
  /** Seconds between child reveals; makes children inherit orchestration. */
  stagger?: number;
};

/**
 * The workhorse reveal: plays a shared variant once the element scrolls in.
 *
 * When the visitor prefers reduced motion this renders the plain element with
 * no motion wrapper at all — not a zero-duration animation, but no animation,
 * so nothing can ever be left stranded mid-transform.
 */
export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  as = "div",
  stagger: staggerEach,
}: ScrollRevealProps) {
  const { reduced } = useMotionBudget();
  const MotionTag = TAGS[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  if (staggerEach) {
    return (
      <MotionTag
        className={className}
        variants={stagger(staggerEach, delay)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      // Delay travels via `custom`, not a `transition` prop — see variants.ts.
      custom={delay}
    >
      {children}
    </MotionTag>
  );
}

/**
 * A child of a staggering ScrollReveal. Inherits the parent's hidden/show
 * orchestration instead of observing the viewport on its own.
 */
export function ScrollRevealItem({
  children,
  variant = "fadeUp",
  className,
  as = "div",
}: Omit<ScrollRevealProps, "delay" | "stagger">) {
  const { reduced } = useMotionBudget();
  const MotionTag = TAGS[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <MotionTag className={className} variants={variantMap[variant]}>
      {children}
    </MotionTag>
  );
}
