import Image from "next/image";
import Link from "next/link";
import { business, formatPhone, telHref, whatsappHref } from "@/data/business";
import { footerNav } from "@/data/navigation";

/**
 * Warm-cream footer, deliberately light: the final CTA band immediately above
 * it is deep ink, so closing on cream gives the page a light-dark-light rhythm
 * instead of two dark slabs stacked on top of each other.
 *
 * This is also where the client's actual logo artwork is used at a size where
 * its own wordmark is legible — see components/layout/Wordmark.tsx for why the
 * navbar sets the lockup as type instead.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain bg-cream">
      <div className="shell relative z-1 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)]">
          {/* ── brand ── */}
          <div>
            <Link href="/" aria-label={`${business.name} — home`} className="inline-block">
              <Image
                src="/images/brand/logo-mark.png"
                alt={`${business.name} logo`}
                width={168}
                height={211}
                className="h-auto w-[132px] md:w-[152px]"
              />
            </Link>

            <p className="mt-6 max-w-xs font-display text-xl leading-snug text-ink">
              {business.tagline}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              Premium balloon and event decoration, designed and installed across{" "}
              {business.city}.
            </p>
          </div>

          {/* ── links + contact ── */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="eyebrow">{col.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="link-draw text-sm text-ink-soft hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="eyebrow">Get in touch</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href={telHref(business.primaryPhone)}
                    className="link-draw text-ink-soft hover:text-ink"
                  >
                    {formatPhone(business.primaryPhone)}
                  </a>
                </li>
                <li>
                  <a
                    href={telHref(business.secondaryPhone)}
                    className="link-draw text-ink-soft hover:text-ink"
                  >
                    {formatPhone(business.secondaryPhone)}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-draw text-rose-deep"
                  >
                    WhatsApp us
                  </a>
                </li>
                {/* Email is rendered only when a verified address exists — see data/business.ts */}
                {business.email && (
                  <li>
                    <a
                      href={`mailto:${business.email}`}
                      className="link-draw text-ink-soft hover:text-ink"
                    >
                      {business.email}
                    </a>
                  </li>
                )}
              </ul>

              <address className="mt-5 text-sm not-italic leading-relaxed text-ink-muted">
                {business.address}
                <br />
                {business.state}, {business.country}
              </address>
            </div>
          </div>
        </div>

        {/* ── service areas: local relevance stated once, naturally ── */}
        <div className="mt-14 border-t border-sand pt-6">
          <p className="text-[0.78rem] leading-relaxed text-ink-faint">
            <span className="text-ink-muted">Serving </span>
            {business.serviceAreas.join(" · ")}
            <span className="text-ink-muted"> and across {business.city}.</span>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-sand pt-6 text-[0.78rem] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/faq" className="link-draw hover:text-ink">
              FAQ
            </Link>
            <Link href="/contact" className="link-draw hover:text-ink">
              Contact
            </Link>
            <Link href="/about" className="link-draw hover:text-ink">
              About
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
