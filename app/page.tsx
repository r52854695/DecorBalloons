import type { Metadata } from "next";

import { CatalogHero } from "@/components/catalog/CatalogHero";
import { CategoryRow } from "@/components/catalog/CategoryRow";
import { TrustSection } from "@/components/sections/TrustSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { PartyPalPromo } from "@/components/sections/PartyPalPromo";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, jsonLd } from "@/lib/seo/schema";
import { generalFaqs } from "@/data/faqs";
import { categories } from "@/data/catalog";
import { business } from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: `${business.name} | Balloon Decoration in ${business.city} — Book Online`,
  description: `Book balloon decoration in ${business.city} for birthdays, anniversaries, baby showers, annaprashan, shop openings and weddings. Set up by our own team.`,
  path: "/",
});

const homeFaqs = generalFaqs.slice(0, 6);

/**
 * Home is now a catalogue, not an essay.
 *
 * The previous build led with a full-height hero and worked through editorial
 * sections — occasions, before/after, vibes — before showing anything
 * bookable. Client feedback was that it read as a template and moved too
 * slowly. This lays out priced setups in scrollable rows, the pattern people
 * already know from every Indian decoration and quick-commerce site, and the
 * first row is on screen almost immediately.
 *
 * Scroll-linked animation is gone from this page by request; the only motion
 * left is hover on a card.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(faqSchema(homeFaqs))) }}
      />

      <CatalogHero />

      {categories.map((c, i) => (
        <CategoryRow key={c.slug} category={c} priority={i === 0} />
      ))}

      <TrustSection />
      <HowItWorks />
      <Testimonials />
      <PartyPalPromo />
      <FaqSection items={homeFaqs} />
      <FinalCTA />
    </>
  );
}
