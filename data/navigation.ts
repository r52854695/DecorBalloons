export type NavItem = {
  label: string;
  href: string;
  /** Renders a mega-menu of occasions on desktop. */
  children?: { label: string; href: string; emoji: string }[];
};

import { occasions } from "./occasions";

export const primaryNav: NavItem[] = [
  { label: "Decorations", href: "/decorations" },
  {
    label: "Occasions",
    href: "/occasions",
    children: occasions.slice(0, 8).map((o) => ({
      label: o.name,
      href: `/occasions/${o.slug}`,
      emoji: o.emoji,
    })),
  },
  { label: "Gallery", href: "/gallery" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Reviews", href: "/#reviews" },
];

export const footerNav = [
  {
    title: "Decorations",
    links: [
      { label: "All Decorations", href: "/decorations" },
      { label: "Balloon Garland", href: "/decorations/balloon-garland" },
      { label: "Balloon Arch", href: "/decorations/balloon-arch" },
      { label: "Room Decoration", href: "/decorations/birthday-room-setup" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Occasions",
    links: [
      { label: "Birthday", href: "/occasions/birthday" },
      { label: "Anniversary", href: "/occasions/anniversary" },
      { label: "Baby Shower", href: "/occasions/baby-shower" },
      { label: "Proposal", href: "/occasions/proposal" },
      { label: "Annaprashan", href: "/occasions/annaprashan" },
      { label: "All Occasions", href: "/occasions" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];
