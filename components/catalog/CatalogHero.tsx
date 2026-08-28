import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { categories } from "@/data/catalog";
import { business, formatPhone, telHref } from "@/data/business";

/**
 * Catalogue hero.
 *
 * Short on purpose. The old hero was a full-height editorial statement with
 * scroll-linked transforms; this one gets out of the way in about 40vh so the
 * first row of bookable setups is visible almost immediately. Someone landing
 * here is shopping, not reading.
 *
 * The tile strip doubles as the primary category nav on mobile, where the mega
 * menu is behind a tap.
 */
export function CatalogHero() {
  return (
    <section className="border-b border-sand bg-cream/50 pt-[calc(4.5rem+var(--marquee-h))] md:pt-[calc(5.5rem+var(--marquee-h))]">
      <div className="shell-wide pb-4 pt-5 md:pb-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">
              Balloon &amp; event decoration · {business.city}
            </p>
            <h1 className="mt-2 font-display text-[1.85rem] leading-[1.06] text-ink md:text-[2.5rem]">
              Decoration booked in{" "}
              <span className="italic text-rose-deep">minutes</span>, set up at
              your door.
            </h1>
            <p className="mt-2.5 max-w-xl text-[0.9rem] leading-relaxed text-ink-muted">
              Birthdays, anniversaries, baby showers, annaprashan and shop
              openings across {business.city}. Our own team sets up and clears
              away.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Button href="/contact" variant="primary" size="md" arrow>
              Book a setup
            </Button>
            <a
              href={telHref(business.primaryPhone)}
              className="text-[0.86rem] font-medium text-ink-soft hover:text-ink"
            >
              or call {formatPhone(business.primaryPhone)}
            </a>
          </div>
        </div>
      </div>

      {/* category shortcuts */}
      <div className="flex gap-3 overflow-x-auto px-5 pb-4 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            href={`/catalog/${c.slug}`}
            className="group flex w-[4.6rem] shrink-0 flex-col items-center gap-2 text-center"
          >
            <span className="relative block h-[4.6rem] w-[4.6rem] overflow-hidden rounded-full border border-sand bg-cream">
              <Image
                src={c.products[0].image}
                alt=""
                fill
                sizes="74px"
                quality={62}
                // Only the first few tiles are worth pre-loading. Six priority images plus
                // the first row's meant nine requests competing before anything painted.
                priority={i < 3}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </span>
            <span className="text-[0.72rem] leading-tight text-ink-muted group-hover:text-ink">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
