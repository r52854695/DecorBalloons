"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Category } from "@/data/catalog";
import { cn } from "@/lib/utils";

/**
 * One catalogue row: heading, optional theme chips, and a horizontally
 * scrolling shelf of priced setups.
 *
 * The shelf is a native `overflow-x-auto` scroller with scroll-snap rather
 * than a JS carousel — it works with a trackpad, a touch swipe, and the
 * keyboard on day one, and costs no JavaScript to run. The arrow buttons just
 * call `scrollBy`.
 *
 * Filtering is local to the row so switching a chip never re-renders the rest
 * of the page.
 */
export function CategoryRow({
  category,
  priority = false,
}: {
  category: Category;
  /** Eager-load the first row's images; everything below the fold is lazy. */
  priority?: boolean;
}) {
  const [theme, setTheme] = useState<string>("All");
  const shelf = useRef<HTMLDivElement>(null);

  const shown =
    theme === "All" ? category.products : category.products.filter((p) => p.theme === theme);

  const nudge = (dir: 1 | -1) => {
    const el = shelf.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

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
            <p className="mt-1.5 text-[0.84rem] text-ink-muted">{category.blurb}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Arrows are an enhancement; the shelf scrolls without them. */}
            <div className="hidden gap-1.5 md:flex">
              {([-1, 1] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => nudge(d)}
                  aria-label={d === -1 ? `Scroll ${category.name} left` : `Scroll ${category.name} right`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-sand text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
                >
                  <span aria-hidden="true" className="text-[0.8rem]">
                    {d === -1 ? "←" : "→"}
                  </span>
                </button>
              ))}
            </div>
            <Link
              href={`/catalog/${category.slug}`}
              className="text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-rose-deep"
            >
              View all →
            </Link>
          </div>
        </div>

        {category.themes && (
          <div className="mt-3.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {["All", ...category.themes].map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={theme === t}
                onClick={() => setTheme(t)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.76rem] transition-colors",
                  theme === t
                    ? "border-ink bg-ink text-ivory"
                    : "border-sand bg-white text-ink-muted hover:border-ink/30 hover:text-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        ref={shelf}
        className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shown.map((p, i) => (
          <ProductCard
            key={p.slug}
            product={p}
            priority={priority && i < 3}
            className="w-[62vw] shrink-0 snap-start sm:w-[38vw] md:w-[30vw] lg:w-[23vw] xl:w-[19rem]"
          />
        ))}

        {shown.length === 0 && (
          <p className="py-8 text-sm text-ink-muted">
            Nothing in this theme yet — try another, or{" "}
            <Link href="/contact" className="underline">
              ask us
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
