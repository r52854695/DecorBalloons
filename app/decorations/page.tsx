import type { Metadata } from "next";
import { PhotoOrScene } from "@/components/decor/PhotoOrScene";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLd } from "@/lib/seo/schema";
import { decorations } from "@/data/decorations";
import { business } from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: `Balloon Decoration Services in ${business.city}`,
  description: `Balloon garlands, arches, columns, room setups and stage backdrops in ${business.city}. Every setup is colour matched to your palette and installed by our team.`,
  path: "/decorations",
});

export default function DecorationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd(breadcrumbSchema([{ name: "Decorations", path: "/decorations" }])),
          ),
        }}
      />

      <PageHero
        eyebrow="Decorations"
        lines={["The setups", { text: "we build.", className: "italic text-rose-deep" }]}
        lead="Garlands, arches, columns, full room transformations and stage backdrops — built to your colours, your space and your occasion."
        crumbs={[{ name: "Decorations", path: "/decorations" }]}
      />

      <section className="section-y" aria-label="All decorations">
        <div className="shell">
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {decorations.map((d, i) => (
              <ScrollReveal key={d.slug} as="li" delay={(i % 3) * 0.07}>
                <Link href={`/decorations/${d.slug}`} className="group block h-full">
                  <div className="scene-frame relative aspect-4/3 overflow-hidden rounded-[4px] bg-cream">
                    <PhotoOrScene
                      photos={d.photos}
                      photoCategory={d.photoCategory}
                      sceneKey={`dec-list-${d.slug}`}
                      alt={`${d.name} in Patna`}
                      className="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                  </div>

                  <span aria-hidden="true" className="mt-4 block h-px w-full bg-sand">
                    <span className="block h-px w-0 bg-rose-deep transition-[width] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
                  </span>

                  <h2 className="mt-3.5 font-display text-xl text-ink transition-colors group-hover:text-rose-deep">
                    {d.name}
                  </h2>
                  <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink-muted">{d.summary}</p>

                  {/* No price: none has been supplied by the client. */}
                  <span className="mt-3.5 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-rose-deep">
                    Get a quote →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
