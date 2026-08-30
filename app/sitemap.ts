import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/business";
import { occasions } from "@/data/occasions";
import { decorations } from "@/data/decorations";
import { categories } from "@/data/catalog";

/**
 * Sitemap.
 *
 * Every public route is listed. Priorities reflect commercial intent rather
 * than depth: occasion pages carry the highest-value local search traffic
 * after the homepage, so they rank above the static informational pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/occasions", priority: 0.9, freq: "monthly" },
    { path: "/decorations", priority: 0.9, freq: "monthly" },
    { path: "/gallery", priority: 0.8, freq: "weekly" },
    { path: "/how-it-works", priority: 0.6, freq: "yearly" },
    { path: "/about", priority: 0.6, freq: "yearly" },
    { path: "/contact", priority: 0.8, freq: "yearly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/app", priority: 0.5, freq: "yearly" },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${siteUrl}${r.path === "/" ? "" : r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...categories.map((c) => ({
      url: `${siteUrl}/catalog/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...occasions.map((o) => ({
      url: `${siteUrl}/occasions/${o.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...decorations.map((d) => ({
      url: `${siteUrl}/decorations/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
