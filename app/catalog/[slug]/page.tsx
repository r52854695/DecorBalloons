import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo/metadata";
import { categoryItemListSchema, jsonLd, productSchema } from "@/lib/seo/schema";
import { categories, getCategory } from "@/data/catalog";
import { business } from "@/data/business";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return buildMetadata({
    title: `${c.name} in ${business.city}`,
    description: `${c.blurb} ${c.products.length} setups available in ${business.city}, set up by our own team.`,
    path: `/catalog/${c.slug}`,
  });
}

/** Full grid for one category — the "View all" destination from each row. */
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string }>;
}) {
  const { slug } = await params;
  const { theme } = await searchParams;
  const category = getCategory(slug);
  if (!category) notFound();

  // Collection tiles deep-link here with a theme already chosen. An unknown
  // or empty theme falls back to everything rather than an empty page.
  const known = theme && category.themes?.includes(theme) ? theme : undefined;
  const shown = known
    ? category.products.filter((p) => p.theme === known)
    : category.products;

  return (
    <>
      {/* Product nodes carry the review data when it exists — Organization
          cannot, because a business rating itself is self-serving in Google's
          eyes. See the note on productSchema. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd(
              categoryItemListSchema(category.name, category.slug, shown),
              ...shown.map((p) => productSchema({ ...p, categoryName: category.name }, category.slug)),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow={`${shown.length} ${shown.length === 1 ? "setup" : "setups"} · ${business.city}`}
        lines={[category.name]}
        lead={known ? `${known} theme — ${category.blurb}` : category.blurb}
        crumbs={[{ name: category.name, path: `/catalog/${category.slug}` }]}
      />

      <section className="section-y">
        <div className="shell-wide">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {shown.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 5} />
            ))}
          </div>

          <div className="mt-10 border-t border-sand pt-6">
            <p className="eyebrow">Other categories</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories
                .filter((c) => c.slug !== category.slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/catalog/${c.slug}`}
                    className="rounded-full border border-sand px-3.5 py-1.5 text-[0.78rem] text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
