import { occasions, getOccasion } from "./occasions";
import { decorations, getDecoration } from "./decorations";
import { photosFor, pickPhotos, type Photo } from "./photos";
import { categories as catalogCategories } from "./catalog";

/**
 * Mega-menu configuration.
 *
 * Two rules shape this file:
 *
 * 1. **Every href points at a page that exists.** It is tempting to list
 *    aspirational categories ("Terrace Decoration", "First Night"), but a
 *    navigation link to a 404 is worse than an absent one — for visitors and
 *    for crawlers, which follow these. Each entry below resolves to a real
 *    route; new categories get a page first, then a menu entry.
 *
 * 2. **Images resolve from the occasion/decoration data, not a second list.**
 *    A separate hand-picked image list would drift out of sync with the pages
 *    themselves the first time a photo changed.
 */

export type MegaItem = {
  label: string;
  /** Real route. Mutually exclusive with `action`. */
  href?: string;
  /** For entries that trigger UI rather than navigate. */
  action?: "partypal";
  description: string;
  /** Preview photograph. Undefined only if nothing has been photographed. */
  photo?: Photo;
  /** Design-system colour token for the accent, e.g. "occ-birthday". */
  accent: string;
};

export type MegaColumn = {
  heading: string;
  items: MegaItem[];
};

export type MegaMenu = {
  id: "celebrate" | "decorations" | "explore";
  label: string;
  /** Landing page for the trigger itself, so it is still a real link. */
  href: string;
  columns: MegaColumn[];
  /** Editorial line above the feature panel. */
  featureEyebrow: string;
};

/* ── image resolution ─────────────────────────────────────── */

const occasionPhoto = (slug: string): Photo | undefined => {
  const o = getOccasion(slug);
  if (!o) return undefined;
  const picked = pickPhotos(o.photos);
  return picked[0] ?? (o.photoCategory ? photosFor(o.photoCategory)[0] : undefined);
};

const decorationPhoto = (slug: string): Photo | undefined => {
  const d = getDecoration(slug);
  if (!d) return undefined;
  const picked = pickPhotos(d.photos);
  return picked[0] ?? (d.photoCategory ? photosFor(d.photoCategory)[0] : undefined);
};

/** Builds an item from an occasion, so label/accent/photo stay in sync. */
const fromOccasion = (slug: string, description: string, label?: string): MegaItem => {
  const o = getOccasion(slug);
  return {
    label: label ?? o?.name ?? slug,
    href: `/occasions/${slug}`,
    description,
    photo: occasionPhoto(slug),
    accent: o?.accent ?? "rose",
  };
};


/**
 * Catalogue categories, for the Decorations drawer.
 *
 * The drawer used to list the ten editorial decoration pages. Those still
 * exist, but the catalogue is now the structure customers actually shop, so
 * the menu points at it — a nav that disagrees with the homepage is worse than
 * either version on its own.
 */
const fromCatalog = (slug: string, description?: string): MegaItem => {
  const c = catalogCategories.find((x) => x.slug === slug)!;
  return {
    label: c.name,
    href: `/catalog/${c.slug}`,
    description: description ?? c.blurb,
    photo: { src: c.products[0].image, alt: c.name, w: 1000, h: 1250 },
    accent: "rose",
  };
};

/* ── the three drawers ────────────────────────────────────── */

