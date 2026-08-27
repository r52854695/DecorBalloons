import type { SceneKey } from "@/components/decor/scenes";
import type { PhotoCategory } from "./photos";

export type Decoration = {
  slug: string;
  name: string;
  /** One line for the card. */
  summary: string;
  /** Full description for the detail page. */
  description: string;
  /** Occasion slugs this suits — powers cross-linking and filtering. */
  occasions: string[];
  scene: SceneKey;
  palette: string[];
  includes: string[];
  /** Venue axis — a genuine long-tail search dimension ("terrace", "room"). */
  venues: string[];
  /**
   * @verify PRICING — no verified price list was supplied by the client.
   * `priceFrom` stays null and every card falls back to "Get a quote".
   * Populating this ALSO requires adding Product/Offer JSON-LD in lib/seo —
   * do not publish a price here that the client has not confirmed.
   */
  priceFrom: number | null;
  /** @verify Setup duration unknown — hidden while null. */
  setupTime: string | null;
  featured: boolean;
  /**
   * Folder of real photographs showing this setup, where one exists. Assigned
   * conservatively — only where the photographs genuinely show this kind of
   * work. Everything else keeps its illustrated scene.
   */
  photoCategory?: PhotoCategory;
  /**
   * Hand-picked photographs for setups with no matching folder, chosen for
   * what the decoration itself shows — an arch over an opening, a pair of
   * flanking columns, a lit stage. Alt text describes the piece, not the event.
   */
  photos?: string[];
  seo: { title: string; description: string };
};

