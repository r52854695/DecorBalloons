import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLd } from "@/lib/seo/schema";
import { categories } from "@/data/catalog";
import { cities } from "@/data/cities";
import { business } from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: `Areas We Cover — Balloon Decoration Across ${business.city}`,
  description: `Balloon decoration across ${business.city} — ${business.serviceAreas.slice(0, 4).join(", ")} and more, plus Danapur, Hajipur, Arrah, Muzaffarpur and Gaya. Setup and clear-up by our own team.`,
  path: "/areas",
});

/**
 * One page covering every area, rather than a page per locality.
 *
 * Ten near-identical "balloon decoration in <locality>" pages is the classic
 * doorway pattern Google penalises: pages built for a search engine, differing
 * only by a place name, all funnelling to the same catalogue. Real per-area
 * pages need real per-area substance — typical venues, travel time, what the
 * studio actually does there — and none of that has been supplied yet.
 *
 * So this page carries the coverage honestly in one place, which is genuinely
 * useful to someone checking whether we reach them. If the client later
 * supplies real detail per locality, individual pages become defensible.
 */
export default function AreasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd(breadcrumbSchema([{ name: "Areas we cover", path: "/areas" }])),
          ),
        }}
      />

      <PageHero
        eyebrow="Coverage"
        lines={["Where we", { text: "set up.", className: "italic text-rose-deep" }]}
        lead={`We are based in ${business.city} and decorate across the city and the towns around it. Our own team installs and clears away — nothing is handed to a subcontractor.`}
        crumbs={[{ name: "Areas we cover", path: "/areas" }]}
      />

      <section className="section-y" aria-labelledby="patna-areas">
        <div className="shell max-w-4xl">
          <h2 id="patna-areas" className="font-display text-[1.7rem] leading-tight text-ink md:text-[2rem]">
            Across {business.city}
          </h2>
          <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-ink-muted">
            Most of our work is inside {business.city}. These are the areas we
            reach most often — if yours is not listed, it does not mean we will
            not come, so ask.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {business.serviceAreas.map((a) => (
              <li
                key={a}
                className="rounded-full border border-sand bg-white px-4 py-2 text-[0.85rem] text-ink"
              >
                {a}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 font-display text-[1.7rem] leading-tight text-ink md:text-[2rem]">
            Towns we travel to
          </h2>
          <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-ink-muted">
            Outside {business.city} we work to the notes below. Distance changes
            how much notice we need, not what we build.
          </p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <li
                key={c.slug}
                className="rounded-[7px] border border-sand bg-white px-4 py-3"
              >
                <span className="block text-[0.92rem] font-medium text-ink">{c.name}</span>
                <span className="block text-[0.76rem] text-ink-faint">{c.note}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-14 font-display text-[1.7rem] leading-tight text-ink md:text-[2rem]">
            What we set up
          </h2>
          <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-ink-muted">
            Every category below is available anywhere we cover.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/catalog/${c.slug}`}
                className="rounded-full border border-sand bg-white px-4 py-2 text-[0.85rem] text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <p className="mt-10 border-t border-sand pt-6 text-[0.88rem] leading-relaxed text-ink-muted">
            Not sure whether we reach you?{" "}
            <Link href="/contact" className="font-medium text-ink underline">
              Tell us the address
            </Link>{" "}
            and we will confirm before you book anything.
          </p>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
