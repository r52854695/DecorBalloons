import type { Metadata } from "next";
import { business, siteUrl } from "@/data/business";

/**
 * One place that builds page metadata, so every route gets a unique title,
 * description, canonical and social card without repeating the boilerplate.
 */
export function buildMetadata({
  title,
  description,
  path,
  noIndex,
}: {
  /** Page-specific title WITHOUT the brand suffix — the template adds it. */
  title: string;
  description: string;
  /** Route path beginning with "/". Used for the canonical URL. */
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  const fullTitle = path === "/" ? title : `${title} | ${business.name}`;

  return {
    // The root layout defines a "%s | Brand" template. The homepage title is
    // already brand-complete, so it opts out rather than being suffixed twice.
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: business.name,
      title: fullTitle,
      description,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
