/**
 * Single source of truth for business facts.
 *
 * ─────────────────────────────────────────────────────────────
 *  ⚠  CLIENT VERIFICATION REQUIRED before this site goes live.
 *     Every field tagged `@verify` was supplied second-hand or
 *     was inconsistent in the brief. Nothing here is invented —
 *     unknown values are left empty and the UI hides them.
 * ─────────────────────────────────────────────────────────────
 */

export const business = {
  /**
   * CONFIRMED by the client: plural, "DecorBalloons".
   *
   * This was open for a while — the brief's prose said "DecorBalloon", the
   * logo artwork reads "DECOR Balloons", and the domain that was eventually
   * bought is decorballoon.in, singular. The domain is just an address; the
   * brand is plural and matches the logo sitting beside this wordmark.
   *
   * Still the single source of truth: change this one value and every title,
   * schema node, OG tag and line of copy follows.
   */
  name: "DecorBalloons",
  legalName: "DecorBalloons",
  tagline: "Your celebration. Our magic.",

  city: "Patna",
  state: "Bihar",
  country: "India",
  countryCode: "IN",
  postalCode: "800003",

  /**
   * @verify ADDRESS — the client supplied two versions of the same address.
   * The short form below was chosen because the client said it reads better.
   * The long form is retained for maps//directions once confirmed.
   *   Long form: "East Lohanipur, Kashi Nath Lane, Near Apollo Center School, Patna - 800003"
   */
  address: "A-192, Lohanipur, Kadam Kuan, Patna - 3",
  addressLong: "East Lohanipur, Kashi Nath Lane, Near Apollo Center School, Patna - 800003",
  addressLocality: "Kadam Kuan, Patna",

  /**
   * @verify PHONE — the brief is internally inconsistent. Its sample config
   * shows "+919155533992" while the prose states "+91 9155539922" three
   * separate times (sections 12, 35, 36). The prose spelling is used here.
   * CONFIRM THE DIGITS WITH THE CLIENT BEFORE LAUNCH — a wrong number on a
   * lead-generation site loses every enquiry.
   */
  primaryPhone: "+919155539922",
  secondaryPhone: "+919473418289",
  whatsappNumber: "+919155539922",

  /**
   * @verify EMAIL — no verified address was supplied. Deliberately empty.
   * The UI checks for this and simply omits email everywhere when blank,
   * rather than inventing one. Set NEXT_PUBLIC_CONTACT_EMAIL to enable.
   */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",

  /** @verify Service hours unknown — omitted from LocalBusiness schema until confirmed. */
  openingHours: null as null | { days: string[]; opens: string; closes: string }[],

  /** Areas genuinely served. Used for local SEO copy and schema `areaServed`. */
  serviceAreas: [
    "Kadam Kuan", "Lohanipur", "Kankarbagh", "Boring Road", "Patliputra",
    "Rajendra Nagar", "Bailey Road", "Danapur", "Rajiv Nagar", "Gandhi Maidan",
  ],

  /** @verify Social profiles — none supplied. Empty entries are not rendered. */
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
  },
} as const;

/** Digits-only, for tel: and wa.me links. */
export const phoneDigits = (p: string) => p.replace(/[^\d]/g, "");

/** Human-friendly Indian formatting: +91 91555 39922 */
export const formatPhone = (p: string) => {
  const d = phoneDigits(p);
  const local = d.startsWith("91") && d.length === 12 ? d.slice(2) : d;
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
};

export const telHref = (p: string) => `tel:+${phoneDigits(p)}`;

/** Builds a wa.me link with a contextual, pre-filled first message. */
export const whatsappHref = (message?: string) => {
  const text =
    message ?? `Hi ${business.name}, I'd like to plan a celebration in ${business.city}.`;
  return `https://wa.me/${phoneDigits(business.whatsappNumber)}?text=${encodeURIComponent(text)}`;
};

/**
 * Canonical site origin, used for every canonical tag, OG URL, sitemap entry
 * and JSON-LD id.
 *
 * Resolution order matters. Falling straight through to the placeholder domain
 * on a Vercel deployment would make the live site declare that its canonical
 * version lives somewhere else entirely — which is worse than having no
 * canonical at all. So a deployment's own URL is preferred over the guess:
 *
 *   1. NEXT_PUBLIC_SITE_URL — the real domain, once the client has one. Wins.
 *   2. The Vercel project's stable production domain.
 *   3. This specific deployment's URL (preview builds).
 *   4. The placeholder, for local development.
 */
const resolveSiteUrl = () => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const vercelProd = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;

  const vercelDeploy = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercelDeploy) return `https://${vercelDeploy}`;

  return "https://decorballoons.in";
};

export const siteUrl = resolveSiteUrl().replace(/\/$/, "");
