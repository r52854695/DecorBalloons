import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, jsonLd } from "@/lib/seo/schema";
import { faqs } from "@/data/faqs";
import { business } from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description: `Common questions about balloon decoration in ${business.city} — areas covered, pricing, booking notice, surprise setups, themes and safety.`,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd(faqSchema(faqs), breadcrumbSchema([{ name: "FAQ", path: "/faq" }])),
          ),
        }}
      />

      <PageHero
        eyebrow="FAQ"
        lines={["Questions,", { text: "answered plainly.", className: "italic text-rose-deep" }]}
        lead="Everything people usually ask before booking a decoration — including the ones we cannot answer without knowing your date."
        crumbs={[{ name: "FAQ", path: "/faq" }]}
      />

      <FaqSection items={faqs} eyebrow="All questions" lines={["Before you book"]} />

      <FinalCTA />
    </>
  );
}
