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
 * Photography is Pexels stock, licensed for commercial use. It is illustrative
 * of the setup type, not a photograph of a DecorBalloons job — the real work
 * lives on /gallery.
 */

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
      p("classic-birthday-room", "Classic Birthday Room Decoration", 1999, 2599, "1.5 hr", "/images/catalog/birthday/birthday-01.jpg", "Best Seller", "Simple"),
      p("home-birthday-setup", "Home Birthday Decoration", 3199, 4299, "2.5 hr", "/images/catalog/birthday/birthday-02.jpg", "Most Loved", "Premium"),
      p("adult-birthday-setup", "Adult Birthday Decoration", 2500, 3500, "2 hr", "/images/catalog/birthday/birthday-03.jpg", "Best Seller", "Simple"),
      p("canopy-birthday", "Canopy Birthday Decoration", 3899, 4999, "2.5 hr", "/images/catalog/birthday/birthday-04.jpg", "Trending", "Canopy"),
      p("stage-birthday", "Birthday Stage Decoration", 5499, 6999, "3 hr", "/images/catalog/birthday/birthday-05.jpg", undefined, "Stage"),
      p("terrace-birthday", "Terrace Birthday Setup", 4299, 5499, "2.5 hr", "/images/catalog/birthday/birthday-06.jpg", undefined, "Premium"),
      p("surprise-birthday", "Surprise Birthday Setup", 1499, 1999, "1.5 hr", "/images/catalog/birthday/birthday-07.jpg", "Best Seller", "Simple"),
      p("golden-birthday", "Golden Birthday Decoration", 2899, 3999, "2 hr", "/images/catalog/birthday/birthday-08.jpg", "Trending", "Premium"),
    ],
  },
  {
    slug: "premium-decoration",
    name: "Premium Decoration",
    blurb: "Bigger builds, fresh flowers and lighting.",
    products: [
      p("premium-gold-ring", "Premium Gold Ring Setup", 5499, 6999, "3 hr", "/images/catalog/premium/premium-01.jpg", "Best Seller"),
      p("luxe-floral-stage", "Luxe Floral Stage", 6999, 8499, "3.5 hr", "/images/catalog/premium/premium-02.jpg", "Most Loved"),
      p("pastel-cloud-setup", "Pastel Cloud Setup", 5999, 7299, "3 hr", "/images/catalog/premium/premium-03.jpg"),
      p("neon-name-backdrop", "Neon Name Backdrop", 6499, 7999, "3 hr", "/images/catalog/premium/premium-04.jpg", "Trending"),
      p("champagne-anniversary", "Champagne Anniversary Setup", 5999, 6999, "2.5 hr", "/images/catalog/premium/premium-05.jpg"),
      p("grand-hall-setup", "Grand Hall Setup", 10499, 12999, "4 hr", "/images/catalog/premium/premium-06.jpg", "Trending"),
    ],
  },
  {
    slug: "kids-birthday",
    name: "Kids Birthday",
    blurb: "One theme, carried through every element.",
    themes: ["Unicorn", "Jungle", "Superhero", "Princess", "Cartoon", "Krishna"],
    occasionName: "Kids Party",
    products: [
      p("unicorn-theme", "Unicorn Theme Decoration", 2799, 3799, "2 hr", "/images/catalog/kids/kids-01.jpg", "Best Seller", "Unicorn"),
      p("jungle-theme", "Jungle Theme Decoration", 2999, 3999, "2 hr", "/images/catalog/kids/kids-02.jpg", "Most Loved", "Jungle"),
      p("superhero-theme", "Superhero Theme Decoration", 3199, 4299, "2 hr", "/images/catalog/kids/kids-03.jpg", "Trending", "Superhero"),
      p("princess-theme", "Princess Theme Decoration", 3099, 4199, "2 hr", "/images/catalog/kids/kids-04.jpg", "Best Seller", "Princess"),
      p("cartoon-theme", "Cartoon Theme Decoration", 2200, 3300, "2 hr", "/images/catalog/kids/kids-05.jpg", "Most Loved", "Cartoon"),
      p("krishna-theme", "Krishna Theme Decoration", 3499, 4499, "2.5 hr", "/images/catalog/kids/kids-06.jpg", undefined, "Krishna"),
      p("first-birthday", "First Birthday Setup", 3799, 4899, "2.5 hr", "/images/catalog/kids/kids-07.jpg", "Best Seller", "Cartoon"),
      p("balloon-play-corner", "Balloon Play Corner", 2100, 3000, "1.5 hr", "/images/catalog/kids/kids-08.jpg", undefined, "Jungle"),
    ],
  },
  {
    slug: "annaprashan",
    name: "Annaprashan",
    blurb: "The rice ceremony, styled for the whole family.",
    occasionName: "Annaprashan",
    products: [
      p("annaprashan-home", "Annaprashan Home Setup", 3799, 4899, "2.5 hr", "/images/catalog/annaprashan/annaprashan-01.jpg", "Best Seller"),
      p("annaprashan-classic", "Annaprashan Decoration", 3499, 5499, "2 hr", "/images/catalog/annaprashan/annaprashan-02.jpg", "Most Loved"),
      p("annaprashan-krishna", "Krishna Theme Annaprashan", 3799, 4799, "2.5 hr", "/images/catalog/annaprashan/annaprashan-03.jpg", "Trending"),
      p("annaprashan-premium", "Premium Annaprashan Setup", 5499, 6499, "3 hr", "/images/catalog/annaprashan/annaprashan-04.jpg"),
      p("annaprashan-floral", "Floral Annaprashan Setup", 4299, 5299, "2.5 hr", "/images/catalog/annaprashan/annaprashan-05.jpg"),
      p("mundan-setup", "Mundan Ceremony Setup", 3299, 4299, "2 hr", "/images/catalog/annaprashan/annaprashan-06.jpg"),
    ],
  },
  {
    slug: "room-decoration",
    name: "Room Decoration",
    blurb: "Done inside the house, cleaned up after.",
    themes: ["Romantic", "Birthday", "Surprise"],
    occasionName: "Home Surprise",
    products: [
      p("romantic-room", "Romantic Room Setup", 2699, 3199, "2 hr", "/images/catalog/room/room-01.jpg", "Best Seller", "Romantic"),
      p("candlelight-room", "Candlelight Dinner Setup", 3499, 4299, "2.5 hr", "/images/catalog/room/room-02.jpg", "Most Loved", "Romantic"),
      p("birthday-room", "Birthday Room Decoration", 2199, 3199, "2 hr", "/images/catalog/room/room-03.jpg", "Trending", "Birthday"),
      p("surprise-girlfriend", "Surprise Setup for Her", 2299, 2999, "2 hr", "/images/catalog/room/room-04.jpg", "Most Loved", "Surprise"),
      p("heart-room", "Heart Balloon Room", 1999, 2399, "1.5 hr", "/images/catalog/room/room-05.jpg", undefined, "Romantic"),
      p("hotel-room-setup", "Hotel Room Decoration", 3199, 3999, "2 hr", "/images/catalog/room/room-06.jpg", undefined, "Surprise"),
    ],
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    blurb: "For the evening, not the afternoon.",
    occasionName: "Anniversary",
    products: [
      p("anniversary-classic", "Anniversary Decoration", 2999, 3499, "2.5 hr", "/images/catalog/anniversary/anniversary-01.jpg", "Best Seller"),
      p("anniversary-premium", "Premium Anniversary Setup", 4399, 5499, "3 hr", "/images/catalog/anniversary/anniversary-02.jpg", "Most Loved"),
      p("engagement-setup", "Engagement Decoration", 4399, 5299, "3 hr", "/images/catalog/anniversary/anniversary-03.jpg", "Trending"),
      p("rose-anniversary", "Rose Petal Anniversary", 2599, 3199, "2 hr", "/images/catalog/anniversary/anniversary-04.jpg"),
      p("silver-jubilee", "25th Anniversary Setup", 5999, 6999, "3 hr", "/images/catalog/anniversary/anniversary-05.jpg"),
      p("terrace-anniversary", "Terrace Anniversary Setup", 4899, 5899, "3 hr", "/images/catalog/anniversary/anniversary-06.jpg"),
    ],
  },
  {
    slug: "baby-shower",
    name: "Baby Shower",
    blurb: "Soft, warm and built to photograph well.",
    occasionName: "Baby Shower",
    products: [
      p("baby-shower-home", "Baby Shower at Home", 3199, 3999, "2.5 hr", "/images/catalog/babyshower/babyshower-01.jpg", "Most Loved"),
      p("baby-shower-classic", "Baby Shower Decoration", 2299, 2999, "2.5 hr", "/images/catalog/babyshower/babyshower-02.jpg", "Best Seller"),
      p("baby-shower-premium", "Premium Baby Shower", 5499, 6799, "3 hr", "/images/catalog/babyshower/babyshower-03.jpg", "Trending"),
      p("godbharai-setup", "Godbharai Setup", 2799, 3299, "2.5 hr", "/images/catalog/babyshower/babyshower-04.jpg"),
      p("welcome-baby-home", "Welcome Baby Home Setup", 2599, 3699, "2 hr", "/images/catalog/babyshower/babyshower-05.jpg", "Best Seller"),
      p("gender-reveal", "Gender Reveal Setup", 3499, 4299, "2.5 hr", "/images/catalog/babyshower/babyshower-06.jpg"),
    ],
  },
  {
    slug: "car-decoration",
    name: "Car Decoration",
    blurb: "Bringing someone home, or sending them off.",
    products: [
      p("car-flowers", "Car Flower Decoration", 1999, 2499, "1 hr", "/images/catalog/car/car-01.jpg", "Most Loved"),
      p("car-balloons", "Car Balloon Decoration", 1799, 2199, "1 hr", "/images/catalog/car/car-02.jpg", "Best Seller"),
      p("wedding-car", "Wedding Car Decoration", 2199, 2499, "1.5 hr", "/images/catalog/car/car-03.jpg", "Most Loved"),
      p("newborn-car", "Newborn Welcome Car", 1799, 2199, "1 hr", "/images/catalog/car/car-04.jpg", "Best Seller"),
      p("premium-car", "Premium Car Decoration", 2999, 3599, "1.5 hr", "/images/catalog/car/car-05.jpg", "Trending"),
      p("boat-decoration", "Boat Decoration", 3499, 4299, "2 hr", "/images/catalog/car/car-06.jpg"),
    ],
  },
  {
    slug: "bride-to-be",
    name: "Bride To Be",
    blurb: "Haldi, mehndi and the night before.",
    occasionName: "Wedding",
    products: [
      p("bride-to-be-classic", "Bride To Be Decoration", 2499, 3299, "2 hr", "/images/catalog/bride/bride-01.jpg", "Best Seller"),
      p("haldi-setup", "Haldi Ceremony Setup", 2899, 3799, "2 hr", "/images/catalog/bride/bride-02.jpg", "Trending"),
      p("mehndi-setup", "Mehndi Decoration", 2999, 3899, "2 hr", "/images/catalog/bride/bride-03.jpg", "Best Seller"),
      p("bachelorette-setup", "Bachelorette Setup", 2299, 2999, "2 hr", "/images/catalog/bride/bride-04.jpg", "Trending"),
      p("bride-premium", "Premium Bride To Be", 3499, 4299, "2.5 hr", "/images/catalog/bride/bride-05.jpg", "Best Seller"),
      p("groom-to-be", "Groom To Be Setup", 2399, 3099, "2 hr", "/images/catalog/bride/bride-06.jpg"),
    ],
  },
  {
    slug: "shop-decoration",
    name: "Shop Decoration",
    blurb: "Openings, showrooms and office floors.",
    themes: ["Shop Opening", "Showroom", "Office"],
    occasionName: "Shop Opening",
    products: [
      p("shop-opening", "Shop Opening Decoration", 6499, 8599, "3 hr", "/images/catalog/shop/shop-01.jpg", "Trending", "Shop Opening"),
      p("shop-entrance", "Entrance Balloon Arch", 1999, 2499, "1.5 hr", "/images/catalog/shop/shop-02.jpg", "Best Seller", "Shop Opening"),
      p("showroom-setup", "Showroom Decoration", 5499, 6499, "3 hr", "/images/catalog/shop/shop-03.jpg", undefined, "Showroom"),
      p("office-setup", "Office Decoration", 2939, 3199, "2 hr", "/images/catalog/shop/shop-04.jpg", undefined, "Office"),
      p("ribbon-ceremony", "Ribbon Cutting Setup", 2499, 3199, "1.5 hr", "/images/catalog/shop/shop-05.jpg", "Most Loved", "Shop Opening"),
      p("festive-shop", "Festive Shop Decoration", 3499, 4299, "2 hr", "/images/catalog/shop/shop-06.jpg", undefined, "Showroom"),
    ],
  },
  {
    slug: "corporate",
    name: "Corporate Events",
    blurb: "On-brand, on-schedule, out before Monday.",
    occasionName: "Corporate Event",
    products: [
      p("corporate-stage", "Corporate Stage Setup", 8499, 10499, "3.5 hr", "/images/catalog/corporate/corporate-01.jpg", "Trending"),
      p("office-party", "Office Party Decoration", 4499, 5499, "2.5 hr", "/images/catalog/corporate/corporate-02.jpg", "Best Seller"),
      p("conference-setup", "Conference Backdrop", 6499, 7999, "3 hr", "/images/catalog/corporate/corporate-03.jpg"),
      p("product-launch", "Product Launch Setup", 9499, 11499, "4 hr", "/images/catalog/corporate/corporate-04.jpg", "Trending"),
      p("annual-day", "Annual Day Decoration", 7499, 8999, "3.5 hr", "/images/catalog/corporate/corporate-05.jpg"),
      p("farewell-setup", "Farewell Decoration", 3499, 4299, "2 hr", "/images/catalog/corporate/corporate-06.jpg", "Most Loved"),
    ],
  },
  {
    slug: "wedding",
    name: "Wedding",
    blurb: "Entrances, stages and photo corners.",
    occasionName: "Wedding",
    products: [
      p("wedding-stage", "Wedding Stage Decoration", 12999, 15999, "5 hr", "/images/catalog/wedding/wedding-01.jpg", "Trending"),
      p("reception-setup", "Reception Decoration", 10499, 12999, "4 hr", "/images/catalog/wedding/wedding-02.jpg", "Best Seller"),
      p("wedding-entrance", "Wedding Entrance Arch", 5999, 7499, "3 hr", "/images/catalog/wedding/wedding-03.jpg", "Most Loved"),
      p("sangeet-setup", "Sangeet Night Setup", 8499, 10499, "3.5 hr", "/images/catalog/wedding/wedding-04.jpg"),
      p("photo-corner", "Wedding Photo Corner", 4499, 5499, "2.5 hr", "/images/catalog/wedding/wedding-05.jpg", "Best Seller"),
      p("varmala-stage", "Varmala Stage Setup", 9499, 11499, "4 hr", "/images/catalog/wedding/wedding-06.jpg"),
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
