"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMotionBudget } from "./useMotionBudget";

type ParallaxProps = {
  children: ReactNode;
  /**
   * Travel as a fraction of the element's own height across the full scroll
   * pass. 0.2 is a whisper; 0.6 is theatrical. Negative moves against scroll.
   */
  speed?: number;
  className?: string;
  /** Adds a gentle scale drift alongside the translate. */
  zoom?: boolean;
};

/**
 * Scroll-linked vertical parallax.
 *
 * Driven by motion values rather than React state, so scrolling never triggers
 * a re-render (brief section 46 — no expensive state updates during scroll).
 * The spring stops the transform from tracking the wheel one-to-one, which is
 * what separates "cinematic" from "jittery".
 */
export function Parallax({ children, speed = 0.25, className, zoom }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced, scale } = useMotionBudget();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const distance = 100 * speed * scale;
  const rawY = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(rawY, { stiffness: 110, damping: 26, mass: 0.4 });
  const s = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale: zoom ? s : undefined }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
