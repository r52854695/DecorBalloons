import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OccasionCard } from "@/components/ui/OccasionCard";
import { OccasionScene } from "@/components/ui/OccasionScene";
import { featuredOccasions } from "@/data/occasions";

/**
 * Occasion discovery — the twenty-second question, "can they decorate MY event?"
 *
 * The grid runs 3 + 3 + 2 rather than a flat four-across so the section reads
 * as an editorial spread instead of a product listing. The two leading cards
 * are wide because birthday and baby shower are the highest-intent entries.
 */
export function OccasionsSection() {
  const [first, second, ...rest] = featuredOccasions;

  return (
    <section className="section-y" aria-labelledby="occasions-heading" id="occasions">
      <div className="shell">
        <SectionHeading
          eyebrow="Occasions"
          lines={["What are we", { text: "celebrating?", className: "italic text-rose-deep" }]}
          lead="Every celebration has its own pace and its own palette. Start with the occasion and we will shape the rest around it."
          link={{ href: "/occasions", label: "All occasions" }}
        />
        <span id="occasions-heading" className="sr-only">
          Occasions we decorate for
        </span>

        {/*
          Each card observes itself rather than inheriting a stagger from the
          grid. The grid is far taller than the viewport, so orchestrating from
          the container would fire every reveal the moment the first row
          arrives and animate the lower rows entirely offscreen. Per-item
          observers keep the reveal tied to when a card actually appears; the
          small delay staggers each row as it comes in.
        */}
        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-7 lg:grid-cols-6 lg:gap-x-8">
          {[first, second].map((o, i) => (
            <ScrollReveal
              key={o.slug}
              as="li"
              delay={i * 0.08}
              className="col-span-2 lg:col-span-3"
            >
              <OccasionCard occasion={o} size="lg" scene={<OccasionScene occasion={o} size="lg" />} />
            </ScrollReveal>
          ))}

          {rest.map((o, i) => (
            <ScrollReveal
              key={o.slug}
              as="li"
              delay={(i % 3) * 0.08}
              className="col-span-1 lg:col-span-2"
            >
              <OccasionCard occasion={o} scene={<OccasionScene occasion={o} />} />
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
