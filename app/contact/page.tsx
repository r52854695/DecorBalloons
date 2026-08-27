import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { FaqSection } from "@/components/sections/FaqSection";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLd } from "@/lib/seo/schema";
import { generalFaqs } from "@/data/faqs";
import {
  business,
  formatPhone,
  telHref,
  whatsappHref,
} from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: `Contact — Balloon Decoration in ${business.city}`,
  description: `Get in touch with ${business.name} for balloon and event decoration in ${business.city}. Call, WhatsApp, or send your celebration details and we will plan it with you.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(breadcrumbSchema([{ name: "Contact", path: "/contact" }]))),
        }}
      />

      <PageHero
        eyebrow="Contact"
        lines={["Let's plan", { text: "your celebration.", className: "italic text-rose-deep" }]}
        lead="Tell us the occasion, the date and where it is happening. We will come back with a plan and a clear quote."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <section className="section-y" aria-labelledby="contact-heading">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <h2 id="contact-heading" className="sr-only">
              Enquiry form
            </h2>
            <LeadForm />
          </div>

          <aside className="lg:border-l lg:border-sand lg:pl-12">
            <Image
              src="/images/brand/logo-mark.png"
              alt={`${business.name} logo`}
              width={140}
              height={176}
              className="h-auto w-[104px]"
            />

            <h2 className="mt-7 font-display text-2xl text-ink">Reach us directly</h2>

            <dl className="mt-6 space-y-6 text-[0.93rem]">
              <div>
                <dt className="eyebrow">Call</dt>
                <dd className="mt-2 space-y-1">
                  <a href={telHref(business.primaryPhone)} className="link-draw block text-ink">
                    {formatPhone(business.primaryPhone)}
                  </a>
                  <a href={telHref(business.secondaryPhone)} className="link-draw block text-ink">
                    {formatPhone(business.secondaryPhone)}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="eyebrow">WhatsApp</dt>
                <dd className="mt-2">
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-draw text-rose-deep"
                  >
                    Message us on WhatsApp
                  </a>
                </dd>
              </div>

              {/* Email is rendered only when a verified address exists. */}
              {business.email && (
                <div>
                  <dt className="eyebrow">Email</dt>
                  <dd className="mt-2">
                    <a href={`mailto:${business.email}`} className="link-draw text-ink">
                      {business.email}
                    </a>
                  </dd>
                </div>
              )}

              <div>
                <dt className="eyebrow">Studio</dt>
                <dd className="mt-2">
                  <address className="not-italic leading-relaxed text-ink-muted">
                    {business.address}
                    <br />
                    {business.state}, {business.country}
                  </address>
                </dd>
              </div>

              <div>
                <dt className="eyebrow">Areas we cover</dt>
                <dd className="mt-2 leading-relaxed text-ink-muted">
                  {business.serviceAreas.join(" · ")} and across {business.city}.
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <FaqSection items={generalFaqs.slice(0, 6)} showContact={false} />
    </>
  );
}
