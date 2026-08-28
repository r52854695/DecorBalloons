import Image from "next/image";
import Link from "next/link";
import { otherCategories } from "@/data/catalog";

/**
 * The categories that do not get their own shelf.
 *
 * Without this they would only exist in the tile strip at the very top and in
 * the mega menu — reachable, but easy to miss for anyone who scrolled straight
 * past the hero. Cheap to render: one small image each, no cards.
 */
export function MoreCategories() {
  if (otherCategories.length === 0) return null;

  return (
    <section
      aria-labelledby="more-cats"
      className="border-t border-sand py-8 md:py-10"
    >
      <div className="shell-wide">
        <h2
          id="more-cats"
          className="font-display text-[1.6rem] leading-none text-ink md:text-[1.9rem]"
        >
          Also decorated by us
        </h2>
        <p className="mt-1.5 text-[0.84rem] text-ink-muted">
          Weddings, shop openings and corporate floors — same team, same setup
          and clear-up.
        </p>

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {otherCategories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/catalog/${c.slug}`}
                className="group flex items-center gap-3 rounded-[8px] border border-sand bg-white p-2.5 transition-colors hover:border-ink/30"
              >
                <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-[5px] bg-cream">
                  <Image
                    src={c.products[0].image}
                    alt=""
                    fill
                    sizes="48px"
                    quality={62}
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.86rem] font-medium text-ink">
                    {c.name}
                  </span>
                  <span className="block text-[0.72rem] text-ink-faint">
                    {c.products.length} setups
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
