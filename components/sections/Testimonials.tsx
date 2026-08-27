import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { business, whatsappHref } from "@/data/business";
import { displayTestimonials, displayingSamples } from "@/data/testimonials";

/**
 * Reviews.
 *
 * With no verified customer reviews supplied, this renders an honest
 * "collecting reviews" state rather than invented quotes. That is a deliberate
 * product decision, not an unfinished section: fabricated reviews on a local
 * business are a Google review-spam violation, and a visitor who later spots
 * one has lost trust in everything else on the page.
 *
 * The empty state is designed to still do conversion work — it says what we
 * will send instead (real photos and references, on request) and puts a
 * WhatsApp CTA where the social proof would have been.
 *
 * Set NEXT_PUBLIC_SHOW_SAMPLE_REVIEWS=true to preview the carded layout with
 * clearly-labelled placeholders.
 */
export function Testimonials() {
  const hasContent = displayTestimonials.length > 0;

  return (
    <section className="section-y bg-paper" id="reviews" aria-labelledby="reviews-heading">
      <div className="shell">
        <SectionHeading
          eyebrow="Reviews"
          lines={["What our customers", { text: "say.", className: "italic text-rose-deep" }]}
        />
        <span id="reviews-heading" className="sr-only">
          Customer reviews
        </span>

        {hasContent ? (
          <>
            {displayingSamples && (
              <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-rose/40 bg-rose-wash px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-rose-deep">
                Placeholder content — not real reviews
              </p>
            )}
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {displayTestimonials.map((t, i) => (
                <ScrollReveal key={t.id} as="li" delay={i * 0.08} variant="fadeUp">
                  <figure className="relative flex h-full flex-col rounded-[5px] border border-sand bg-ivory p-7">
                    {displayingSamples && (
                      <span className="absolute right-4 top-4 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-rose/70">
                        Sample
                      </span>
                    )}
                    <span aria-hidden="true" className="font-display text-4xl leading-none text-rose-light">
                      &ldquo;
                    </span>
                    <blockquote className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-6 border-t border-sand pt-4 text-[0.8rem]">
                      <span className="font-semibold text-ink">{t.author}</span>
                      <span className="block text-ink-faint">
                        {t.occasion} · {t.location}
                      </span>
                    </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
            </ul>
          </>
        ) : (
          <ScrollReveal variant="fadeUp" className="mt-10">
            <div className="grid items-center gap-8 rounded-[6px] border border-sand bg-ivory p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
              <div>
                <p className="font-display text-2xl leading-snug text-ink md:text-3xl">
                  We would rather show you real work than borrowed words.
                </p>
                <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-ink-muted">
                  We are collecting reviews from recent customers and will publish
                  them here as they come in — with their names, their occasion and
                  nothing invented in between. In the meantime, message us and we
                  will send photographs from setups we have finished in{" "}
                  {business.city}, and put you in touch with a recent customer if
                  you would like to ask them directly.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  href={whatsappHref(
                    `Hi ${business.name}, could you send me photos from recent setups in ${business.city}?`,
                  )}
                  external
                  variant="accent"
                  size="md"
                  arrow
                  analytics="whatsapp_clicked"
                  analyticsData={{ source: "reviews_empty_state" }}
                >
                  Ask for recent photos
                </Button>
                <Button href="/gallery" variant="outline" size="md">
                  Browse the gallery
                </Button>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
