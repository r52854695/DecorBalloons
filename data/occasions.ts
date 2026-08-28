import type { SceneKey } from "@/components/decor/scenes";
import type { PhotoCategory } from "./photos";

export type Occasion = {
  slug: string;
  name: string;
  /** Short label for compact UI (nav, chips). */
  short: string;
  emoji: string;
  /** Tailwind colour token from the design system, e.g. "occ-birthday". */
  accent: string;
  /** Which SVG decor composition represents this occasion. */
  scene: SceneKey;
  /** Balloon palette for the generated scene — brand colours first. */
  palette: string[];
  /** Editorial one-liner used on cards. */
  tagline: string;
  /** H1 for the occasion page. */
  headline: string;
  /** Opening paragraph — descriptive of the service, never a claim we cannot back. */
  intro: string;
  /** What a setup of this type typically involves. */
  includes: string[];
  /** Style directions customers commonly ask for. */
  styles: string[];
  /** Where these setups usually happen — also a long-tail search axis. */
  venues: string[];
  seo: { title: string; description: string };
  /**
   * Folder of real photographs for this occasion, when the studio has shot
   * one. Left undefined deliberately where it has not: labelling an
   * anniversary photo as a wedding would be a claim about what the picture
   * shows. Those occasions fall back to the illustrated scene.
   */
  photoCategory?: PhotoCategory;
  /**
   * Hand-picked photographs, used when no folder matches this occasion.
   *
   * @verify These are REPRESENTATIVE setups chosen for what the decoration
   * shows — an entrance arch, a petal pathway, a monochrome backdrop — not
   * photographs of this exact occasion, which the studio has not yet shot.
   * Alt text describes the decoration rather than asserting the event. Replace
   * them as soon as real photographs of these occasions exist.
   */
  photos?: string[];
  /** Whether this appears in the homepage occasion grid. */
  featured: boolean;
};

/**
 * The first eight are the homepage grid (per brief section 23).
 * The rest are locally significant occasions in Bihar/Patna that the
 * reference sites rank for — Annaprashan in particular is a major
 * regional ceremony and a genuine local-search opportunity.
 */
