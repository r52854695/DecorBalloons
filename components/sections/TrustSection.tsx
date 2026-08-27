import { ScrollReveal, ScrollRevealItem } from "@/components/motion/ScrollReveal";
import { business } from "@/data/business";

/**
 * The "can I trust these people?" section, answered at roughly ten seconds in.
 *
 * Every line here is a statement about HOW the studio works, never a number.
 * The reference sites lean on claims like "5 Lakh+ clients" and star averages;
 * none of that has been verified for this business, and inventing it would be
 * both dishonest and a review-spam policy problem. Describing the actual
 * service is more persuasive than a statistic a visitor half-believes anyway.
 *
 * If the client later supplies real figures — jobs completed, years active, a
 * genuine Google rating — they belong here, and in the schema in lib/seo.
 */
const PILLARS = [
  {
    title: "Professional setup",
    body: "Our own team installs, fixes and finishes every setup — not a drop-off of materials for you to arrange.",
  },
  {
    title: "Custom themes",
    body: "Send a colour, a reference photo or the cake design, and the palette is built around it.",
  },
  {
    title: "On-time service",
    body: "Setups are planned to a window you give us, including midnight birthdays and early shop openings.",
  },
  {
    title: `${business.city} local`,
    body: `We are based in ${business.city} and work across the city, so a site visit or a change of plan is a short drive.`,
  },
  {
    title: "Easy booking",
    body: "One WhatsApp message is enough to start. No account, no deposit before you have seen a quote.",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-sand/70 bg-cream" aria-labelledby="trust-heading">
      <div className="shell py-14 md:py-20">
        <h2 id="trust-heading" className="sr-only">
          Why choose {business.name}
        </h2>

        <ScrollReveal stagger={0.07} as="ul" className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {PILLARS.map((p) => (
            <ScrollRevealItem key={p.title} as="li" className="lg:border-l lg:border-sand lg:pl-6">
              <h3 className="font-display text-xl leading-tight text-ink">{p.title}</h3>
              <p className="mt-2.5 text-[0.86rem] leading-relaxed text-ink-muted">{p.body}</p>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
