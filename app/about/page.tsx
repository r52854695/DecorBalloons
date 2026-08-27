import type { Metadata } from "next";
import { PhotoOrScene } from "@/components/decor/PhotoOrScene";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Parallax } from "@/components/motion/Parallax";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLd } from "@/lib/seo/schema";
import { business } from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: `About — Balloon Decoration Studio in ${business.city}`,
  description: `${business.name} is a balloon and event decoration studio based in ${business.city}. How we work, what we make, and the areas we cover.`,
  path: "/about",
});

/*
 * ─────────────────────────────────────────────────────────────
 *  ⚠  CLIENT CONTENT NEEDED
 *
 *  Everything on this page describes how the service works, which
 *  is verifiable from the service itself. Nothing states a founding
 *  year, a team size, a number of events completed, or a founder's
 *  story, because none of that was supplied — and an About page is
 *  precisely where invented detail does the most damage to trust.
 *
 *  Ask the client for: when they started, who runs the studio, a
 *  line about why they started, and a team photograph. Drop them
 *  into the marked section below.
 * ─────────────────────────────────────────────────────────────
 */

const PRINCIPLES = [
  {
    title: "We install, you don't",
    body: "Every setup is fitted by our own team. We bring the materials, mount and anchor everything properly, and clear our mess before we leave.",
  },
  {
    title: "Built to your palette",
    body: "Send a colour, a reference photo, the cake, or the outfit. We match the scheme to what you are already planning rather than handing you a fixed catalogue.",
  },
  {
    title: "Planned around the moment",
    body: "Midnight birthdays, surprise arrivals, ribbon cuttings before opening hours — the timing is usually the hard part, so we plan the install around it.",
  },
  {
    title: "Straight answers",
    body: "If something will not work in your space, or will not look like the reference photo, we say so before you book rather than after.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(breadcrumbSchema([{ name: "About", path: "/about" }]))),
        }}
      />

      <PageHero
        eyebrow="About"
        lines={["A decoration studio", { text: `in ${business.city}.`, className: "italic text-rose-deep" }]}
        lead={`${business.name} designs and installs balloon and event decoration across ${business.city} — birthdays and baby showers at home, ceremonies and functions in halls, and openings on the shop front.`}
        crumbs={[{ name: "About", path: "/about" }]}
      />

      <section className="section-y" aria-labelledby="approach-heading">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <ScrollReveal variant="slideRight">
            <div className="overflow-hidden rounded-[6px] bg-cream">
              <Parallax speed={0.12}>
                <div className="aspect-4/3">
                  <PhotoOrScene
                    photos={["/images/decor/surprise-birthday/surprise-birthday-02.jpg"]}
                    sceneKey="about-scene"
                    alt={`A room decorated by ${business.name} in ${business.city}`}
                    sizes="(min-width:1024px) 50vw, 100vw"
                    priority
                  />
                </div>
              </Parallax>
            </div>
          </ScrollReveal>

          <div>
            <h2 id="approach-heading" className="font-display text-display text-ink">
              How we work
            </h2>
            <p className="mt-6 text-lead text-ink-muted">
              Most of what we do happens in ordinary rooms — a living room, a
              bedroom, a terrace, a shop front. The job is to make that space
              feel like an occasion for a few hours, and then to be photographed
              well from every angle someone points a phone.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
              That means paying attention to the things people notice
              afterwards: whether the balloon work is clustered by hand or
              spaced like beads on a string, whether the backdrop is centred on
              where everyone will actually stand, and whether the lighting still
              works once the sun has gone.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y bg-cream" aria-labelledby="principles-heading">
        <div className="shell">
          <p className="eyebrow">What you can expect</p>
          <h2 id="principles-heading" className="mt-4 font-display text-display text-ink">
            Four things we hold to
          </h2>

          <ul className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <ScrollReveal key={p.title} as="li" delay={(i % 2) * 0.08}>
                <p className="font-display text-4xl leading-none text-rose-light">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-xl text-ink">{p.title}</h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-muted">{p.body}</p>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y" aria-labelledby="areas-heading">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <Image
              src="/images/brand/logo-mark.png"
              alt={`${business.name} logo`}
              width={200}
              height={251}
              className="h-auto w-[150px]"
            />
            <p className="mt-6 font-display text-2xl leading-snug text-ink">
              {business.tagline}
            </p>
          </div>

          <div>
            <h2 id="areas-heading" className="font-display text-title text-ink">
              Where we work
            </h2>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-muted">
              We are based in {business.address.split(",").slice(1, 3).join(",").trim()} and
              cover {business.city} — including {business.serviceAreas.slice(0, -1).join(", ")} and{" "}
              {business.serviceAreas.at(-1)}. If your venue sits just outside the
              city, send us the location and we will tell you honestly whether we
              can reach it.
            </p>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="border-l border-sand pl-5">
                <dt className="eyebrow">Studio</dt>
                <dd className="mt-2 text-[0.9rem] leading-relaxed text-ink-muted">
                  <address className="not-italic">
                    {business.address}
                    <br />
                    {business.state}, {business.country}
                  </address>
                </dd>
              </div>
              <div className="border-l border-sand pl-5">
                <dt className="eyebrow">We decorate for</dt>
                <dd className="mt-2 text-[0.9rem] leading-relaxed text-ink-muted">
                  Homes, terraces, banquet halls, hotels, offices, showrooms and
                  shop fronts.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
