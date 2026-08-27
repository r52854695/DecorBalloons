import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLd } from "@/lib/seo/schema";
import { generalFaqs } from "@/data/faqs";
import { business } from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: "How Booking Works",
  description: `How to book balloon decoration with ${business.name} in ${business.city} — share your occasion, choose a style, and we install it on the day.`,
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd(breadcrumbSchema([{ name: "How It Works", path: "/how-it-works" }])),
          ),
        }}
      />

      <PageHero
        eyebrow="How it works"
        lines={["From message", { text: "to celebration.", className: "italic text-rose-deep" }]}
        lead="Booking a decoration should take one conversation, not a form-filling exercise. Here is exactly what happens."
        crumbs={[{ name: "How It Works", path: "/how-it-works" }]}
      />

      <HowItWorks />
      <BeforeAfter />
      <FaqSection items={generalFaqs.slice(0, 6)} />
      <FinalCTA />
    </>
  );
}
