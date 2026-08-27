"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BalloonGlyph } from "@/components/decor/BalloonGlyph";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { track } from "@/lib/analytics/events";

const COLORS = ["#C0805F", "#E6BCA4", "#101D30", "#A2624A", "#C9A55C", "#F3EBE2"];
const DURATION = 2600;

type Particle = {
  x: number; y: number; vx: number; vy: number;
  rot: number; vr: number; w: number; h: number; c: string;
};

/**
 * Party mode.
 *
 * A single short burst, then it stops on its own and cleans up: no looping
 * confetti, no audio, no permanent canvas sitting in the compositor. The
 * canvas is only mounted while the burst is running and the rAF loop cancels
 * itself both on completion and on unmount.
 *
 * Hidden entirely under reduced motion. It is pure decoration with no
 * information behind it, so a static fallback would be noise — the honest
 * degradation is not to offer it.
 */
export function PartyMode({ className }: { className?: string }) {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { reduced } = useMotionBudget();

  const stop = useCallback(() => {
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    rafRef.current = undefined;
    timerRef.current = undefined;
  }, []);

  useEffect(() => stop, [stop]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Two side cannons rather than a full-screen dump — reads as a celebration
    // rather than as a browser bug.
    const particles: Particle[] = [];
    const spawn = (originX: number, dir: number) => {
      for (let i = 0; i < 70; i++) {
        const angle = (-Math.PI / 2 + dir * (0.15 + Math.random() * 0.5));
        const speed = 9 + Math.random() * 13;
        particles.push({
          x: originX,
          y: h + 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          w: 5 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };
    spawn(w * 0.08, 1);
    spawn(w * 0.92, -1);

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.vy += 0.26;         // gravity
        p.vx *= 0.995;        // drag
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - elapsed / DURATION);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (elapsed < DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
        setActive(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return stop;
  }, [active, stop]);

  if (reduced) return null;

  const balloons = [
    { id: "pm1", left: "12%", color: "#C0805F", size: 62, delay: 0 },
    { id: "pm2", left: "28%", color: "#E6BCA4", size: 48, delay: 0.14 },
    { id: "pm3", left: "48%", color: "#101D30", size: 56, delay: 0.06 },
    { id: "pm4", left: "68%", color: "#C9A55C", size: 44, delay: 0.2 },
    { id: "pm5", left: "85%", color: "#A2624A", size: 58, delay: 0.1 },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (active) return;
          track("party_mode_activated");
          setActive(true);
          timerRef.current = setTimeout(() => setActive(false), DURATION + 400);
        }}
        aria-label="Play a short celebration animation"
        className={className}
      >
        <span aria-hidden="true">🎉</span> Party mode
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            key="party"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none fixed inset-0 z-[70]"
            aria-hidden="true"
          >
            <canvas ref={canvasRef} className="h-full w-full" />
            {balloons.map((b) => (
              <motion.div
                key={b.id}
                className="absolute bottom-0"
                style={{ left: b.left }}
                initial={{ y: 140, opacity: 0 }}
                animate={{ y: -window.innerHeight - 160, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.8, delay: b.delay, ease: "easeOut" }}
              >
                <BalloonGlyph id={b.id} color={b.color} size={b.size} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announce it once, politely, for anyone not seeing the animation. */}
      <span role="status" aria-live="polite" className="sr-only">
        {active ? "Celebration animation playing" : ""}
      </span>
    </>
  );
}
