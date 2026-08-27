import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/business";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes accept POST only and hold no indexable content; keeping
        // crawlers out of them saves budget and avoids noise in logs.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
