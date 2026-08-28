import { business, phoneDigits, siteUrl } from "@/data/business";
import { verifiedAggregate, testimonials } from "@/data/testimonials";
import { PRICES_VERIFIED, type Product } from "@/data/catalog";
import type { Occasion } from "@/data/occasions";
import type { Decoration } from "@/data/decorations";
import type { Faq } from "@/data/faqs";

/**
 * Structured data.
 *
 * Governing rule: every property emitted here must correspond to something the
 * client has actually confirmed. Ratings, review counts, prices and opening
 * hours are all absent because none were supplied, and inventing them is both
 * dishonest and a documented way to get a business profile penalised. Each
 * omission below is deliberate, not an oversight.
 */

const ORG_ID = `${siteUrl}/#organization`;
const ALLOW_SELF_SERVING_AGGREGATE = false;

const SITE_ID = `${siteUrl}/#website`;

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: business.name,
    legalName: business.legalName,
    url: siteUrl,
    logo: `${siteUrl}/images/brand/logo-mark.png`,
    image: `${siteUrl}/opengraph-image`,
    description:
      "Premium balloon and event decoration studio in Patna, creating birthday, anniversary, baby shower, proposal and wedding setups.",
    telephone: `+${phoneDigits(business.primaryPhone)}`,
    address: {
      "@type": "PostalAddress",
      // @verify — see data/business.ts; address supplied second-hand.
      streetAddress: "A-192, Lohanipur, Kadam Kuan",
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.postalCode,
      addressCountry: business.countryCode,
    },
    areaServed: business.serviceAreas.map((a) => ({
      "@type": "Place",
      name: `${a}, ${business.city}`,
    })),
    knowsAbout: [
      "Balloon decoration",
      "Birthday decoration",
      "Anniversary decoration",
      "Baby shower decoration",
      "Proposal decoration",
      "Wedding decoration",
    ],
    ...(business.email ? { email: business.email } : {}),
    ...(Object.values(business.social).some(Boolean)
      ? { sameAs: Object.values(business.social).filter(Boolean) }
      : {}),

    /*
     * Intentionally NOT emitted until the client confirms real data:
     *   priceRange       — no price list supplied
     *   openingHoursSpecification — hours unknown
     *   aggregateRating  — no verified review platform data
     *   geo              — no confirmed coordinates
     */
    /*
     * Guarded twice on purpose. `verifiedAggregate` says the numbers are real;
     * ALLOW_SELF_SERVING says it is legitimate to publish them here. Google
     * treats a business rating itself on its own site as self-serving and
     * ineligible for LocalBusiness/Organization, so setting real numbers alone
     * must not silently turn this on. Real per-setup reviews belong on the
     * Product nodes instead — see productSchema.
     */
    ...(verifiedAggregate && ALLOW_SELF_SERVING_AGGREGATE
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: verifiedAggregate.ratingValue,
            reviewCount: verifiedAggregate.reviewCount,
          },
        }
      : {}),
    ...(testimonials.length > 0
      ? {
          review: testimonials.map((t) => ({
            "@type": "Review",
            author: { "@type": "Person", name: t.author },
            reviewBody: t.quote,
            ...(t.rating
              ? {
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: t.rating,
                    bestRating: 5,
                  },
                }
              : {}),
          })),
        }
      : {}),
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: siteUrl,
    name: business.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export function serviceSchema(o: Occasion): Json {
  return {
    "@type": "Service",
    name: `${o.name} Decoration in ${business.city}`,
    serviceType: `${o.name} decoration`,
    description: o.seo.description,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: business.city },
    url: `${siteUrl}/occasions/${o.slug}`,
  };
}

export function decorationServiceSchema(d: Decoration): Json {
  return {
    "@type": "Service",
    name: d.name,
    description: d.seo.description,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: business.city },
    url: `${siteUrl}/decorations/${d.slug}`,
    // No `offers` block: publishing a price the client has not set would be
    // worse than having no price markup at all.
  };
}

/**
 * A bookable setup, as a Product.
 *
 * Product is the type to hang review data on. Google does NOT allow
 * "self-serving" AggregateRating on Organization or LocalBusiness — a business
 * rating itself on its own site is ineligible and can draw a manual action —
 * so the org node above deliberately carries none. Product-level ratings, from
 * reviews the business collects about that specific setup, are allowed.
 *
 * Both optional blocks stay closed until real data exists:
 *   offers          — gated on PRICES_VERIFIED, because placeholder prices in
 *                     structured data can surface in search as real quotes.
 *   aggregateRating — gated on the product carrying its own rating.
 */
export function productSchema(
  p: Product & { categoryName?: string },
  categorySlug: string,
): Json {
  return {
    "@type": "Product",
    name: p.name,
    description: `${p.name} in ${business.city}. Setup time about ${p.duration}.`,
    image: `${siteUrl}${p.image}`,
    url: `${siteUrl}/catalog/${categorySlug}`,
    ...(p.categoryName ? { category: p.categoryName } : {}),
    brand: { "@id": ORG_ID },
    ...(PRICES_VERIFIED
      ? {
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/contact?setup=${p.slug}`,
            seller: { "@id": ORG_ID },
          },
        }
      : {}),
    ...(p.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.rating.score,
            reviewCount: p.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

/** Orders the setups on a category page for crawlers. */
export function categoryItemListSchema(name: string, slug: string, items: Product[]): Json {
  return {
    "@type": "ItemList",
    name: `${name} in ${business.city}`,
    url: `${siteUrl}/catalog/${slug}`,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${siteUrl}/contact?setup=${p.slug}`,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  };
}

export function faqSchema(items: Faq[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Wraps one or more nodes into a single @graph document. */
export function jsonLd(...nodes: Json[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
