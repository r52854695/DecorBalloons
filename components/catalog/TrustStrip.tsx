/**
 * Four promises, directly under the fold.
 *
 * The reference sites run a strip like this, but theirs are lifted from
 * physical-goods e-commerce — "free shipping", "refund within 30 days" — which
 * mean nothing for a service that is installed in your house. These are the
 * four things that actually reduce hesitation before booking a decorator.
 */
const ITEMS = [
  { title: "Our own team", note: "Not a marketplace of freelancers." },
  { title: "Setup & cleanup", note: "We put it up and take it away." },
  { title: "Same-day possible", note: "Subject to slots on the day." },
  { title: "Clear quote first", note: "Confirmed before we start." },
];

export function TrustStrip() {
  return (
    <section
      aria-label="What to expect"
      className="border-y border-sand bg-white"
    >
      <div className="shell-wide grid grid-cols-2 gap-x-6 gap-y-5 py-6 md:grid-cols-4">
        {ITEMS.map((i) => (
          <div key={i.title}>
            <p className="text-[0.88rem] font-semibold text-ink">{i.title}</p>
            <p className="mt-0.5 text-[0.78rem] leading-snug text-ink-muted">
              {i.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
