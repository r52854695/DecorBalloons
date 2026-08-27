import type { Metadata } from "next";
import { photosFor, pickPhotos } from "@/data/photos";
import { CinematicShowcase } from "@/components/sections/CinematicShowcase";
import { PhotoOrScene } from "@/components/decor/PhotoOrScene";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Parallax } from "@/components/motion/Parallax";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqSection } from "@/components/sections/FaqSection";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";

import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  decorationServiceSchema,
  jsonLd,
} from "@/lib/seo/schema";
import { decorations, getDecoration } from "@/data/decorations";
import { getOccasion } from "@/data/occasions";
import { generalFaqs } from "@/data/faqs";
import { business, whatsappHref } from "@/data/business";

export function generateStaticParams() {
  return decorations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/decorations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDecoration(slug);
  if (!d) return buildMetadata({ title: "Not found", description: "", path: "/decorations", noIndex: true });

  return buildMetadata({
    title: d.seo.title,
    description: d.seo.description,
    path: `/decorations/${d.slug}`,
  });
}

export default async function DecorationPage({ params }: PageProps<"/decorations/[slug]">) {
  const { slug } = await params;
  const d = getDecoration(slug);
  if (!d) notFound();

  const relatedOccasions = d.occasions.map(getOccasion).filter(Boolean);
  const others = decorations.filter((x) => x.slug !== d.slug).slice(0, 3);
  // Prefer a whole folder of this setup; otherwise the hand-picked shots.
  const showcasePhotos = d.photoCategory ? photosFor(d.photoCategory, 5) : pickPhotos(d.photos);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd(
              decorationServiceSchema(d),
              breadcrumbSchema([
                { name: "Decorations", path: "/decorations" },
                { name: d.name, path: `/decorations/${d.slug}` },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Decoration"
        lines={[d.name]}
        lead={d.summary}
        accent={d.palette[0]}
        crumbs={[
          { name: "Decorations", path: "/decorations" },
          { name: d.name, path: `/decorations/${d.slug}` },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#enquire" variant="primary" size="md" arrow>
            Get a quote
          </Button>
          <Button
            href={whatsappHref(`Hi ${business.name}, I'm interested in ${d.name} in ${business.city}.`)}
            external
            variant="outline"
            size="md"
            analytics="whatsapp_clicked"
            analyticsData={{ source: `decoration_${d.slug}` }}
          >
            WhatsApp us
          </Button>
        </div>
      </PageHero>

      <section className="section-y" aria-labelledby="detail-heading">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal variant="slideRight">
            <div className="overflow-hidden rounded-[6px] bg-cream">
              <Parallax speed={0.1}>
                <div className="relative aspect-4/3">
                  <PhotoOrScene
                    photos={d.photos}
                    photoCategory={d.photoCategory}
                    sceneKey={`dec-${d.slug}`}
                    alt={`${d.name} by ${business.name} in ${business.city}`}
                    sizes="(min-width:1024px) 50vw, 100vw"
                    priority
                  />
                </div>
              </Parallax>
            </div>
          </ScrollReveal>

          <div>
            <h2 id="detail-heading" className="font-display text-title text-ink">
              About this setup
            </h2>
            <p className="mt-5 text-lead text-ink-muted">{d.description}</p>

            <h3 className="eyebrow mt-9">What it includes</h3>
            <ul className="mt-4 space-y-3">
              {d.includes.map((inc) => (
                <li key={inc} className="flex gap-3.5 border-b border-sand pb-3 text-[0.93rem] text-ink-soft">
                  <span aria-hidden="true" className="mt-[0.55em] block h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
                  {inc}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow">Works well at</h3>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-ink-muted">
                  {d.venues.join(" · ")}
                </p>
              </div>
              <div>
                <h3 className="eyebrow">Pricing</h3>
                {/*
                  Deliberately not a number. Price depends on size, venue and
                  finish, and the client has published no rate card — quoting a
                  figure here would be inventing one.
                */}
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-ink-muted">
                  Quoted per setup, based on size, venue and finish. Send us the
                  details and we will come back with a clear price.
                </p>
              </div>
            </div>

            {relatedOccasions.length > 0 && (
              <div className="mt-8">
                <h3 className="eyebrow">Good for</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {relatedOccasions.map((o) => (
                    <li key={o!.slug}>
                      <Link
                        href={`/occasions/${o!.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3.5 py-1.5 text-[0.78rem] text-ink-soft transition-colors hover:border-rose hover:bg-rose-wash hover:text-ink"
                      >
                        <span aria-hidden="true">{o!.emoji}</span>
                        {o!.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/*
        Cinematic showcase — the same pinned, staged scroll as the homepage
        transformation, played through real photographs of this setup with each
        frame paired to the part of the work it shows. Only rendered when the
        studio has actually photographed this kind of setup.
      */}
      {showcasePhotos.length > 0 && (
        <CinematicShowcase
          eyebrow="The work, frame by frame"
          lines={["From ordinary", { text: "to unforgettable.", className: "italic text-rose-deep" }]}
          photos={showcasePhotos}
          steps={d.includes}
        />
      )}

      {/* ── enquire ── */}
      <section id="enquire" className="section-y bg-cream" aria-labelledby="enquire-heading">
        <div className="shell max-w-3xl">
          <p className="eyebrow">Enquire</p>
          <h2 id="enquire-heading" className="mt-4 font-display text-display text-ink">
            Get a quote for this setup
          </h2>
          <p className="mt-5 text-lead text-ink-muted">
            Tell us the occasion and where it is happening — we will come back
            with options and a price.
          </p>
          <div className="mt-10">
            <LeadForm defaultOccasion={relatedOccasions[0]?.name} />
          </div>
        </div>
      </section>

      {/* ── others ── */}
      <section className="section-y" aria-labelledby="other-heading">
        <div className="shell">
          <h2 id="other-heading" className="font-display text-title text-ink">
            Other setups
          </h2>
          <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-3">
            {others.map((o, i) => (
              <ScrollReveal key={o.slug} as="li" delay={i * 0.07}>
                <Link href={`/decorations/${o.slug}`} className="group block">
                  <div className="relative aspect-4/3 overflow-hidden rounded-[4px] bg-cream">
                    <PhotoOrScene
                      photos={o.photos}
                      photoCategory={o.photoCategory}
                      sceneKey={`dec-list-${o.slug}`}
                      alt={`${o.name} in ${business.city}`}
                      sizes="(min-width:640px) 33vw, 100vw"
                      className="transition-transform duration-[900ms] group-hover:scale-[1.05]"
                    />
                  </div>
                  <h3 className="mt-3.5 font-display text-lg text-ink transition-colors group-hover:text-rose-deep">
                    {o.name}
                  </h3>
                </Link>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection items={generalFaqs.slice(0, 5)} />
      <FinalCTA />
    </>
  );
}
