import Image from "next/image";
import Link from "next/link";
import { discountPct, formatINR, type Product } from "@/data/catalog";
import { cn } from "@/lib/utils";

/**
 * A bookable setup, priced.
 *
 * Deliberately plain: no scroll reveal, no parallax, no entrance animation.
 * This is a browse-and-compare card and it has to survive being rendered
 * eighty times on one page — the only motion is a hover scale on the image,
 * which the compositor handles for free.
 *
 * Links to the enquiry form with the setup pre-selected rather than to a
 * detail page, so the shortest path from "I like this" to "I asked about it"
 * is one click.
 */
export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const off = discountPct(product.price, product.mrp);

  return (
    <Link
      href={`/contact?setup=${encodeURIComponent(product.slug)}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[8px] border border-sand/80 bg-white transition-shadow duration-300 hover:shadow-[var(--shadow-raise)]",
        className,
      )}
    >
      <div className="relative aspect-4/5 shrink-0 overflow-hidden bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width:1280px) 20vw, (min-width:768px) 30vw, 62vw"
          priority={priority}
          quality={62}
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/90 px-2.5 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.08em] text-ivory">
            {product.badge}
          </span>
        )}
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-ivory/95 px-2.5 py-1 text-[0.66rem] font-medium text-ink">
          {product.duration}
        </span>
      </div>

      {/* Flex column with the price pushed to the bottom. Ratings will exist
          on some setups and not others, and without this the extra line shifts
          the price down on rated cards only — leaving the prices in a shelf
          visibly out of line with each other. */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 min-h-[2.4em] text-[0.86rem] leading-snug text-ink">
          {product.name}
        </h3>

        {/* Renders only with real data. See the note on Product["rating"] —
            the slot exists so the card is complete the day the client
            connects actual reviews, not so it can be filled with invented
            ones. */}
        {product.rating && (
          <p className="mt-1 flex items-center gap-1 text-[0.75rem] text-ink-muted">
            <span aria-hidden="true" className="text-rose-deep">
              ★
            </span>
            <span className="font-medium text-ink">
              {product.rating.score.toFixed(1)}
            </span>
            <span>({product.rating.count} reviews)</span>
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-1.5">
          <span className="text-[1.02rem] font-semibold text-ink">
            {formatINR(product.price)}
          </span>
          <span className="text-[0.78rem] text-ink-faint line-through">
            {formatINR(product.mrp)}
          </span>
          {off > 0 && (
            <span className="text-[0.74rem] font-semibold text-rose-deep">
              {off}% off
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
