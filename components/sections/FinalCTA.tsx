"use client";

import { motion } from "motion/react";
import { BalloonGlyph } from "@/components/decor/BalloonGlyph";
import { TextReveal } from "@/components/motion/TextReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { balloonFloat } from "@/components/motion/variants";
import { Button } from "@/components/ui/Button";
import { PartyMode } from "@/components/ui/PartyMode";
import { business, formatPhone, telHref, whatsappHref } from "@/data/business";

const DRIFT = [
  { id: "f1", left: "6%", top: "18%", size: 54, color: "#C0805F" },
  { id: "f2", left: "88%", top: "24%", size: 46, color: "#E6BCA4" },
  { id: "f3", left: "16%", top: "70%", size: 38, color: "#A2624A" },
  { id: "f4", left: "78%", top: "72%", size: 58, color: "#C9A55C" },
];

/**
 * Closing statement. Deep ink so the page ends on its strongest contrast
 * before the cream footer, and every route out of the site is here: form,
 * WhatsApp, phone.
 */
export function FinalCTA() {
  const { reduced, mobile } = useMotionBudget();

  return (
    <section className="relative overflow-hidden bg-ink" aria-labelledby="final-cta-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, rgba(192,128,95,0.28) 0%, rgba(192,128,95,0) 70%)",
        }}
      />

      {!mobile && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-45">
          {DRIFT.map((b, i) => (
            <motion.div
              key={b.id}
              className="absolute"
              style={{ left: b.left, top: b.top }}
              animate={reduced ? undefined : balloonFloat(i)}
            >
              <BalloonGlyph id={b.id} color={b.color} size={b.size} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="shell relative z-10 flex flex-col items-center py-24 text-center md:py-32">
        <ScrollReveal variant="fadeUp" as="p">
          <span className="eyebrow text-rose-light">Ready when you are</span>
        </ScrollReveal>

        <TextReveal
          as="h2"
          lines={["Your celebration.", { text: "Our magic.", className: "italic text-rose-light" }]}
          className="mt-5 font-display text-display text-ivory"
        />
        <span id="final-cta-heading" className="sr-only">
          Plan your celebration with {business.name}
        </span>

        <ScrollReveal variant="fadeUp" delay={0.12} as="p">
          <span className="mt-6 block max-w-xl text-lead text-ivory/70">
            From intimate surprises to unforgettable parties, we transform
            ordinary spaces into moments worth remembering.
          </span>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.2} className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <Button
                href="/contact"
                variant="accent"
                size="lg"
                arrow
                analytics="hero_cta_clicked"
                analyticsData={{ source: "final_cta" }}
              >
                Plan my celebration
              </Button>
            </MagneticButton>
            <Button
              href={whatsappHref()}
              external
              variant="onDark"
              size="lg"
              analytics="whatsapp_clicked"
              analyticsData={{ source: "final_cta" }}
            >
              WhatsApp us
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[0.82rem] text-ivory/60">
            <a
              href={telHref(business.primaryPhone)}
              className="link-draw text-ivory/85"
              onClick={() => void 0}
            >
              {formatPhone(business.primaryPhone)}
            </a>
            <a href={telHref(business.secondaryPhone)} className="link-draw text-ivory/85">
              {formatPhone(business.secondaryPhone)}
            </a>
            <PartyMode className="rounded-full border border-ivory/25 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ivory/80 transition-colors hover:border-ivory/60 hover:text-ivory" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
