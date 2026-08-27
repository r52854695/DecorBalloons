"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMotionBudget } from "./useMotionBudget";
import { inView, textLine } from "./variants";

/** A line is either plain text or text with its own styling. */
export type RevealLine = string | { text: string; className?: string };

/** Static map — see ScrollReveal for why `motion.create` during render is wrong. */
const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
} as const;

export type RevealHeadingTag = keyof typeof TAGS;

type TextRevealProps = {
  /** One entry per visual line — the caller controls where the breaks fall. */
  lines: RevealLine[];
  className?: string;
  lineClassName?: string;
  as?: RevealHeadingTag;
  delay?: number;
  /** Play on mount (hero) instead of waiting for the element to scroll in. */
  immediate?: boolean;
};

const text = (l: RevealLine) => (typeof l === "string" ? l : l.text);
const extra = (l: RevealLine) => (typeof l === "string" ? undefined : l.className);

/**
 * Editorial line-by-line headline reveal: each line rises out of its own
 * clipping box, slightly offset from the one before.
 *
 * The viewport observer is attached to the HEADING, not to the individual
 * lines. Each line rests at translateY(110%) inside an overflow-hidden
 * wrapper, so its intersection rect is empty and an observer on the line
 * itself would report "never visible" and leave the headline permanently
 * hidden. The heading is always measurable, so it drives the reveal and the
 * lines inherit the variant through motion's context.
 *
 * Accessibility — the words remain ordinary text nodes inside the heading, so
 * a screen reader announces it normally; only the visual presentation is
 * split. Under reduced motion the clipping boxes are dropped entirely.
 */
export function TextReveal({
  lines,
  className,
  lineClassName,
  as = "h2",
  delay = 0,
  immediate = false,
}: TextRevealProps) {
  const { reduced } = useMotionBudget();

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className}>
        {lines.map((line, i) => (
          <span key={i} className={cn("block", lineClassName, extra(line))}>
            {text(line)}
          </span>
        ))}
      </Plain>
    );
  }

  const MotionTag = TAGS[as];
  const play = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: inView };

  return (
    <MotionTag className={className} initial="hidden" {...play}>
      {lines.map((line, i) => (
        // pb keeps descenders from being clipped by the overflow box
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("block", lineClassName, extra(line))}
            variants={textLine}
            custom={delay + i * 0.11}
          >
            {text(line)}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
