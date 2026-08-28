import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { ShelfArrows } from "./ShelfArrows";
import { ShelfChips } from "./ShelfChips";
import type { Category } from "@/data/catalog";

/**
 * One catalogue row: heading, theme chips, and a horizontally scrolling shelf
 * of priced setups.
 *
 * A server component. It used to be a client component so it could filter by
 * theme in React, which meant every product card it rendered hydrated too —
 * seventy of them across the homepage, and mobile LCP sat at eight seconds with
 * a 7.4s render delay while the main thread worked through them.
 *
 * Now the cards are static server output. The only client code is
 * `ShelfControls`, which sets `data-filter` on the shelf; CSS hides the cards
 * that do not match (see ShelfFilterStyles). Same behaviour, none of the
 * hydration.
 *
 * The shelf is still a native `overflow-x` scroller with scroll-snap rather
 * than a JS carousel, so trackpad, touch and keyboard all work on their own.
 */
export function CategoryRow({
  category,
  priority = false,
  /**
   * Cap on cards rendered here. The homepage shows a preview and sends people
   * to the category page for the rest; rendering all seventy setups up front
   * cost DOM size for cards nobody scrolls to.
   */
  limit,
}: {
  category: Category;
  priority?: boolean;
  limit?: number;
}) {
  const shelfId = `shelf-${category.slug}`;
  const shown = limit ? category.products.slice(0, limit) : category.products;
  const hasMore = shown.length < category.products.length;

  return (
    <section aria-labelledby={`cat-${category.slug}`} className="py-5 md:py-6">
      <div className="shell-wide">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div>
            <h2
              id={`cat-${category.slug}`}
              className="font-display text-[1.6rem] leading-none text-ink md:text-[1.9rem]"
            >
              {category.name}
            </h2>
            <p className="mt-1.5 text-[0.84rem] text-ink-muted">
              {category.blurb}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ShelfArrows shelfId={shelfId} categoryName={category.name} />
            <Link
              href={`/catalog/${category.slug}`}
              className="text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-rose-deep"
            >
              View all →
            </Link>
          </div>
        </div>

        {category.themes && (
          <ShelfChips shelfId={shelfId} themes={category.themes} />
        )}
      </div>

      <div
        id={shelfId}
        className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shown.map((p, i) => (
          <div
            key={p.slug}
            // Read by the filter stylesheet. Untagged cards stay visible under
            // every filter, which is the right default for a category whose
            // products are not themed.
            data-theme={p.theme}
            className="w-[62vw] shrink-0 snap-start sm:w-[38vw] md:w-[30vw] lg:w-[23vw] xl:w-[19rem]"
          >
            <ProductCard product={p} priority={priority && i < 2} />
          </div>
        ))}

        {hasMore && (
          <Link
            href={`/catalog/${category.slug}`}
            className="flex w-[42vw] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-sand text-center text-[0.82rem] text-ink-muted transition-colors hover:border-ink/30 hover:text-ink sm:w-[26vw] md:w-[20vw] lg:w-[15vw] xl:w-[12rem]"
          >
            <span aria-hidden="true" className="text-lg">
              →
            </span>
            All {category.products.length} {category.name.toLowerCase()} setups
          </Link>
        )}
      </div>
    </section>
  );
}
