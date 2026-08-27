"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { BalloonGlyph } from "./BalloonGlyph";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { balloonFloat } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

/**
 * Configuration is fixed and hand-tuned rather than randomised (brief §20).
 * Random placement produces a different, usually worse, composition on every
 * load and cannot survive server rendering without a hydration mismatch.
 *
 * `depth` drives the whole parallax illusion: background balloons barely move,
 * foreground balloons travel far and rotate more, which is what reads as
 * cinematic depth rather than as a flat layer sliding.
 */
type BalloonCfg = {
  id: string;
  left: string;
  top: string;
  size: number;
  color: string;
  /** 0 = pinned to the page, 1 = travels a full viewport. */
  depth: number;
  /** Horizontal drift in px across the scroll pass. */
  drift: number;
  /** Degrees of rotation across the scroll pass. */
  rot: number;
  layer: "back" | "mid" | "front";
  confetti?: boolean;
  /** Dropped on phones to keep the element count down. */
  desktopOnly?: boolean;
};

/**
 * Positions are constrained to the space the content does NOT occupy: the
 * headline column runs from roughly 7% to 62% of the width and the decoration
 * band starts around 62% of the height. Balloons therefore live to the right
 * of the type or hard against the left edge, and only two are allowed to
 * straddle the top edge of the band — where the overlap reads as depth rather
 * than as something colliding with the call to action.
 */
const HERO_BALLOONS: BalloonCfg[] = [
  // ── background: soft, slow, slightly hazy ──
  { id: "b1", left: "67%", top: "17%", size: 50, color: "#F3EBE2", depth: 0.22, drift: -18, rot: -8, layer: "back", desktopOnly: true },
  { id: "b2", left: "88%", top: "27%", size: 44, color: "#E6BCA4", depth: 0.26, drift: 22, rot: 10, layer: "back" },
  { id: "b3", left: "76%", top: "13%", size: 34, color: "#F6E7DC", depth: 0.3, drift: -12, rot: 6, layer: "back", desktopOnly: true },

  // ── midground ──
  { id: "b4", left: "92%", top: "45%", size: 60, color: "#C0805F", depth: 0.52, drift: -24, rot: -14, layer: "mid" },
  { id: "b5", left: "68%", top: "38%", size: 54, color: "#101D30", depth: 0.56, drift: 20, rot: 12, layer: "mid", desktopOnly: true },
  { id: "b6", left: "80%", top: "58%", size: 56, color: "#E6BCA4", depth: 0.6, drift: 18, rot: -10, layer: "mid", confetti: true },

  // ── foreground: largest travel, most rotation, closest to the viewer ──
  // Desktop-only: at phone widths the content column spans the full viewport,
  // so a left-edge balloon at this height lands directly on the primary CTA.
  { id: "b7", left: "2%", top: "42%", size: 66, color: "#E6BCA4", depth: 0.86, drift: 30, rot: -20, layer: "front", desktopOnly: true },
  { id: "b8", left: "89%", top: "63%", size: 84, color: "#C0805F", depth: 0.92, drift: -32, rot: 18, layer: "front", desktopOnly: true },
  { id: "b9", left: "57%", top: "60%", size: 62, color: "#A2624A", depth: 0.78, drift: 24, rot: -12, layer: "front", desktopOnly: true, confetti: true },
];

const LAYER_CLASS: Record<BalloonCfg["layer"], string> = {
  back: "z-0 opacity-55 blur-[1.5px]",
  mid: "z-10 opacity-85",
  front: "z-20",
};

function DriftBalloon({
  cfg,
  progress,
  index,
  scale,
  reduced,
}: {
  cfg: BalloonCfg;
  progress: MotionValue<number>;
  index: number;
  scale: number;
  reduced: boolean;
}) {
  // Hooks run unconditionally; the values they produce are what varies.
  const y = useTransform(progress, [0, 1], [0, -540 * cfg.depth * scale]);
  const x = useTransform(progress, [0, 1], [0, cfg.drift * scale]);
  const rotate = useTransform(progress, [0, 1], [0, cfg.rot * scale]);
  const s = useTransform(progress, [0, 1], [1, 1 - cfg.depth * 0.14 * scale]);

  const glyph = (
    <BalloonGlyph
      id={cfg.id}
      color={cfg.color}
      size={cfg.size}
      confetti={cfg.confetti}
    />
  );

  if (reduced) {
    return (
      <div
        className={cn("pointer-events-none absolute", LAYER_CLASS[cfg.layer])}
        style={{ left: cfg.left, top: cfg.top }}
      >
        {glyph}
      </div>
    );
  }

  return (
    <motion.div
      className={cn("pointer-events-none absolute will-change-transform", LAYER_CLASS[cfg.layer])}
      style={{ left: cfg.left, top: cfg.top, y, x, rotate, scale: s }}
    >
      {/* Idle drift kept on a separate element so it never fights the
          scroll-linked transform on the parent. */}
      <motion.div animate={balloonFloat(index)}>{glyph}</motion.div>
    </motion.div>
  );
}

/**
 * The hero's balloon field. Every balloon responds to the same scroll progress
 * value but at its own depth, so the group separates as the page moves.
 */
export function FloatingBalloons({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const { reduced, mobile, scale } = useMotionBudget();
  const list = mobile ? HERO_BALLOONS.filter((b) => !b.desktopOnly) : HERO_BALLOONS;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {list.map((cfg, i) => (
        <DriftBalloon
          key={cfg.id}
          cfg={cfg}
          progress={progress}
          index={i}
          scale={reduced ? 0 : scale || 1}
          reduced={reduced}
        />
      ))}
    </div>
  );
}
