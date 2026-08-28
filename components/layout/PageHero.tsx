import Link from "next/link";
import { TextReveal, type RevealLine } from "@/components/motion/TextReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BalloonGlyph } from "@/components/decor/BalloonGlyph";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/**
 * Header for interior pages. Shorter than the homepage hero on purpose — these
 * pages are reached with intent, so they get to the content faster.
 */
export function PageHero({
  eyebrow,
  lines,
  lead,
  crumbs,
  accent = "#C0805F",
  children,
}: {
  eyebrow?: string;
  lines: RevealLine[];
  lead?: string;
  crumbs?: Crumb[];
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-cream pt-[calc(7rem+var(--marquee-h))] pb-14 md:pt-[calc(9rem+var(--marquee-h))] md:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute right-[6%] top-[22%] hidden md:block">
          <BalloonGlyph id="ph-1" color={accent} size={68} />
        </div>
        <div className="absolute right-[18%] top-[58%] hidden lg:block">
          <BalloonGlyph id="ph-2" color="#E6BCA4" size={44} />
        </div>
      </div>

      <div className="shell relative z-10">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-[0.74rem] text-ink-faint">
              <li>
                <Link href="/" className="link-draw hover:text-ink">Home</Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-ink-muted">{c.name}</span>
                  ) : (
                    <Link href={c.path} className="link-draw hover:text-ink">{c.name}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <ScrollReveal variant="fadeUp" as="p">
            <span className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-rose-deep/50" />
              {eyebrow}
            </span>
          </ScrollReveal>
        )}

        <TextReveal
          as="h1"
          immediate
          lines={lines}
          className={cn("mt-4 max-w-4xl font-display text-display text-ink")}
        />

        {lead && (
          <ScrollReveal variant="fadeUp" delay={0.15} as="p">
            <span className="mt-6 block max-w-2xl text-lead text-ink-muted">{lead}</span>
          </ScrollReveal>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
