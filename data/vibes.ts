import type { SceneKey } from "@/components/decor/scenes";

export type Vibe = {
  slug: string;
  name: string;
  /** Short editorial description of the mood. */
  blurb: string;
  /** The colours a customer would actually be choosing between. */
  palette: string[];
  swatches: { hex: string; name: string }[];
  scene: SceneKey;
  /**
   * A real setup that reads as this mood. Chosen for palette and feel rather
   * than occasion — the section asks "what should it feel like", not "what are
   * we celebrating".
   */
  photo?: string;
  /** Occasions this mood suits — used to link out of the section. */
  suits: string[];
};

/**
 * "Choose your vibe" — the section that lets someone pick by feeling rather
 * than by occasion. Useful because a lot of enquiries arrive as "something
 * elegant" or "something bright" long before a theme exists.
 */
export const vibes: Vibe[] = [
  {
    slug: "romantic",
    name: "Romantic",
    blurb:
      "Deep rose, candlelight and petals. Built for two people and a room that should feel smaller than it is.",
    palette: ["#B4526B", "#E6BCA4", "#A2624A", "#F6E7DC", "#101D30"],
    swatches: [
      { hex: "#B4526B", name: "Deep rose" },
      { hex: "#A2624A", name: "Copper" },
      { hex: "#F6E7DC", name: "Blush ivory" },
    ],
    scene: "room",
    photo: "/images/decor/anniversary/anniversary-01.jpg",
    suits: ["anniversary", "proposal"],
  },
  {
    slug: "dreamy",
    name: "Dreamy",
    blurb:
      "Soft pastels and clouded whites. Gentle on camera, which is why it keeps winning for baby showers.",
    palette: ["#7FA8C4", "#E6BCA4", "#F3EBE2", "#FFFDFB", "#D09A7C"],
    swatches: [
      { hex: "#7FA8C4", name: "Powder blue" },
      { hex: "#F3EBE2", name: "Cream" },
      { hex: "#E6BCA4", name: "Peach" },
    ],
    scene: "arch",
    photo: "/images/decor/baby-shower/baby-shower-07.jpg",
    suits: ["baby-shower", "birthday"],
  },
  {
    slug: "luxury",
    name: "Luxury",
    blurb:
      "Champagne, ivory and gold against deep navy. Restrained, formal, and photographs like an event.",
    palette: ["#C9A55C", "#FFFDFB", "#101D30", "#E6BCA4", "#C0805F"],
    swatches: [
      { hex: "#C9A55C", name: "Champagne gold" },
      { hex: "#101D30", name: "Navy ink" },
      { hex: "#FFFDFB", name: "Ivory" },
    ],
    scene: "stage",
    photo: "/images/decor/anniversary/anniversary-05.jpg",
    suits: ["wedding", "engagement", "corporate"],
  },
  {
    slug: "bold",
    name: "Bold",
    blurb:
      "Saturated colour, high contrast, nothing apologetic. For celebrations meant to be heard from the street.",
    palette: ["#A83A4E", "#E08A5F", "#C9A55C", "#101D30", "#E6BCA4"],
    swatches: [
      { hex: "#A83A4E", name: "Crimson" },
      { hex: "#E08A5F", name: "Burnt orange" },
      { hex: "#C9A55C", name: "Gold" },
    ],
    scene: "column",
    photo: "/images/decor/anniversary/anniversary-17.jpg",
    suits: ["shop-opening", "birthday", "corporate"],
  },
  {
    slug: "kids",
    name: "Kids",
    blurb:
      "Bright, playful and set at child height. One clear theme carried through every element.",
    palette: ["#6BA292", "#E08A5F", "#7FA8C4", "#C9A55C", "#E6BCA4"],
    swatches: [
      { hex: "#6BA292", name: "Jungle green" },
      { hex: "#7FA8C4", name: "Sky" },
      { hex: "#E08A5F", name: "Coral" },
    ],
    scene: "garland",
    photo: "/images/decor/baby-boy-theme/baby-boy-theme-07.jpg",
    suits: ["kids-party", "birthday"],
  },
];
