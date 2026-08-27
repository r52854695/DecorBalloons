import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { business, formatPhone, telHref } from "@/data/business";
import type { Faq } from "@/data/faqs";

/**
 * FAQ accordion built on native <details>/<summary>.
 *
 * No JavaScript, no ARIA to get wrong, keyboard and screen-reader behaviour
 * for free, and the answers are in the DOM as real text so they can be indexed
 * and can back the FAQPage structured data. The open/close is animated with a
 * grid-rows transition, which is the one way to animate to auto height in CSS.
 */
export function FaqSection({
  items,
  eyebrow = "Questions",
  lines = ["Things people", { text: "usually ask.", className: "italic text-rose-deep" }] as const,
  showContact = true,
}: {
  items: Faq[];
  eyebrow?: string;
  lines?: readonly (string | { text: string; className?: string })[];
  showContact?: boolean;
}) {
  return (
    <section className="section-y bg-ivory" aria-labelledby="faq-heading">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20">
        <div>
          <SectionHeading eyebrow={eyebrow} lines={[...lines]} />
          <span id="faq-heading" className="sr-only">
            Frequently asked questions
          </span>

          {showContact && (
            <ScrollReveal variant="fadeUp" delay={0.15} className="mt-8">
              <p className="text-[0.92rem] leading-relaxed text-ink-muted">
                Not covered here? Call us and ask — it is usually a two-minute
                conversation.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  href={telHref(business.primaryPhone)}
                  variant="outline"
                  size="sm"
                  analytics="call_clicked"
                  analyticsData={{ source: "faq" }}
                >
                  {formatPhone(business.primaryPhone)}
                </Button>
              </div>
            </ScrollReveal>
          )}
        </div>

        <ScrollReveal variant="fadeUp" as="div" className="lg:pt-4">
          <ul className="border-t border-sand">
            {items.map((f) => (
              <li key={f.q} className="border-b border-sand">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                    <h3 className="font-display text-lg leading-snug text-ink transition-colors group-open:text-rose-deep md:text-xl">
                      {f.q}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="relative mt-1.5 block h-3.5 w-3.5 shrink-0"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink-muted" />
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink-muted transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-90 group-open:opacity-0" />
                    </span>
                  </summary>
                  <div className="grid grid-rows-[1fr] pb-6">
                    <p className="max-w-2xl overflow-hidden text-[0.92rem] leading-relaxed text-ink-muted">
                      {f.a}
                    </p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
