"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { openPartyPal } from "@/components/chat/bus";
import { track } from "@/lib/analytics/events";

/**
 * Promotes the AI planner with a static preview of the conversation rather
 * than a live embedded chat — the real assistant opens as an overlay, and
 * running two instances would mean two conversations to keep in sync.
 */
const PREVIEW = [
  { from: "bot", text: "Hey! 🎉 Let's plan something unforgettable. What are we celebrating?" },
  { from: "user", text: "Anniversary — our 10th" },
  { from: "bot", text: "Lovely. Is this at home, on a terrace, or somewhere else?" },
  { from: "user", text: "Terrace dinner, just the two of us" },
] as const;

export function PartyPalPromo() {
  return (
    <section className="section-y bg-rose-wash" aria-labelledby="planner-heading">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Party Pal 🎈"
            lines={["Not sure where", { text: "to start?", className: "italic text-rose-deep" }]}
            lead="Party Pal is our celebration planner. Answer a few questions about your occasion, date and style, and it puts together a decoration plan you can send straight to us."
          />
          <span id="planner-heading" className="sr-only">
            Plan with Party Pal, our AI celebration planner
          </span>

          <ScrollReveal variant="fadeUp" delay={0.15} className="mt-8">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                arrow
                onClick={() => {
                  track("chat_opened", { source: "promo_section" });
                  openPartyPal({ source: "promo_section" });
                }}
              >
                Plan my party
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Or just message us
              </Button>
            </div>
            <p className="mt-4 text-[0.78rem] text-ink-faint">
              Takes about a minute. Nothing is booked until you say so.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="scaleIn" delay={0.1}>
          <div
            className="rounded-[10px] border border-sand bg-paper p-5 shadow-[var(--shadow-raise)] md:p-6"
            aria-hidden="true"
          >
            <div className="flex items-center gap-3 border-b border-sand pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-base">
                🎈
              </span>
              <div>
                <p className="text-[0.85rem] font-semibold text-ink">Party Pal</p>
                <p className="text-[0.7rem] text-ink-faint">Your celebration planner</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {PREVIEW.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.from === "bot"
                      ? "max-w-[85%] rounded-2xl rounded-tl-sm bg-cream px-4 py-2.5 text-[0.85rem] leading-relaxed text-ink-soft"
                      : "ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-ink px-4 py-2.5 text-[0.85rem] leading-relaxed text-ivory"
                  }
                >
                  {m.text}
                </div>
              ))}
              <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-tl-sm bg-cream px-4 py-3">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="block h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint"
                    style={{ animationDelay: `${d * 0.18}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