export const occasions: Occasion[] = [
  {
    slug: "birthday",
    name: "Birthday",
    short: "Birthday",
    emoji: "🎂",
    accent: "occ-birthday",
    scene: "backdrop",
    palette: ["#E6BCA4", "#C0805F", "#101D30", "#F3EBE2", "#E08A5F"],
    tagline: "From quiet midnight surprises to full-room transformations.",
    headline: "Birthday decorations that people remember",
    intro:
      "Whether it is a first birthday, a milestone sixtieth, or a midnight surprise for someone you love, we build the whole room around the moment — balloon garlands, a backdrop worth photographing, and lighting that makes the cake table glow.",
    includes: [
      "Organic balloon garland in your colours",
      "Backdrop panel or ring with name and age",
      "Cake table styling",
      "Warm fairy or spotlight lighting",
      "Optional themed props and cutouts",
    ],
    styles: ["Pastel", "Rose gold", "Bold and bright", "Monochrome", "Themed for kids"],
    venues: ["Home / living room", "Bedroom surprise", "Terrace", "Banquet hall", "Cafe or restaurant"],
    seo: {
      title: "Birthday Balloon Decoration in Patna",
      description:
        "Birthday balloon decoration at home in Patna — garlands, backdrops, cake table styling and lighting, set up for you. Share your date and we will plan it.",
    },
    photoCategory: "birthday",
    photos: ["/images/decor/birthday/birthday-07.jpg"],
    featured: true,
  },
  {
    slug: "baby-shower",
    name: "Baby Shower",
    short: "Baby Shower",
    emoji: "👶",
    accent: "occ-baby",
    scene: "arch",
    palette: ["#7FA8C4", "#E6BCA4", "#F3EBE2", "#FFFDFB", "#C0805F"],
    tagline: "Soft, warm and gentle — built for photographs.",
    headline: "Baby shower decorations in soft, photographable tones",
    intro:
      "Baby showers are photographed more than almost any other celebration, so we design them to read beautifully on camera — soft palettes, a clean focal backdrop, and a seating corner that looks considered from every angle.",
    includes: [
      "Pastel balloon arch or garland",
      "Mum-to-be seating corner",
      "Welcome signage",
      "Table and dessert styling",
      "Soft drape or ring backdrop",
    ],
    styles: ["Pastel blue", "Blush and ivory", "Sage and cream", "Cloud and rainbow", "Neutral boho"],
    venues: ["Home", "Terrace", "Banquet hall", "Community hall"],
    seo: {
      title: "Baby Shower Decoration in Patna",
      description:
        "Baby shower decoration in Patna with soft pastel balloon arches, a seating corner for the mum-to-be and styling built for photographs.",
    },
    photoCategory: "baby-shower",
    photos: ["/images/decor/baby-shower/baby-shower-09.jpg"],
    featured: true,
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    short: "Anniversary",
    emoji: "💍",
    accent: "occ-anniversary",
    scene: "room",
    palette: ["#B4526B", "#E6BCA4", "#101D30", "#F6E7DC", "#A2624A"],
    tagline: "Candlelight, roses and a room that feels like the two of you.",
    headline: "Anniversary decorations with warmth and restraint",
    intro:
      "An anniversary setup should feel intimate rather than loud. We work with candlelight, deep rose tones and considered balloon work to turn a familiar room into somewhere that feels like an occasion.",
    includes: [
      "Romantic balloon and floral arrangement",
      "Candle pathway or table setting",
      "Personalised backdrop with names or years",
      "Fairy-light canopy",
      "Rose petal detailing",
    ],
    styles: ["Classic red and gold", "Rose gold romance", "White and candlelight", "Deep burgundy"],
    venues: ["Bedroom", "Living room", "Terrace dinner", "Hotel room", "Restaurant table"],
    seo: {
      title: "Anniversary Decoration in Patna",
      description:
        "Anniversary decoration in Patna — candlelight setups, romantic balloon work and personalised backdrops arranged in your home, terrace or hotel room.",
    },
    photoCategory: "anniversary",
    photos: ["/images/decor/anniversary/anniversary-03.jpg"],
    featured: true,
  },
  {
    slug: "proposal",
    name: "Proposal",
    short: "Proposal",
    emoji: "❤️",
    accent: "occ-proposal",
    scene: "column",
    palette: ["#A83A4E", "#C0805F", "#101D30", "#F6E7DC", "#E6BCA4"],
    tagline: "One moment. It needs to be right.",
    headline: "Proposal decorations designed around one moment",
    intro:
      "A proposal setup has exactly one job: to hold a moment that will get retold for years. We plan the reveal, the sightlines and the lighting carefully, and we set up quietly and on schedule so the surprise stays a surprise.",
    includes: [
      "Heart or ring balloon feature",
      "Candle or LED pathway",
      "Marry-me lettering",
      "Petal work and floor styling",
      "Discreet, timed setup",
    ],
    styles: ["Red and white classic", "Rose gold", "All-white minimal", "Terrace under lights"],
    venues: ["Terrace", "Rooftop", "Home", "Hotel room", "Private venue"],
    seo: {
      title: "Proposal Decoration in Patna",
      description:
        "Proposal decoration in Patna — heart balloon features, candle pathways and lettering, set up discreetly and on time for the moment that matters.",
    },
    photos: [
      "/images/decor/surprise-birthday/surprise-birthday-03.jpg",
      "/images/decor/surprise-birthday/surprise-birthday-05.jpg",
      "/images/decor/surprise-birthday/surprise-birthday-10.jpg",
      "/images/decor/anniversary/anniversary-01.jpg",
    ],
    featured: true,
  },
  {
    slug: "wedding",
    name: "Wedding",
    short: "Wedding",
    emoji: "💒",
    accent: "occ-wedding",
    scene: "stage",
    palette: ["#C9A55C", "#FFFDFB", "#E6BCA4", "#F3EBE2", "#C0805F"],
    tagline: "Entrances, stages and photo corners at scale.",
    headline: "Wedding and function decorations",
    intro:
      "For weddings and the functions around them, we handle the pieces guests actually walk through and photograph — the entrance, the stage, the photo corner — at a scale that suits your venue.",
    includes: [
      "Entrance arch and pathway",
      "Stage backdrop and seating",
      "Photo corner / selfie point",
      "Balloon and drape combinations",
      "Coordinated lighting",
    ],
    styles: ["Champagne and ivory", "Floral-heavy", "Gold and white", "Traditional red"],
    venues: ["Banquet hall", "Marriage lawn", "Hotel", "Home function"],
    seo: {
      title: "Wedding and Function Decoration in Patna",
      description:
        "Wedding decoration in Patna — entrance arches, stage backdrops and photo corners with coordinated balloon, drape and lighting work.",
    },
    photos: [
      "/images/decor/surprise-birthday/surprise-birthday-05.jpg",
      "/images/decor/surprise-birthday/surprise-birthday-02.jpg",
      "/images/decor/anniversary/anniversary-05.jpg",
      "/images/decor/anniversary/anniversary-08.jpg",
    ],
    featured: true,
  },
  {
    slug: "kids-party",
    name: "Kids Party",
    short: "Kids",
    emoji: "🎉",
    accent: "occ-kids",
    scene: "garland",
    palette: ["#6BA292", "#E08A5F", "#7FA8C4", "#C9A55C", "#E6BCA4"],
    tagline: "Themes children actually get excited about.",
    headline: "Kids party decorations built around a theme",
    intro:
      "Children notice detail, so we build the whole scene around one clear theme — colour, props, backdrop and cake table all pulling in the same direction, at a height that works for small guests and photographs.",
    includes: [
      "Themed backdrop and props",
      "Colour-matched balloon garland",
      "Cake and treat table styling",
      "Entry arch or welcome board",
      "Play-safe placement",
    ],
    styles: ["Jungle safari", "Unicorn", "Space", "Princess", "Superhero", "Under the sea", "Racing cars"],
    venues: ["Home", "Terrace", "Play area", "Banquet hall", "School"],
    seo: {
      title: "Kids Birthday Theme Decoration in Patna",
      description:
        "Themed kids party decoration in Patna — jungle, unicorn, space, princess and more, with matching backdrops, garlands and cake table styling.",
    },
    photoCategory: "theme-birthday",
    photos: ["/images/decor/baby-boy-theme/baby-boy-theme-01.jpg"],
    featured: true,
  },
  {
    slug: "home-surprise",
    name: "Home Surprise",
    short: "Surprise",
    emoji: "🏠",
    accent: "occ-home",
    scene: "cluster",
    palette: ["#9B7BB0", "#E6BCA4", "#C0805F", "#F3EBE2", "#101D30"],
    tagline: "We set it up while they are out. They walk in. That is the whole idea.",
    headline: "Surprise decorations set up at home",
    intro:
      "The best surprises are logistical. Tell us when the room will be empty and when they will walk back in — we work to that window, keep it quiet, and are gone before the door opens.",
    includes: [
      "Room or doorway transformation",
      "Balloon drop or ceiling work",
      "Personalised lettering",
      "Candle or light pathway",
      "Timed, discreet setup",
    ],
    styles: ["Romantic", "Playful", "Elegant neutral", "Bold colour"],
    venues: ["Living room", "Bedroom", "Doorway", "Terrace"],
    seo: {
      title: "Surprise Home Decoration in Patna",
      description:
        "Surprise decoration at home in Patna — balloon drops, doorway transformations and personalised lettering, set up quietly to your timing.",
    },
    photoCategory: "surprise-birthday",
    photos: ["/images/decor/surprise-birthday/surprise-birthday-03.jpg"],
    featured: true,
  },
  {
    slug: "corporate",
    name: "Corporate Event",
    short: "Corporate",
    emoji: "🏢",
    accent: "occ-corporate",
    scene: "stage",
    palette: ["#4A6484", "#101D30", "#E6BCA4", "#F3EBE2", "#C0805F"],
    tagline: "On-brand, on-schedule, and photograph-ready.",
    headline: "Corporate and office event decoration",
    intro:
      "For office celebrations, launches and annual days, we keep the styling on-brand and the installation on-schedule — including early-morning or after-hours setup so nothing interrupts the working day.",
    includes: [
      "Branded backdrop and stage",
      "Entrance and reception styling",
      "Photo / press wall",
      "Colour matched to brand palette",
      "Out-of-hours installation",
    ],
    styles: ["Brand colours", "Monochrome", "Gold and navy", "Minimal white"],
    venues: ["Office", "Conference hall", "Hotel", "Showroom"],
    seo: {
      title: "Corporate Event Decoration in Patna",
      description:
        "Corporate event decoration in Patna — branded backdrops, stage and reception styling with out-of-hours installation for offices and launches.",
    },
    photos: [
      "/images/decor/surprise-birthday/surprise-birthday-12.jpg",
      "/images/decor/anniversary/anniversary-10.jpg",
      "/images/decor/anniversary/anniversary-02.jpg",
      "/images/decor/anniversary/anniversary-15.jpg",
    ],
    featured: true,
  },

  /* ── Regionally important occasions (strong local search intent) ── */
  {
    slug: "annaprashan",
    name: "Annaprashan",
    short: "Annaprashan",
    emoji: "🍚",
    accent: "occ-wedding",
    scene: "backdrop",
    palette: ["#C9A55C", "#E08A5F", "#6BA292", "#F6E7DC", "#C0805F"],
    tagline: "The rice ceremony, styled for the family photograph.",
    headline: "Annaprashan decoration for the rice ceremony",
    intro:
      "Annaprashan brings the whole family together, and the photographs last a lifetime. We style the seating, the ceremony corner and the backdrop so the baby is the centre of a frame that everyone can crowd into.",
    includes: [
      "Ceremony seating and floor styling",
      "Traditional colour balloon work",
      "Name backdrop for the baby",
      "Thali and table decoration",
      "Family photo corner",
    ],
    styles: ["Traditional gold", "Marigold and ivory", "Pastel modern", "Red and gold"],
    venues: ["Home", "Community hall", "Banquet hall", "Temple hall"],
    seo: {
      title: "Annaprashan Decoration in Patna",
      description:
        "Annaprashan rice ceremony decoration in Patna — ceremony seating, traditional balloon work, name backdrop and a family photo corner.",
    },
    photoCategory: "annaprashan",
    photos: ["/images/decor/annaprashan/annaprashan-04.jpg"],
    featured: false,
  },
  {
    slug: "engagement",
    name: "Engagement",
    short: "Engagement",
    emoji: "💐",
    accent: "occ-anniversary",
    scene: "stage",
    palette: ["#B4526B", "#C9A55C", "#E6BCA4", "#FFFDFB", "#C0805F"],
    tagline: "Ring ceremony staging with a proper focal point.",
    headline: "Engagement and ring ceremony decoration",
    intro:
      "An engagement needs one strong focal point that holds the ring exchange and every photograph that follows. We build that stage, then carry the palette through the entrance and seating.",
    includes: [
      "Stage and backdrop",
      "Ring ceremony table",
      "Entrance styling",
      "Floral and balloon combination",
      "Guest seating accents",
    ],
    styles: ["Rose and gold", "Ivory and floral", "Deep jewel tones", "Minimal white"],
    venues: ["Banquet hall", "Home", "Hotel", "Marriage lawn"],
    seo: {
      title: "Engagement and Ring Ceremony Decoration in Patna",
      description:
        "Engagement decoration in Patna — stage backdrops, ring ceremony tables and entrance styling in floral and balloon combinations.",
    },
    photos: [
      "/images/decor/surprise-birthday/surprise-birthday-02.jpg",
      "/images/decor/anniversary/anniversary-08.jpg",
      "/images/decor/surprise-birthday/surprise-birthday-05.jpg",
      "/images/decor/anniversary/anniversary-11.jpg",
    ],
    featured: false,
  },
  {
    slug: "shop-opening",
    name: "Shop Opening",
    short: "Shop Opening",
    emoji: "🏪",
    accent: "occ-corporate",
    scene: "arch",
    palette: ["#C9A55C", "#A83A4E", "#E08A5F", "#101D30", "#E6BCA4"],
    tagline: "Make the first day look like an occasion from the road.",
    headline: "Shop and showroom opening decoration",
    intro:
      "A new shop gets one opening day. We make the frontage read as an event from across the road — entrance arch, ribbon point and signage styling — and we install early so you can open on time.",
    includes: [
      "Entrance balloon arch",
      "Ribbon-cutting point",
      "Frontage and signage styling",
      "Welcome pathway",
      "Early-morning installation",
    ],
    styles: ["Gold and red traditional", "Brand colours", "Bright and festive"],
    venues: ["Shop frontage", "Showroom", "Office", "Clinic"],
    seo: {
      title: "Shop and Showroom Opening Decoration in Patna",
      description:
        "Shop opening decoration in Patna — entrance balloon arches, ribbon-cutting points and frontage styling, installed early so you open on time.",
    },
    photos: [
      "/images/decor/anniversary/anniversary-17.jpg",
      "/images/decor/annaprashan/annaprashan-12.jpg",
    ],
    featured: false,
  },
];

export const featuredOccasions = occasions.filter((o) => o.featured);
export const getOccasion = (slug: string) => occasions.find((o) => o.slug === slug);
export const occasionSlugs = occasions.map((o) => o.slug);
