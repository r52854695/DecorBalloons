import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/ui/GalleryGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLd } from "@/lib/seo/schema";
import { galleryItems, galleryIsIllustrated } from "@/data/gallery";
import { business, whatsappHref } from "@/data/business";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = buildMetadata({
  title: `Balloon Decoration Gallery — ${business.city}`,
  description: `A look at the balloon and event decoration setups we build in ${business.city} — birthdays, baby showers, anniversaries, proposals, weddings and shop openings.`,
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(breadcrumbSchema([{ name: "Gallery", path: "/gallery" }]))),
        }}
      />

      <PageHero
        eyebrow="Gallery"
        lines={["The work,", { text: "up close.", className: "italic text-rose-deep" }]}
        lead={`Setups across ${business.city} — from single-wall garlands to full room transformations.`}
        crumbs={[{ name: "Gallery", path: "/gallery" }]}
      />

      <section className="section-y" aria-label="Gallery">
        <div className="shell">
          <GalleryGrid items={galleryItems} />

          {galleryIsIllustrated && (
            <div className="mt-14 rounded-[6px] border border-sand bg-cream p-8 md:p-10">
              <h2 className="font-display text-2xl text-ink">
                These are illustrations, not photographs
              </h2>
              <p className="mt-3 max-w-2xl text-[0.93rem] leading-relaxed text-ink-muted">
                Our photo gallery is still being put together, so the images
                above are illustrations of the kinds of setups we build rather
                than photographs of finished jobs. We would rather say that
                plainly than pass off pictures that are not ours. Message us and
                we will send real photographs from recent setups straight away.
              </p>
              <div className="mt-6">
                <Button
                  href={whatsappHref(
                    `Hi ${business.name}, please send me photos of recent decoration setups in ${business.city}.`,
                  )}
                  external
                  variant="accent"
                  size="md"
                  arrow
                  analytics="whatsapp_clicked"
                  analyticsData={{ source: "gallery_notice" }}
                >
                  Ask for real photos
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
