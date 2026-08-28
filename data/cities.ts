/**
 * Cities offered in the delivery picker.
 *
 * @verify THESE ARE SERVICE-AREA CLAIMS. Every city listed here tells a
 * visitor that DecorBalloons will travel there and set up. The list is modelled
 * on the reference site's genuinely regional footprint — Patna and towns within
 * practical reach of it — rather than a pan-India list the studio could not
 * honour. The client still has to confirm which of these they actually cover,
 * and remove the ones they do not: someone in Gaya booking a setup that never
 * arrives is a worse outcome than a shorter list.
 *
 * `data/business.ts` -> serviceAreas covers neighbourhoods WITHIN Patna and is
 * a different thing; that feeds local SEO copy, this feeds the picker.
 */
export type City = {
  slug: string;
  name: string;
  /** Shown under the name in the picker. */
  note: string;
};

export const cities: City[] = [
  { slug: "patna", name: "Patna", note: "Same-day setup possible" },
  { slug: "danapur", name: "Danapur", note: "Same-day setup possible" },
  { slug: "hajipur", name: "Hajipur", note: "Next-day recommended" },
  { slug: "bihta", name: "Bihta", note: "Next-day recommended" },
  { slug: "fatuha", name: "Fatuha", note: "Next-day recommended" },
  { slug: "arrah", name: "Arrah", note: "Book a day ahead" },
  { slug: "muzaffarpur", name: "Muzaffarpur", note: "Book a day ahead" },
  { slug: "bihar-sharif", name: "Bihar Sharif", note: "Book a day ahead" },
  { slug: "gaya", name: "Gaya", note: "Book a day ahead" },
  { slug: "chhapra", name: "Chhapra", note: "Book a day ahead" },
];

/** Patna is the studio's home city and the sensible default. */
export const defaultCity = cities[0];

export const getCity = (slug: string | null | undefined) =>
  cities.find((c) => c.slug === slug);

/** localStorage key. Versioned so the list can change without stale picks. */
export const CITY_KEY = "db.city.v1";
