import type { Metadata } from "next";
import { PhotoOrScene } from "@/components/decor/PhotoOrScene";
import { SceneImage } from "@/components/decor/SceneImage";

import { Hero } from "@/components/sections/Hero";
import { TrustSection } from "@/components/sections/TrustSection";
import { OccasionsSection } from "@/components/sections/OccasionsSection";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { FeaturedDecorations } from "@/components/sections/FeaturedDecorations";
import { VibeSection } from "@/components/sections/VibeSection";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { PartyPalPromo } from "@/components/sections/PartyPalPromo";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, jsonLd } from "@/lib/seo/schema";
import { generalFaqs } from "@/data/faqs";
import { vibes } from "@/data/vibes";
import { business } from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: `${business.name} | Premium Balloon Decoration in ${business.city}`,
  description: `Premium balloon decorations for birthdays, anniversaries, baby showers, proposals and special celebrations in ${business.city}. Plan your celebration with ${business.name}.`,
  path: "/",
});

const homeFaqs = generalFaqs.slice(0, 6);

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(faqSchema(homeFaqs))) }}
      />

      {/*
        Scenes are constructed here, in a server component, and passed into the
        client sections as already-rendered nodes. Built inside those sections
        they would be shipped in the JS bundle and hydrated — hundreds of static
        SVG nodes each, which was the largest slice of mobile main-thread time.
      */}
      {/*
        The hero band keeps its illustration on purpose. It is a ~4.7:1
        letterbox, and the `band` scene is composed for exactly that viewBox
        (1600×420); any normal photograph cropped that hard loses its subject
        and shows mostly wall. Tried it with a real photo and it was plainly
        worse. Every other image on the site is a real photograph.
      */}
      <Hero bandScene={<SceneImage sceneKey="hero-band" priority />} />
      <TrustSection />
      <OccasionsSection />
      <BeforeAfter />
      <FeaturedDecorations />
      <VibeSection
        scenes={vibes.map((v) => (
          <PhotoOrScene
            key={v.slug}
            photos={v.photo ? [v.photo] : undefined}
            sceneKey={`vibe-${v.slug}`}
            alt={`${v.name} style balloon decoration in ${business.city}`}
            sizes="(min-width:768px) 46vw, 80vw"
          />
        ))}
      />
      <GalleryPreview />
      <HowItWorks />
      <Testimonials />
      <PartyPalPromo />
      <FaqSection items={homeFaqs} />
      <FinalCTA />
    </>
  );
}
