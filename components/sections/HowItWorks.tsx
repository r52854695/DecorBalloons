"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { BalloonGlyph } from "@/components/decor/BalloonGlyph";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    n: "01",
    title: "Tell us your occasion",
    body: "Message us the occasion, the date and where it is happening. A photo of the room helps more than a long description.",
  },
  {
    n: "02",
    title: "Choose your style",
    body: "We come back with a direction, a palette and what the setup includes, then adjust it until it is what you pictured.",
  },
  {
    n: "03",
    title: "We create the magic",
    body: "Our team arrives in your time window, installs everything, and leaves the room ready before your guests arrive.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionBudget();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 55%"],
  });

  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const balloonX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="section-y bg-ivory" aria-labelledby="how-heading">
      <div className="shell">
        <SectionHeading
          eyebrow="How it works"
          lines={["Three steps.", { text: "That is all.", className: "italic text-rose-deep" }]}
          lead="No account to make, no deposit before you have seen a quote."
        />
        <span id="how-heading" className="sr-only">
          How booking works
        </span>

        <div ref={ref} className="mt-14">
          {/* progress rail with a balloon riding it */}
          <div className="relative mb-12 hidden h-px w-full bg-sand md:block" aria-hidden="true">
            {reduced ? (
              <div className="h-px w-full bg-rose-deep/40" />
            ) : (
              <>
                <motion.div style={{ scaleX: fill }} className="h-px origin-left bg-rose-deep" />
                <motion.div
                  style={{ left: balloonX }}
                  className="absolute -top-6 -translate-x-1/2"
                >
                  <BalloonGlyph id="how-rail" color="#C0805F" size={30} string={false} />
                </motion.div>
              </>
            )}
            {STEPS.map((_, i) => (
              <span
                key={i}
                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-rose-deep"
                style={{ left: `${(i / (STEPS.length - 1)) * 100}%`, marginLeft: i === 0 ? 0 : i === STEPS.length - 1 ? -8 : -4 }}
              />
            ))}
          </div>

          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.n} as="li" delay={i * 0.1} variant="fadeUp">
                <p className="font-display text-5xl leading-none text-rose-light md:text-6xl">
                  {s.n}
                </p>
                <h3 className="mt-5 font-display text-2xl text-ink">{s.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">{s.body}</p>
              </ScrollReveal>
            ))}
          </ol>

          <ScrollReveal variant="fadeUp" delay={0.15} className="mt-12">
            <Button href="/contact" variant="primary" size="lg" arrow analytics="hero_cta_clicked" analyticsData={{ source: "how_it_works" }}>
              Start with step one
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
