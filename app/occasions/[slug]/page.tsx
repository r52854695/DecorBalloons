import type { Metadata } from "next";
import { PhotoOrScene } from "@/components/decor/PhotoOrScene";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Parallax } from "@/components/motion/Parallax";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { GalleryGrid } from "@/components/ui/GalleryGrid";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, jsonLd, serviceSchema } from "@/lib/seo/schema";
import { getOccasion, occasions } from "@/data/occasions";
import { decorationsForOccasion } from "@/data/decorations";
import { galleryForOccasion, galleryItems } from "@/data/gallery";
import { faqsForOccasion } from "@/data/faqs";
import { business, whatsappHref } from "@/data/business";

/** Pre-render every occasion at build time — they are all known and static. */
export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/occasions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) return buildMetadata({ title: "Not found", description: "", path: "/occasions", noIndex: true });

  return buildMetadata({
    title: occasion.seo.title,
    description: occasion.seo.description,
    path: `/occasions/${occasion.slug}`,
  });
}

export default async function OccasionPage({ params }: PageProps<"/occasions/[slug]">) {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  const related = decorationsForOccasion(occasion.slug);
  const faqs = faqsForOccasion(occasion.slug);
  const gallery = galleryForOccasion(occasion.slug);
  const galleryShown = gallery.length >= 3 ? gallery : galleryItems.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd(
              serviceSchema(occasion),
              faqSchema(faqs),
              breadcrumbSchema([
                { name: "Occasions", path: "/occasions" },
                { name: occasion.name, path: `/occasions/${occasion.slug}` },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow={`${occasion.emoji} ${occasion.name}`}
        lines={[occasion.headline]}
        lead={occasion.intro}
        accent={occasion.palette[0]}
        crumbs={[
          { name: "Occasions", path: "/occasions" },
          { name: occasion.name, path: `/occasions/${occasion.slug}` },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" variant="primary" size="md" arrow analytics="hero_cta_clicked" analyticsData={{ source: `occasion_${occasion.slug}` }}>
            Plan my {occasion.name.toLowerCase()}
          </Button>
          <Button
            href={whatsappHref(`Hi ${business.name}, I'd like a ${occasion.name.toLowerCase()} decoration in ${business.city}.`)}
            external
            variant="outline"
            size="md"
            analytics="whatsapp_clicked"
            analyticsData={{ source: `occasion_${occasion.slug}` }}
          >
            WhatsApp us
          </Button>
        </div>
      </PageHero>

      {/* ── what a setup includes ── */}
      <section className="section-y" aria-labelledby="includes-heading">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <ScrollReveal variant="slideRight">
            <div className="overflow-hidden rounded-[6px] bg-cream">
              <Parallax speed={0.1}>
                <div className="relative aspect-4/3">
                  <PhotoOrScene
                    photos={occasion.photos}
                    photoCategory={occasion.photoCategory}
                    sceneKey={`occ-${occasion.slug}-lg`}
                    alt={`${occasion.name} decoration setup in ${business.city}`}
                    sizes="(min-width:1024px) 50vw, 100vw"
                    priority
                  />
                </div>
              </Parallax>
            </div>
          </ScrollReveal>

          <div>
            <h2 id="includes-heading" className="font-display text-title text-ink">
              What a {occasion.name.toLowerCase()} setup includes
            </h2>
            <ul className="mt-7 space-y-3.5">
              {occasion.includes.map((inc) => (
                <li key={inc} className="flex gap-3.5 border-b border-sand pb-3.5 text-[0.95rem] text-ink-soft">
                  <span aria-hidden="true" className="mt-[0.55em] block h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
                  {inc}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow">Popular styles</h3>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-ink-muted">
                  {occasion.styles.join(" · ")}
                </p>
              </div>
              <div>
                <h3 className="eyebrow">Where we set up</h3>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-ink-muted">
                  {occasion.venues.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── related decorations ── */}
      {related.length > 0 && (
        <section className="section-y bg-cream" aria-labelledby="related-heading">
          <div className="shell">
            <SectionHeading
              eyebrow="Setups"
              lines={[`Decorations for a ${occasion.name.toLowerCase()}`]}
              link={{ href: "/decorations", label: "All decorations" }}
            />
            <span id="related-heading" className="sr-only">
              Decorations suited to a {occasion.name}
            </span>

            <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((d, i) => (
                <ScrollReveal key={d.slug} as="li" delay={i * 0.07}>
                  <Link href={`/decorations/${d.slug}`} className="group block">
                    <div className="scene-frame relative aspect-4/3 overflow-hidden rounded-[4px] bg-ivory">
                      <PhotoOrScene
                        photos={d.photos}
                        photoCategory={d.photoCategory}
                        sceneKey={`dec-list-${d.slug}`}
                        alt={`${d.name} for a ${occasion.name.toLowerCase()} in ${business.city}`}
                        sizes="(min-width:1024px) 33vw, 100vw"
                        className="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-xl text-ink transition-colors group-hover:text-rose-deep">
                      {d.name}
                    </h3>
                    <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-muted">{d.summary}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── gallery ── */}
      <section className="section-y" aria-labelledby="occ-gallery-heading">
        <div className="shell">
          <SectionHeading
            eyebrow="Gallery"
            lines={[`${occasion.name} decoration in ${business.city}`]}
            link={{ href: "/gallery", label: "Full gallery" }}
          />
          <span id="occ-gallery-heading" className="sr-only">
            {occasion.name} gallery
          </span>
          <div className="mt-10">
            <GalleryGrid items={galleryShown} />
          </div>
        </div>
      </section>

      <FaqSection
        items={faqs}
        eyebrow={`${occasion.name} questions`}
        lines={["Questions about", { text: `${occasion.name.toLowerCase()} setups.`, className: "italic text-rose-deep" }]}
      />

      <FinalCTA />
    </>
  );
}
