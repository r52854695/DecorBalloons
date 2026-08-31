import { NextResponse } from "next/server";
import { categories, discountPct, PRICES_VERIFIED } from "@/data/catalog";
import { business, phoneDigits } from "@/data/business";
import { cities } from "@/data/cities";
import { siteUrl } from "@/data/business";

/**
 * Catalogue feed for the Android app.
 *
 * The native app fetches this rather than shipping its own copy, so a price
 * or a photograph changing on the website reaches every installed app without
 * anyone downloading a new APK. That was the whole point of choosing "fetch
 * from the website" over bundling.
 *
 * Image paths are absolutised: the app has no origin of its own to resolve
 * "/images/..." against.
 *
 * `pricesVerified` is passed through deliberately. While it is false the app
 * knows the numbers are placeholders and can present them accordingly rather
 * than quoting them as final.
 */
export const revalidate = 300;

export function GET() {
  const abs = (p: string) => (p.startsWith("http") ? p : `${siteUrl}${p}`);

  return NextResponse.json(
    {
      updatedAt: new Date().toISOString(),
      pricesVerified: PRICES_VERIFIED,
      business: {
        name: business.name,
        city: business.city,
        phone: business.primaryPhone,
        phoneDigits: phoneDigits(business.primaryPhone),
        siteUrl,
      },
      cities: cities.map((c) => ({ slug: c.slug, name: c.name, note: c.note })),
      categories: categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        blurb: c.blurb,
        themes: c.themes ?? [],
        image: abs(c.products[0]?.image ?? ""),
        products: c.products.map((p) => ({
          slug: p.slug,
          name: p.name,
          price: p.price,
          mrp: p.mrp,
          discount: discountPct(p.price, p.mrp),
          duration: p.duration,
          badge: p.badge ?? null,
          theme: p.theme ?? null,
          image: abs(p.image),
        })),
      })),
    },
    {
      headers: {
        // The app may be on a different origin (file:// in a webview, or no
        // origin at all from native fetch), so this has to be open.
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