export const decorations: Decoration[] = [
  {
    slug: "balloon-garland",
    name: "Organic Balloon Garland",
    summary: "The signature piece — balloons in mixed sizes, clustered into a flowing arc.",
    description:
      "An organic garland is the piece most people picture when they imagine a balloon setup done properly. Balloons of four or five different sizes are clustered by hand so the shape flows rather than repeats, then run across a wall, a doorway or the corner behind a cake table. We colour-match it to whatever palette you are working with.",
    occasions: ["birthday", "baby-shower", "anniversary", "kids-party", "corporate"],
    scene: "garland",
    palette: ["#E6BCA4", "#C0805F", "#F3EBE2", "#101D30", "#D09A7C"],
    includes: [
      "Hand-clustered balloons in mixed sizes",
      "Colour matched to your palette",
      "Wall, corner or doorway mounting",
      "Optional foliage or florals",
      "Full setup and fixing",
    ],
    venues: ["Living room", "Bedroom", "Terrace", "Hall", "Shop frontage"],
    priceFrom: null,
    setupTime: null,
    featured: true,
    photoCategory: "birthday",
    seo: {
      title: "Balloon Garland Decoration in Patna",
      description:
        "Organic balloon garland decoration in Patna — hand-clustered balloons in mixed sizes, colour matched to your palette and fitted at your venue.",
    },
  },
  {
    slug: "balloon-arch",
    name: "Balloon Arch",
    summary: "A full arch over an entrance, stage or doorway — the piece guests walk through.",
    description:
      "An arch frames a threshold: the front door, the stage, the entrance to a hall. Because guests walk under it and photograph it, we build it to be seen from both sides and anchor it properly so it holds through the whole event.",
    occasions: ["baby-shower", "wedding", "shop-opening", "corporate", "kids-party"],
    scene: "arch",
    palette: ["#C0805F", "#E6BCA4", "#FFFDFB", "#F3EBE2", "#C9A55C"],
    includes: [
      "Free-standing or fixed arch",
      "Double-sided finish",
      "Weighted, secured base",
      "Colour and size to suit the opening",
      "Optional signage or lettering",
    ],
    venues: ["Entrance", "Stage", "Doorway", "Shop frontage", "Lawn"],
    priceFrom: null,
    setupTime: null,
    featured: true,
    photos: [
      "/images/decor/birthday/birthday-10.jpg",
      "/images/decor/baby-shower/baby-shower-05.jpg",
      "/images/decor/welcome-baby/welcome-baby-03.jpg",
      "/images/decor/adult/adult-03.jpg",
      "/images/decor/anniversary/anniversary-19.jpg",
    ],
    seo: {
      title: "Balloon Arch Decoration in Patna",
      description:
        "Balloon arch decoration in Patna for entrances, stages and shop openings — double-sided, properly anchored and built to the size of your opening.",
    },
  },
  {
    slug: "birthday-room-setup",
    name: "Birthday Room Setup",
    summary: "The whole room done — walls, ceiling, cake table and lighting together.",
    description:
      "Rather than a single feature wall, a room setup treats the space as one composition: balloon work on the wall, something happening overhead, a styled cake table and lighting warm enough to photograph well after dark. This is the setup most people want for a surprise at home.",
    occasions: ["birthday", "home-surprise", "kids-party"],
    scene: "room",
    palette: ["#E6BCA4", "#C0805F", "#F6E7DC", "#101D30", "#E08A5F"],
    includes: [
      "Feature wall balloon work",
      "Ceiling balloons or canopy",
      "Cake and gift table styling",
      "Name or age lettering",
      "Warm fairy lighting",
    ],
    venues: ["Living room", "Bedroom", "Hotel room", "Terrace"],
    priceFrom: null,
    setupTime: null,
    featured: true,
    photoCategory: "surprise-birthday",
    seo: {
      title: "Birthday Room Decoration at Home in Patna",
      description:
        "Birthday room decoration at home in Patna — wall and ceiling balloon work, styled cake table, lettering and warm lighting, set up for you.",
    },
  },
  {
    slug: "anniversary-setup",
    name: "Anniversary Setup",
    summary: "Candlelight, deep rose tones and a room that reads as intimate rather than loud.",
    description:
      "Built for two people rather than a crowd. A candle pathway, a restrained balloon and floral arrangement, and personalised lettering with names or the number of years — arranged so the room feels warm the moment the lights go down.",
    occasions: ["anniversary", "home-surprise"],
    scene: "room",
    palette: ["#B4526B", "#E6BCA4", "#A2624A", "#F6E7DC", "#101D30"],
    includes: [
      "Candle or LED pathway",
      "Balloon and rose arrangement",
      "Names or years lettering",
      "Table setting for two",
      "Petal detailing",
    ],
    venues: ["Bedroom", "Living room", "Terrace", "Hotel room"],
    priceFrom: null,
    setupTime: null,
    featured: true,
    photoCategory: "anniversary",
    seo: {
      title: "Anniversary Decoration Setup in Patna",
      description:
        "Anniversary decoration in Patna — candle pathways, rose and balloon arrangements and personalised lettering for an intimate setup at home.",
    },
  },
  {
    slug: "baby-shower-setup",
    name: "Baby Shower Setup",
    summary: "A soft pastel scheme with a seating corner built for the mum-to-be.",
    description:
      "The centre of a baby shower is wherever the mum-to-be sits, so that is where we start: a comfortable, framed corner with a balloon arch or garland behind it, then dessert and welcome styling in the same soft palette.",
    occasions: ["baby-shower"],
    scene: "arch",
    palette: ["#7FA8C4", "#E6BCA4", "#F3EBE2", "#FFFDFB", "#D09A7C"],
    includes: [
      "Pastel arch or garland",
      "Mum-to-be seating corner",
      "Welcome sign",
      "Dessert table styling",
      "Drape or ring backdrop",
    ],
    venues: ["Home", "Terrace", "Banquet hall"],
    priceFrom: null,
    setupTime: null,
    featured: true,
    photoCategory: "baby-shower",
    seo: {
      title: "Baby Shower Decoration Setup in Patna",
      description:
        "Baby shower decoration in Patna — pastel balloon arches, a framed seating corner for the mum-to-be, welcome signage and dessert table styling.",
    },
  },
  {
    slug: "proposal-decoration",
    name: "Proposal Decoration",
    summary: "A heart feature, a lit pathway, and a setup timed so the surprise holds.",
    description:
      "Every proposal setup is planned backwards from the moment itself — where they will be standing, what they will see first, and how the light falls. We set up on a schedule you give us and leave before you arrive.",
    occasions: ["proposal"],
    scene: "column",
    palette: ["#A83A4E", "#C0805F", "#F6E7DC", "#101D30", "#E6BCA4"],
    includes: [
      "Heart or ring balloon feature",
      "Candle or LED pathway",
      "Marry-me lettering",
      "Petal floor work",
      "Timed, discreet installation",
    ],
    venues: ["Terrace", "Rooftop", "Hotel room", "Private venue"],
    priceFrom: null,
    setupTime: null,
    featured: true,
    photos: [
      "/images/decor/surprise-birthday/surprise-birthday-03.jpg",
      "/images/decor/surprise-birthday/surprise-birthday-05.jpg",
      "/images/decor/surprise-birthday/surprise-birthday-10.jpg",
      "/images/decor/anniversary/anniversary-01.jpg",
      "/images/decor/surprise-birthday/surprise-birthday-02.jpg",
    ],
    seo: {
      title: "Proposal Decoration in Patna",
      description:
        "Proposal decoration in Patna — heart balloon features, candle pathways and lettering, planned around the reveal and set up discreetly on time.",
    },
  },
  {
    slug: "kids-theme-decoration",
    name: "Kids Theme Decoration",
    summary: "One theme, carried through backdrop, props, garland and cake table.",
    description:
      "Pick a theme and we carry it the whole way through — jungle, unicorn, space, princess, under the sea or racing cars. Props and backdrop are set at child height, and balloon work is placed clear of where children will actually run.",
    occasions: ["kids-party", "birthday"],
    scene: "garland",
    palette: ["#6BA292", "#E08A5F", "#7FA8C4", "#C9A55C", "#E6BCA4"],
    includes: [
      "Themed backdrop and props",
      "Matching balloon garland",
      "Cake and treat table",
      "Welcome board",
      "Child-height, play-safe placement",
    ],
    venues: ["Home", "Terrace", "Play area", "Banquet hall"],
    priceFrom: null,
    setupTime: null,
    featured: true,
    photoCategory: "theme-birthday",
    seo: {
      title: "Kids Theme Birthday Decoration in Patna",
      description:
        "Themed kids decoration in Patna — jungle, unicorn, space, princess and more, carried through backdrop, props, garland and cake table.",
    },
  },
  {
    slug: "welcome-baby-decoration",
    name: "Welcome Baby Decoration",
    summary: "For the day the baby comes home — doorway, room and a name feature.",
    description:
      "A smaller, gentler setup for the homecoming rather than the shower. We dress the doorway the family walks through, add a soft feature in the room, and put the baby name up so the first photograph at home already has a frame.",
    occasions: ["baby-shower", "home-surprise", "annaprashan"],
    scene: "cluster",
    palette: ["#7FA8C4", "#F3EBE2", "#E6BCA4", "#FFFDFB", "#C0805F"],
    includes: [
      "Doorway balloon styling",
      "Room feature wall",
      "Baby name lettering",
      "Soft pastel palette",
      "Quick, quiet setup",
    ],
    venues: ["Doorway", "Living room", "Bedroom"],
    priceFrom: null,
    setupTime: null,
    featured: true,
    photoCategory: "welcome-baby",
    seo: {
      title: "Welcome Baby Home Decoration in Patna",
      description:
        "Welcome baby decoration in Patna — doorway styling, a soft room feature and baby name lettering for the day the baby comes home.",
    },
  },
  {
    slug: "balloon-column",
    name: "Balloon Columns",
    summary: "Vertical pieces that flank an entrance, stage or aisle.",
    description:
      "Columns do the work an arch cannot when the opening is too wide or the ceiling is too high. Used in pairs, they mark an entrance or frame a stage, and they travel well between indoor and outdoor venues.",
    occasions: ["wedding", "corporate", "shop-opening", "engagement"],
    scene: "column",
    palette: ["#C9A55C", "#FFFDFB", "#C0805F", "#E6BCA4", "#101D30"],
    includes: [
      "Matched pair of columns",
      "Weighted bases",
      "Topper feature",
      "Indoor or outdoor build",
      "Colour matched to the event",
    ],
    venues: ["Entrance", "Stage", "Aisle", "Shop frontage"],
    priceFrom: null,
    setupTime: null,
    featured: false,
    photos: [
      "/images/decor/birthday/birthday-11.jpg",
      "/images/decor/anniversary/anniversary-14.jpg",
      "/images/decor/birthday/birthday-03.jpg",
      "/images/decor/theme-birthday/theme-birthday-01.jpg",
      "/images/decor/baby-boy-theme/baby-boy-theme-06.jpg",
    ],
    seo: {
      title: "Balloon Column Decoration in Patna",
      description:
        "Balloon columns in Patna for entrances, stages and aisles — matched pairs on weighted bases, built for indoor or outdoor venues.",
    },
  },
  {
    slug: "stage-backdrop",
    name: "Stage & Backdrop",
    summary: "The focal wall — drape, balloon work and lettering as one composition.",
    description:
      "For engagements, weddings, annual days and launches, the stage is what every photograph has in the background. We build it as a single composition — drape, balloon detail and lettering — sized to the room rather than to a standard panel.",
    occasions: ["wedding", "engagement", "corporate", "annaprashan"],
    scene: "stage",
    palette: ["#C9A55C", "#B4526B", "#FFFDFB", "#E6BCA4", "#101D30"],
    includes: [
      "Drape or panel backdrop",
      "Balloon detailing",
      "Name or event lettering",
      "Stage floor styling",
      "Sized to your venue",
    ],
    venues: ["Banquet hall", "Conference hall", "Marriage lawn", "Hotel"],
    priceFrom: null,
    setupTime: null,
    featured: false,
    photos: [
      "/images/decor/theme-birthday/theme-birthday-05.jpg",
      "/images/decor/theme-birthday/theme-birthday-06.jpg",
      "/images/decor/theme-birthday/theme-birthday-04.jpg",
      "/images/decor/theme-birthday/theme-birthday-07.jpg",
      "/images/decor/annaprashan/annaprashan-12.jpg",
    ],
    seo: {
      title: "Stage Backdrop Decoration in Patna",
      description:
        "Stage and backdrop decoration in Patna — drape, balloon detailing and lettering built as one composition and sized to your venue.",
    },
  },
];

export const featuredDecorations = decorations.filter((d) => d.featured);
export const getDecoration = (slug: string) => decorations.find((d) => d.slug === slug);
export const decorationSlugs = decorations.map((d) => d.slug);
export const decorationsForOccasion = (occasionSlug: string) =>
  decorations.filter((d) => d.occasions.includes(occasionSlug));
