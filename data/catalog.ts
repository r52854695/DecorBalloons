/**
 * The bookable catalogue: categories → priced setups.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * @verify EVERY PRICE, MRP AND BADGE IN THIS FILE IS PLACEHOLDER DATA.
 *
 * The client asked for realistic figures so the layout could be built before
 * the real rate card exists. They are benchmarked against comparable Patna /
 * Bihar decoration services, but DecorBalloons has not confirmed a single one,
 * and "Best Seller" / "Most Loved" / "Trending" are not measured — they are
 * placeholders for whatever the client's real merchandising is.
 *
 * Customers hold a business to a published price. Replace this file's numbers
 * and badges before any real marketing spend points at the site. Everything
 * else (layout, cards, filters) reads from here, so it is a one-file swap.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Photography: the studio's own photographs wherever they exist, because they
 * show exactly these setups. Pexels stock only fills genuine gaps — haldi,
 * mehndi, mandap, ribbon-cutting and event staging — and every one of those was
 * looked at before being used.
 *
 * An earlier pass sourced everything from Pexels by keyword and assigned it by
 * index without checking. That put hot-air balloons on "Balloon Arch", parked
 * cars on "Car Decoration" and a desert rock arch in the catalogue. Do not add
 * an image here without opening it.
 *
 * No photograph with a customer's name visible on the backdrop is used on a
 * product card. Names belong to those families, not to a price list, and a
 * card selling "First Birthday Setup" should not carry another child's name.
 * The gallery still shows the work as shot. Two kids themes — Unicorn and
 * Space — were retired because every photograph of them carried a name;
 * Football and Aeroplane replaced them, and both have clean work.
 *
 * Car Decoration and Balloon Bouquets were removed for the same reason: no
 * usable photography exists for them yet, in the studio's library or on Pexels.
 * A category illustrated by the wrong thing is worse than one that is absent.
 */

/**
 * Whether the prices in this file are the client's real, confirmed rates.
 *
 * Gates the `offers` block in Product structured data specifically. Showing an
 * estimated price on the page is one thing; feeding it to Google as machine-
 * readable data is another — it can surface in search results and shopping
 * surfaces as an authoritative quote from the business. Flip to true only once
 * a real rate card has replaced the placeholders above.
 */
export const PRICES_VERIFIED = false;

export type Badge = "Best Seller" | "Most Loved" | "Trending" | "New";

export type Product = {
  slug: string;
  name: string;
  /** @verify placeholder */
  price: number;
  /** @verify placeholder — strike-through "was" price */
  mrp: number;
  /** Setup time quoted to the customer, e.g. "2 hr". */
  duration: string;
  /** @verify placeholder merchandising label */
  badge?: Badge;
  image: string;
  /** Theme chip this belongs to, for the in-row filter. */
  theme?: string;
  /**
   * Star rating and review count, as the reference sites show on every card.
   *
   * Deliberately left unset everywhere. Prices could be estimated because the
   * client asked for realistic figures; a rating cannot — "4.9 · 313 reviews"
   * is a claim about people who do not exist, it is what review-fraud rules
   * actually target, and marking it up as AggregateRating risks a manual
   * penalty. The card renders the slot the moment real numbers land here.
   */
  rating?: { score: number; count: number };
};

export type Category = {
  slug: string;
  name: string;
  /** Short line under the heading. */
  blurb: string;
  /** Theme filter chips shown above the row. "All" is added automatically. */
  themes?: string[];
  /**
   * Matching entry in `data/occasions.ts`, by name — the enquiry form's
   * occasion <select> uses those names as its option values, so anything else
   * (a catalogue category name, say) selects nothing and silently renders an
   * empty field. Left undefined where no occasion genuinely corresponds.
   */
  occasionName?: string;
  products: Product[];
};

const p = (
  slug: string,
  name: string,
  price: number,
  mrp: number,
  duration: string,
  image: string,
  badge?: Badge,
  theme?: string,
): Product => ({ slug, name, price, mrp, duration, image, badge, theme });

