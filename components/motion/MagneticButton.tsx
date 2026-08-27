"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionBudget } from "./useMotionBudget";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  /** How far the element is allowed to be pulled, in px. */
  strength?: number;
};

/**
 * Desktop-only magnetic pull toward the cursor.
 *
 * Gated three ways, because this is exactly the kind of flourish that becomes
 * a bug on the wrong device: off under reduced motion, off on narrow screens,
 * and off on any device without a fine pointer (a magnet makes no sense when
 * the "cursor" is a fingertip that is already touching the target).
 */
export function MagneticButton({ children, className, strength = 14 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced, mobile } = useMotionBudget();
  const [finePointer, setFinePointer] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.35 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.35 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => setFinePointer(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const active = finePointer && !reduced && !mobile;

  if (!active) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mx.set((dx / (r.width / 2)) * strength);
        my.set((dy / (r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
