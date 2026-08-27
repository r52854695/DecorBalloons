import Link from "next/link";
import { BalloonGlyph } from "@/components/decor/BalloonGlyph";
import { Button } from "@/components/ui/Button";
import { featuredOccasions } from "@/data/occasions";
import { business } from "@/data/business";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[78svh] items-center overflow-hidden bg-ivory py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[8%] top-[18%]">
          <BalloonGlyph id="nf1" color="#E6BCA4" size={70} />
        </div>
        <div className="absolute right-[12%] top-[30%] hidden md:block">
          <BalloonGlyph id="nf2" color="#C0805F" size={54} />
        </div>
        <div className="absolute right-[24%] bottom-[14%] hidden lg:block">
          <BalloonGlyph id="nf3" color="#101D30" size={44} />
        </div>
      </div>

      <div className="shell relative z-10 max-w-2xl">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-display text-ink">
          This one floated away.
        </h1>
        <p className="mt-5 text-lead text-ink-muted">
          The page you were after does not exist — but the celebration is still
          on. Try one of these instead.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/" variant="primary" size="lg" arrow>
            Back to home
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Plan my celebration
          </Button>
        </div>

        <nav aria-label="Popular occasions" className="mt-12">
          <h2 className="eyebrow">Popular occasions</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {featuredOccasions.slice(0, 6).map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/occasions/${o.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3.5 py-1.5 text-[0.8rem] text-ink-soft transition-colors hover:border-rose hover:bg-rose-wash hover:text-ink"
                >
                  <span aria-hidden="true">{o.emoji}</span>
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10 text-[0.82rem] text-ink-faint">
          Or just call us — {business.city} based, and usually quicker.
        </p>
      </div>
    </section>
  );
}
