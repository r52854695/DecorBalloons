import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { OccasionCard } from "@/components/ui/OccasionCard";
import { OccasionScene } from "@/components/ui/OccasionScene";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLd } from "@/lib/seo/schema";
import { occasions } from "@/data/occasions";
import { business } from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: `Occasions We Decorate For in ${business.city}`,
  description: `Balloon and event decoration in ${business.city} for birthdays, anniversaries, baby showers, proposals, weddings, Annaprashan, shop openings and corporate events.`,
  path: "/occasions",
});

export default function OccasionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd(breadcrumbSchema([{ name: "Occasions", path: "/occasions" }])),
          ),
        }}
      />

      <PageHero
        eyebrow="Occasions"
        lines={["Every occasion,", { text: "decorated properly.", className: "italic text-rose-deep" }]}
        lead={`From midnight birthday surprises to Annaprashan ceremonies and shop openings — these are the celebrations we set up across ${business.city}.`}
        crumbs={[{ name: "Occasions", path: "/occasions" }]}
      />

      <section className="section-y" aria-label="All occasions">
        <div className="shell">
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-7 lg:grid-cols-4 lg:gap-x-8">
            {occasions.map((o, i) => (
              <ScrollReveal key={o.slug} as="li" delay={(i % 4) * 0.06}>
                <OccasionCard occasion={o} scene={<OccasionScene occasion={o} />} />
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
