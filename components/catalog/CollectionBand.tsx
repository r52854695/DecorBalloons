import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/data/catalog";

/**
 * A band of themed tiles between product rows.
 *
 * Breaks up an otherwise uniform stack of shelves, and lets someone shop by
 * theme or by stage of an event rather than by category — the one thing the
 * category rows genuinely cannot do.
 */
export function CollectionBand({ collection }: { collection: Collection }) {
  return (
    <section aria-labelledby={`col-${collection.slug}`} className="bg-cream/60 py-8 md:py-10">
      <div className="shell-wide">
        <h2
          id={`col-${collection.slug}`}
          className="font-display text-[1.6rem] leading-none text-ink md:text-[1.9rem]"
        >
          {collection.title}
        </h2>
        <p className="mt-1.5 text-[0.86rem] text-ink-muted">{collection.subtitle}</p>
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto px-5 pb-1 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {collection.tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="group relative aspect-4/5 w-[38vw] shrink-0 overflow-hidden rounded-[8px] bg-cream sm:w-[26vw] md:w-[20vw] lg:w-[15vw] xl:w-[12rem]"
          >
            <Image
              src={t.image}
              alt={t.label}
              fill
              sizes="(min-width:1280px) 12rem, (min-width:768px) 20vw, 38vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/15 to-transparent"
            />
            <span className="absolute inset-x-0 bottom-0 p-3 text-[0.86rem] font-medium text-ivory">
              {t.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