export const categories: Category[] = [
  {
    slug: "birthday-decoration",
    name: "Birthday Decoration",
    blurb: "Room, hall or terrace — set up before the guests arrive.",
    themes: ["Simple", "Premium", "Canopy", "Stage"],
    occasionName: "Birthday",
    products: [
      p("classic-birthday-room", "Classic Birthday Room Decoration", 1999, 2599, "1.5 hr", "/images/decor/birthday/birthday-07.jpg", "Best Seller", "Simple"),
      p("home-birthday-setup", "Home Birthday Decoration", 3199, 4299, "2.5 hr", "/images/decor/birthday/birthday-09.jpg", "Most Loved", "Premium"),
      p("adult-birthday-setup", "Adult Birthday Decoration", 2500, 3500, "2 hr", "/images/decor/adult/adult-12.jpg", "Best Seller", "Simple"),
      p("canopy-birthday", "Canopy Birthday Decoration", 3899, 4999, "2.5 hr", "/images/decor/surprise-birthday/surprise-birthday-02.jpg", "Trending", "Canopy"),
      p("stage-birthday", "Birthday Stage Decoration", 5499, 6999, "3 hr", "/images/decor/annaprashan/annaprashan-12.jpg", undefined, "Stage"),
      p("terrace-birthday", "Terrace Birthday Setup", 4299, 5499, "2.5 hr", "/images/decor/adult/adult-08.jpg", undefined, "Premium"),
      p("surprise-birthday", "Surprise Birthday Setup", 1499, 1999, "1.5 hr", "/images/decor/surprise-birthday/surprise-birthday-01.jpg", "Best Seller", "Simple"),
      p("golden-birthday", "Golden Birthday Decoration", 2899, 3999, "2 hr", "/images/decor/surprise-birthday/surprise-birthday-04.jpg", "Trending", "Premium"),
    ],
  },
  {
    slug: "premium-decoration",
    name: "Premium Decoration",
    blurb: "Bigger builds, fresh flowers and lighting.",
    products: [
      p("premium-gold-ring", "Premium Gold Ring Setup", 5499, 6999, "3 hr", "/images/decor/anniversary/anniversary-05.jpg", "Best Seller"),
      p("luxe-floral-stage", "Luxe Floral Stage", 6999, 8499, "3.5 hr", "/images/decor/anniversary/anniversary-24.jpg", "Most Loved"),
      p("pastel-cloud-setup", "Pastel Cloud Setup", 5999, 7299, "3 hr", "/images/decor/baby-shower/baby-shower-08.jpg"),
      p("neon-name-backdrop", "Neon Name Backdrop", 6499, 7999, "3 hr", "/images/decor/surprise-birthday/surprise-birthday-11.jpg", "Trending"),
      p("champagne-anniversary", "Champagne Anniversary Setup", 5999, 6999, "2.5 hr", "/images/decor/anniversary/anniversary-02.jpg"),
      p("grand-hall-setup", "Grand Hall Setup", 10499, 12999, "4 hr", "/images/decor/birthday/birthday-10.jpg", "Trending"),
    ],
  },
  {
    slug: "kids-birthday",
    name: "Kids Birthday",
    blurb: "One theme, carried through every element.",
    themes: ["Football", "Aeroplane", "Jungle", "Princess", "Cartoon", "Krishna"],
    occasionName: "Kids Party",
    products: [
      p("unicorn-theme", "Football Theme Decoration", 2799, 3799, "2 hr", "/images/decor/baby-boy-theme/baby-boy-theme-01.jpg", "Best Seller", "Football"),
      p("jungle-theme", "Jungle Theme Decoration", 2999, 3999, "2 hr", "/images/decor/baby-boy-theme/baby-boy-theme-03.jpg", "Most Loved", "Jungle"),
      p("superhero-theme", "Aeroplane Theme Decoration", 3199, 4299, "2 hr", "/images/decor/baby-boy-theme/baby-boy-theme-06.jpg", "Trending", "Aeroplane"),
      p("princess-theme", "Princess Theme Decoration", 3099, 4199, "2 hr", "/images/decor/theme-birthday/theme-birthday-07.jpg", "Best Seller", "Princess"),
      p("cartoon-theme", "Cartoon Theme Decoration", 2200, 3300, "2 hr", "/images/decor/baby-boy/baby-boy-01.jpg", "Most Loved", "Cartoon"),
      p("krishna-theme", "Krishna Theme Decoration", 3499, 4499, "2.5 hr", "/images/decor/annaprashan/annaprashan-05.jpg", undefined, "Krishna"),
      p("first-birthday", "First Birthday Setup", 3799, 4899, "2.5 hr", "/images/decor/baby-boy/baby-boy-05.jpg", "Best Seller", "Cartoon"),
      p("balloon-play-corner", "Balloon Play Corner", 2100, 3000, "1.5 hr", "/images/decor/baby-boy/baby-boy-04.jpg", undefined, "Jungle"),
    ],
  },
  {
    slug: "annaprashan",
    name: "Annaprashan",
    blurb: "The rice ceremony, styled for the whole family.",
    occasionName: "Annaprashan",
    products: [
      p("annaprashan-home", "Annaprashan Home Setup", 3799, 4899, "2.5 hr", "/images/decor/annaprashan/annaprashan-04.jpg", "Best Seller"),
      p("annaprashan-classic", "Annaprashan Decoration", 3499, 5499, "2 hr", "/images/decor/annaprashan/annaprashan-03.jpg", "Most Loved"),
      p("annaprashan-krishna", "Krishna Theme Annaprashan", 3799, 4799, "2.5 hr", "/images/decor/annaprashan/annaprashan-05.jpg", "Trending"),
      p("annaprashan-premium", "Premium Annaprashan Setup", 5499, 6499, "3 hr", "/images/decor/annaprashan/annaprashan-09.jpg"),
      p("annaprashan-floral", "Floral Annaprashan Setup", 4299, 5299, "2.5 hr", "/images/decor/annaprashan/annaprashan-10.jpg"),
      p("mundan-setup", "Naming Ceremony Setup", 3299, 4299, "2 hr", "/images/decor/welcome-baby/welcome-baby-02.jpg"),
    ],
  },
  {
    slug: "room-decoration",
    name: "Room Decoration",
    blurb: "Done inside the house, cleaned up after.",
    themes: ["Romantic", "Birthday", "Surprise"],
    occasionName: "Home Surprise",
    products: [
      p("romantic-room", "Romantic Room Setup", 2699, 3199, "2 hr", "/images/decor/surprise-birthday/surprise-birthday-03.jpg", "Best Seller", "Romantic"),
      p("candlelight-room", "Candlelight Dinner Setup", 3499, 4299, "2.5 hr", "/images/decor/surprise-birthday/surprise-birthday-05.jpg", "Most Loved", "Romantic"),
      p("birthday-room", "Birthday Room Decoration", 2199, 3199, "2 hr", "/images/decor/birthday/birthday-02.jpg", "Trending", "Birthday"),
      p("surprise-girlfriend", "Surprise Setup for Her", 2299, 2999, "2 hr", "/images/decor/surprise-birthday/surprise-birthday-10.jpg", "Most Loved", "Surprise"),
      p("heart-room", "Heart Balloon Room", 1999, 2399, "1.5 hr", "/images/decor/anniversary/anniversary-01.jpg", undefined, "Romantic"),
      p("hotel-room-setup", "Hotel Room Decoration", 3199, 3999, "2 hr", "/images/decor/surprise-birthday/surprise-birthday-08.jpg", undefined, "Surprise"),
    ],
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    blurb: "For the evening, not the afternoon.",
    occasionName: "Anniversary",
    products: [
      p("anniversary-classic", "Anniversary Decoration", 2999, 3499, "2.5 hr", "/images/decor/anniversary/anniversary-03.jpg", "Best Seller"),
      p("anniversary-premium", "Premium Anniversary Setup", 4399, 5499, "3 hr", "/images/decor/anniversary/anniversary-09.jpg", "Most Loved"),
      p("engagement-setup", "Engagement Decoration", 4399, 5299, "3 hr", "/images/decor/anniversary/anniversary-08.jpg", "Trending"),
      p("rose-anniversary", "Rose Petal Anniversary", 2599, 3199, "2 hr", "/images/decor/anniversary/anniversary-13.jpg"),
      p("silver-jubilee", "25th Anniversary Setup", 5999, 6999, "3 hr", "/images/decor/anniversary/anniversary-11.jpg"),
      p("terrace-anniversary", "Terrace Anniversary Setup", 4899, 5899, "3 hr", "/images/decor/anniversary/anniversary-07.jpg"),
    ],
  },
  {
    slug: "baby-shower",
    name: "Baby Shower",
    blurb: "Soft, warm and built to photograph well.",
    occasionName: "Baby Shower",
    products: [
      p("baby-shower-home", "Baby Shower at Home", 3199, 3999, "2.5 hr", "/images/decor/baby-shower/baby-shower-09.jpg", "Most Loved"),
      p("baby-shower-classic", "Baby Shower Decoration", 2299, 2999, "2.5 hr", "/images/decor/baby-shower/baby-shower-10.jpg", "Best Seller"),
      p("baby-shower-premium", "Premium Baby Shower", 5499, 6799, "3 hr", "/images/decor/baby-shower/baby-shower-08.jpg", "Trending"),
      p("godbharai-setup", "Godbharai Setup", 2799, 3299, "2.5 hr", "/images/decor/baby-shower/baby-shower-06.jpg"),
      p("welcome-baby-home", "Welcome Baby Home Setup", 2599, 3699, "2 hr", "/images/decor/welcome-baby/welcome-baby-07.jpg", "Best Seller"),
      p("gender-reveal", "Gender Reveal Setup", 3499, 4299, "2.5 hr", "/images/decor/baby-shower/baby-shower-04.jpg"),
    ],
  },
  {
    slug: "bride-to-be",
    name: "Bride To Be",
    blurb: "Haldi, mehndi and the night before.",
    occasionName: "Wedding",
    products: [
      p("bride-to-be-classic", "Bride To Be Decoration", 2499, 3299, "2 hr", "/images/catalog/bride/bride-jewellery.jpg", "Best Seller"),
      p("haldi-setup", "Haldi Ceremony Setup", 2899, 3799, "2 hr", "/images/catalog/bride/haldi.jpg", "Trending"),
      p("mehndi-setup", "Mehndi Decoration", 2999, 3899, "2 hr", "/images/catalog/bride/mehndi-design.jpg", "Best Seller"),
      p("bachelorette-setup", "Bachelorette Setup", 2299, 2999, "2 hr", "/images/catalog/bride/mehndi-hands.jpg", "Trending"),
      p("bride-premium", "Premium Bride To Be", 3499, 4299, "2.5 hr", "/images/catalog/bride/bride-mirror.jpg", "Best Seller"),
      p("groom-to-be", "Groom To Be Setup", 2399, 3099, "2 hr", "/images/catalog/bride/couple.jpg"),
    ],
  },
  {
    slug: "shop-decoration",
    name: "Shop Decoration",
    blurb: "Openings, showrooms and office floors.",
    themes: ["Shop Opening", "Showroom", "Office"],
    occasionName: "Shop Opening",
    products: [
      p("shop-opening", "Shop Opening Decoration", 6499, 8599, "3 hr", "/images/catalog/shop/ribbon-arch.jpg", "Trending", "Shop Opening"),
      p("shop-entrance", "Entrance Balloon Arch", 1999, 2499, "1.5 hr", "/images/decor/anniversary/anniversary-17.jpg", "Best Seller", "Shop Opening"),
      p("showroom-setup", "Showroom Decoration", 5499, 6499, "3 hr", "/images/decor/anniversary/anniversary-14.jpg", undefined, "Showroom"),
      p("office-setup", "Office Decoration", 2939, 3199, "2 hr", "/images/decor/surprise-birthday/surprise-birthday-12.jpg", undefined, "Office"),
      p("ribbon-ceremony", "Ribbon Cutting Setup", 2499, 3199, "1.5 hr", "/images/catalog/shop/ribbon-arch.jpg", "Most Loved", "Shop Opening"),
      p("festive-shop", "Festive Shop Decoration", 3499, 4299, "2 hr", "/images/decor/adult/adult-06.jpg", undefined, "Showroom"),
    ],
  },
  {
    slug: "corporate",
    name: "Corporate Events",
    blurb: "On-brand, on-schedule, out before Monday.",
    occasionName: "Corporate Event",
    products: [
      p("corporate-stage", "Corporate Stage Setup", 8499, 10499, "3.5 hr", "/images/catalog/corporate/stage.jpg", "Trending"),
      p("office-party", "Office Party Decoration", 4499, 5499, "2.5 hr", "/images/decor/surprise-birthday/surprise-birthday-12.jpg", "Best Seller"),
      p("conference-setup", "Conference Backdrop", 6499, 7999, "3 hr", "/images/catalog/corporate/truss.jpg"),
      p("product-launch", "Product Launch Setup", 9499, 11499, "4 hr", "/images/catalog/corporate/concert.jpg", "Trending"),
      p("annual-day", "Annual Day Decoration", 7499, 8999, "3.5 hr", "/images/catalog/corporate/mic.jpg"),
      p("farewell-setup", "Farewell Decoration", 3499, 4299, "2 hr", "/images/decor/anniversary/anniversary-10.jpg", "Most Loved"),
    ],
  },
  {
    slug: "wedding",
    name: "Wedding",
    blurb: "Entrances, stages and photo corners.",
    occasionName: "Wedding",
    products: [
      p("wedding-stage", "Wedding Stage Decoration", 12999, 15999, "5 hr", "/images/catalog/wedding/mandap.jpg", "Trending"),
      p("reception-setup", "Reception Decoration", 10499, 12999, "4 hr", "/images/catalog/wedding/hall.jpg", "Best Seller"),
      p("wedding-entrance", "Wedding Entrance Arch", 5999, 7499, "3 hr", "/images/decor/anniversary/anniversary-26.jpg", "Most Loved"),
      p("sangeet-setup", "Sangeet Night Setup", 8499, 10499, "3.5 hr", "/images/decor/annaprashan/annaprashan-08.jpg"),
      p("photo-corner", "Wedding Photo Corner", 4499, 5499, "2.5 hr", "/images/decor/adult/adult-04.jpg", "Best Seller"),
      p("varmala-stage", "Varmala Stage Setup", 9499, 11499, "4 hr", "/images/catalog/wedding/varmala.jpg"),
    ],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const allProducts = categories.flatMap((c) =>
  c.products.map((pr) => ({ ...pr, category: c.slug, categoryName: c.name, occasionName: c.occasionName })),
);

export const discountPct = (price: number, mrp: number) =>
  Math.round(((mrp - price) / mrp) * 100);

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;


/**
 * Collection bands — a heading, a line, and a row of image tiles.
 *
 * Both side references (BalloonDekor, Funtook) run this pattern between the
 * product rows, and it does something the rows cannot: it lets someone shop by
 * theme or by stage of an event rather than by category. Each tile deep-links
 * into a category with its theme filter already applied.
 *
 * Theme names are kept generic on purpose. The reference sites list Cocomelon,
 * Frozen and Boss Baby; those are other companies' trademarks, and a small
 * studio advertising them by name is the one who carries that risk.
 */
export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  tiles: { label: string; href: string; image: string }[];
};

export const collections: Collection[] = [
  {
    slug: "kids-themes",
    title: "Kids Birthday Themes",
    subtitle: "One theme, carried through every element.",
    tiles: [
      { label: "Football", href: "/catalog/kids-birthday?theme=Football", image: "/images/decor/baby-boy-theme/baby-boy-theme-01.jpg" },
      { label: "Jungle", href: "/catalog/kids-birthday?theme=Jungle", image: "/images/decor/baby-boy-theme/baby-boy-theme-03.jpg" },
      { label: "Aeroplane", href: "/catalog/kids-birthday?theme=Aeroplane", image: "/images/decor/baby-boy-theme/baby-boy-theme-06.jpg" },
      { label: "Princess", href: "/catalog/kids-birthday?theme=Princess", image: "/images/decor/theme-birthday/theme-birthday-07.jpg" },
      { label: "Cartoon", href: "/catalog/kids-birthday?theme=Cartoon", image: "/images/decor/baby-boy/baby-boy-01.jpg" },
      { label: "Krishna", href: "/catalog/kids-birthday?theme=Krishna", image: "/images/decor/annaprashan/annaprashan-05.jpg" },
    ],
  },
  {
    slug: "wedding-collection",
    title: "The Wedding Collection",
    subtitle: "From haldi to the varmala stage.",
    tiles: [
      { label: "Haldi", href: "/catalog/bride-to-be", image: "/images/catalog/bride/haldi.jpg" },
      { label: "Mehndi", href: "/catalog/bride-to-be", image: "/images/catalog/bride/mehndi-design.jpg" },
      { label: "Bride To Be", href: "/catalog/bride-to-be", image: "/images/catalog/bride/bride-jewellery.jpg" },
      { label: "Mandap", href: "/catalog/wedding", image: "/images/catalog/wedding/mandap.jpg" },
      { label: "Reception", href: "/catalog/wedding", image: "/images/catalog/wedding/hall.jpg" },
      { label: "Varmala Stage", href: "/catalog/wedding", image: "/images/catalog/wedding/varmala.jpg" },
    ],
  },
];


/**
 * Every theme name used by any category, for the filter stylesheet.
 *
 * The shelf filter is done in CSS rather than by re-rendering React, so the
 * product cards can stay server-rendered and never hydrate. That needs one
 * rule per theme, and the rules are generated from this list so adding a theme
 * to a category cannot silently leave its chip doing nothing.
 */
export const distinctThemes = [
  ...new Set(categories.flatMap((c) => c.themes ?? [])),
].sort();
