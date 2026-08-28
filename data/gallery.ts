import type { SceneKey } from "@/components/decor/scenes";
import { allPhotos, isNamedBackdrop, photos, type PhotoCategory } from "./photos";

export type GalleryItem = {
  id: string;
  /** Alt text / caption — descriptive, and real image SEO now that these are photos. */
  caption: string;
  occasion: string;
  /** Masonry span, derived from the photograph's true orientation. */
  aspect: "portrait" | "landscape" | "square" | "tall";
  /** Real photograph. Null only if the studio has no photo for this slot. */
  src: string | null;
  /** Fallback illustration, used only when `src` is null. */
  scene: SceneKey;
  palette: string[];
};

/**
 * The gallery, built from the studio's real photographs.
 *
 * This used to be a hand-written list of illustrated scenes because no
 * photography had been supplied. The client's photo library replaced it — the
 * illustrations survive only as a fallback for occasions that have not been
 * photographed yet (proposal, wedding, corporate, shop opening).
 */

/** Which photo folder feeds which occasion slug, for filtering. */
const CATEGORY_TO_OCCASION: Record<PhotoCategory, string> = {
  "birthday": "birthday",
  "adult": "birthday",
  "theme-birthday": "kids-party",
  "surprise-birthday": "home-surprise",
  "anniversary": "anniversary",
  "baby-shower": "baby-shower",
  "annaprashan": "annaprashan",
  "welcome-baby": "baby-shower",
  "baby-boy": "baby-shower",
  "baby-boy-theme": "kids-party",
  "baby-girl": "baby-shower",
};

/** Orientation → masonry span, so the grid reads from the real pictures. */
function aspectFor(w: number, h: number): GalleryItem["aspect"] {
  const r = w / h;
  if (r > 1.25) return "landscape";
  if (r < 0.72) return "tall";
  if (r < 0.95) return "portrait";
  return "square";
}

/**
 * Interleave categories so the grid alternates occasions instead of showing
 * 28 anniversary photos in a row.
 */
function interleave<T>(groups: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(0, ...groups.map((g) => g.length));
  for (let i = 0; i < max; i++) {
    for (const g of groups) if (g[i]) out.push(g[i]);
  }
  return out;
}

const grouped = (Object.keys(photos) as PhotoCategory[]).map((cat) =>
  // Named backdrops are excluded from every gallery surface, not just product
  // cards. These strips appear on occasion and decoration pages, which are
  // marketing surfaces like any other — a customer's child's name should not be
  // selling a package there either.
  photos[cat].filter((p) => !isNamedBackdrop(p.src)).map((p, i) => ({ ...p, cat, i })),
);

export const galleryItems: GalleryItem[] = interleave(grouped).map((p) => ({
  id: `${p.cat}-${p.i + 1}`,
  caption: p.alt,
  occasion: CATEGORY_TO_OCCASION[p.cat],
  aspect: aspectFor(p.w, p.h),
  src: p.src,
  // Fallbacks, never rendered while `src` is set.
  scene: "garland",
  palette: ["#E6BCA4", "#C0805F", "#F3EBE2", "#D09A7C", "#101D30"],
}));

export const galleryForOccasion = (slug: string) =>
  galleryItems.filter((g) => g.occasion === slug);

/** True only if the portfolio is still illustrated rather than photographed. */
export const galleryIsIllustrated = galleryItems.every((g) => g.src === null);

/** Total real photographs available, for copy that references the portfolio. */
export const photoCount = allPhotos.filter((p) => !isNamedBackdrop(p.src)).length;