export const megaMenus: MegaMenu[] = [
  {
    id: "celebrate",
    label: "Celebrate",
    href: "/occasions",
    featureEyebrow: "The occasion",
    columns: [
      {
        heading: "Occasions",
        items: [
          fromOccasion("birthday", "Make their day worth remembering."),
          fromOccasion("anniversary", "Candlelight, roses and a room for two."),
          fromOccasion("baby-shower", "Soft, warm and built for photographs."),
          fromOccasion("annaprashan", "The rice ceremony, styled for the family."),
        ],
      },
      {
        heading: "Special moments",
        items: [
          fromOccasion("proposal", "One moment. It needs to be right."),
          fromOccasion("home-surprise", "Set up while they are out.", "Home Surprise"),
          fromOccasion("engagement", "Staging with a proper focal point."),
        ],
      },
      {
        heading: "Bigger celebrations",
        items: [
          fromOccasion("kids-party", "Themes children actually get excited about."),
          fromOccasion("wedding", "Entrances, stages and photo corners."),
          fromOccasion("corporate", "On-brand, on-schedule, photograph-ready.", "Corporate Events"),
          fromOccasion("shop-opening", "Make the first day look like an occasion."),
        ],
      },
    ],
  },
  {
    id: "decorations",
    label: "Decorations",
    href: "/decorations",
    featureEyebrow: "The setup",
    columns: [
      {
        heading: "Most booked",
        items: [
          fromCatalog("birthday-decoration"),
          fromCatalog("kids-birthday"),
          fromCatalog("anniversary"),
          fromCatalog("baby-shower"),
        ],
      },
      {
        heading: "By space",
        items: [
          fromCatalog("room-decoration"),
          fromCatalog("premium-decoration"),
          fromCatalog("shop-decoration"),
        ],
      },
      {
        heading: "Ceremonies",
        items: [
          fromCatalog("annaprashan"),
          fromCatalog("bride-to-be"),
          fromCatalog("wedding"),
          fromCatalog("corporate"),
        ],
      },
    ],
  },
  {
    id: "explore",
    label: "Explore",
    href: "/gallery",
    featureEyebrow: "Where to start",
    columns: [
      {
        heading: "Our gallery",
        items: [
          {
            label: "Recent Work",
            href: "/gallery",
            description: "Real setups we have built across Patna.",
            photo: occasionPhoto("birthday"),
            accent: "occ-birthday",
          },
          {
            label: "Birthday Ideas",
            href: "/occasions/birthday",
            description: "Garlands, backdrops and cake tables.",
            photo: occasionPhoto("birthday"),
            accent: "occ-birthday",
          },
          {
            label: "Decoration Inspiration",
            href: "/decorations",
            description: "Browse by the piece rather than the occasion.",
            photo: decorationPhoto("stage-backdrop"),
            accent: "rose",
          },
        ],
      },
      {
        heading: "Get started",
        items: [
          {
            label: "How It Works",
            href: "/how-it-works",
            description: "Three steps, no account, no deposit up front.",
            photo: decorationPhoto("birthday-room-setup"),
            accent: "rose",
          },
          {
            label: "Plan My Celebration",
            href: "/contact",
            description: "Tell us the occasion and we will quote it.",
            photo: occasionPhoto("anniversary"),
            accent: "occ-anniversary",
          },
          {
            label: "Talk to Party Pal",
            action: "partypal",
            description: "Answer a few questions, get a decoration plan.",
            photo: occasionPhoto("kids-party"),
            accent: "occ-kids",
          },
        ],
      },
      {
        heading: "About",
        items: [
          {
            label: "About DecorBalloons",
            href: "/about",
            description: "How we work and where we work.",
            photo: decorationPhoto("anniversary-setup"),
            accent: "rose",
          },
          {
            label: "Contact Us",
            href: "/contact",
            description: "Call, WhatsApp, or send your details.",
            photo: occasionPhoto("proposal"),
            accent: "occ-proposal",
          },
          {
            label: "Questions",
            href: "/faq",
            description: "Pricing, timing, areas covered and safety.",
            photo: occasionPhoto("baby-shower"),
            accent: "occ-baby",
          },
        ],
      },
    ],
  },
];

/** The first item of the first column — shown before anything is hovered. */
export const defaultItem = (menu: MegaMenu): MegaItem => menu.columns[0].items[0];

export const getMegaMenu = (id: string) => megaMenus.find((m) => m.id === id);

/* Sanity: every href must be a route that exists. Occasion and decoration
   links are generated from the data itself, so only the static ones are
   listed here for the check in the test suite. */
export const staticMegaHrefs = [
  "/occasions",
  "/decorations",
  "/gallery",
  "/how-it-works",
  "/contact",
  "/about",
  "/faq",
];

export const allMegaHrefs = () => {
  const out = new Set<string>();
  for (const m of megaMenus) {
    out.add(m.href);
    for (const c of m.columns) for (const i of c.items) if (i.href) out.add(i.href);
  }
  return [...out];
};

/** Occasion/decoration slugs referenced by the menu, for link validation. */
export const referencedSlugs = {
  occasions: occasions.map((o) => o.slug),
  decorations: decorations.map((d) => d.slug),
};
