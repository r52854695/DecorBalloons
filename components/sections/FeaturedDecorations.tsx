import Link from "next/link";
import { PhotoOrScene } from "@/components/decor/PhotoOrScene";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Parallax } from "@/components/motion/Parallax";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { decorations } from "@/data/decorations";
import { cn } from "@/lib/utils";

/**
 * Featured decorations as alternating editorial rows rather than another card
 * grid — the occasions section directly above is already a grid, and two
 * grids back to back is what makes a site feel templated.
 *
 * Only three appear here; the rest live on /decorations. Depth of one thing
 * beats a wall of eight.
 */
export function FeaturedDecorations() {
  const featured = decorations.slice(0, 3);

  return (
    <section className="section-y bg-paper" aria-labelledby="decorations-heading">
      <div className="shell">
        <SectionHeading
          eyebrow="Signature setups"
          lines={["The pieces we", { text: "build most often.", className: "italic text-rose-deep" }]}
          lead="Each one is made to your colours and your space. Pricing depends on size, venue and finish, so we quote per setup rather than from a list."
          link={{ href: "/decorations", label: "All decorations" }}
        />
        <span id="decorations-heading" className="sr-only">
          Featured decorations
        </span>

        <div className="mt-14 flex flex-col gap-16 md:gap-24">
          {featured.map((d, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={d.slug}
                className="grid items-center gap-8 md:grid-cols-12 md:gap-12"
              >
                <ScrollReveal
                  variant={flipped ? "slideLeft" : "slideRight"}
                  className={cn(
                    "md:col-span-7",
                    flipped && "md:order-2",
                  )}
                >
                  <Link
                    href={`/decorations/${d.slug}`}
                    className="group block overflow-hidden rounded-[5px] bg-cream"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Parallax speed={0.12}>
                      <div className="scene-frame relative aspect-4/3 md:aspect-3/2">
                        <PhotoOrScene
                          photos={d.photos}
                          photoCategory={d.photoCategory}
                          sceneKey={`dec-${d.slug}`}
                          alt={`${d.name} by DecorBalloons in Patna`}
                          sizes="(min-width:768px) 58vw, 100vw"
                          className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                        />
                      </div>
                    </Parallax>
                  </Link>
                </ScrollReveal>

                <ScrollReveal
                  variant="fadeUp"
                  delay={0.1}
                  className={cn("md:col-span-5", flipped && "md:order-1")}
                >
                  <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 font-display text-title text-ink">
                    <Link href={`/decorations/${d.slug}`} className="link-draw">
                      {d.name}
                    </Link>
                  </h3>
                  <p className="mt-4 text-lead text-ink-muted">{d.summary}</p>

                  <ul className="mt-6 space-y-2">
                    {d.includes.slice(0, 4).map((inc) => (
                      <li key={inc} className="flex gap-3 text-[0.88rem] text-ink-soft">
                        <span aria-hidden="true" className="mt-[0.45em] block h-1 w-1 shrink-0 rounded-full bg-rose" />
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {/*
                      No price is shown anywhere on this site. The client has
                      not supplied a rate card, and a made-up "from ₹X" is the
                      fastest way to lose trust on the first enquiry.
                    */}
                    <Button href="/contact" variant="accent" size="sm" arrow>
                      Get a quote
                    </Button>
                    <Link
                      href={`/decorations/${d.slug}`}
                      className="link-draw text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink-soft"
                    >
                      See details
                    </Link>
                  </div>
                </ScrollReveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
