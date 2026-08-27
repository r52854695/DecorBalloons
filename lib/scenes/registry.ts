import type { SceneKey } from "@/components/decor/scenes";
import { occasions } from "@/data/occasions";
import { decorations } from "@/data/decorations";
import { galleryItems } from "@/data/gallery";
import { vibes } from "@/data/vibes";
import { business } from "@/data/business";

export type SceneSpec = {
  scene: SceneKey;
  palette: string[];
  detail: "full" | "compact";
  /** Default alt text. Call sites can override it for their context. */
  label: string;
  /** viewBox ratio, so the <img> reserves its box and nothing shifts. */
  w: number;
  h: number;
};

/**
 * Every decor scene the site can render, addressable by a stable key and
 * pre-rendered to public/scenes/<key>.svg by scripts/build-scenes.mjs.
 *
 * ── Why scenes are files rather than inline SVG ──
 *
 * These illustrations run to hundreds of nodes each and a page can hold twenty.
 * Inlining them cost either hydration time (when they sat inside a client
 * component) or bytes (when passed across the server/client boundary, which
 * also serialises them into the RSC payload — the homepage shipped every scene
 * twice and grew from 564KB to 912KB). Because ScrollReveal wraps almost
 * everything, no arrangement of server and client components avoids both.
 *
 * As files, the document carries only a short <img>, the browser fetches
 * artwork lazily and caches it immutably, and React neither hydrates nor
 * serialises any of it.
 *
 * ── Keys describe CONTENT, not usage ──
 *
 * Each file is its own SVG document, so gradient ids cannot collide between
 * them and two places showing the same artwork can share one file. Keying by
 * content instead of by call site took this from 199 files to ~60. Alt text
 * stays per-usage via SceneImage's `alt` prop.
 */
const registry = new Map<string, SceneSpec>();
const RATIO = { wide: { w: 1600, h: 420 }, std: { w: 800, h: 600 } };

const put = (key: string, spec: SceneSpec) => registry.set(key, spec);

/* ── one-off scenes ── */
put("hero-band", {
  scene: "band",
  palette: ["#E6BCA4", "#C0805F", "#F3EBE2", "#D09A7C", "#101D30"],
  detail: "full",
  label: `Balloon garland and cake table decoration by ${business.name} in ${business.city}`,
  ...RATIO.wide,
});

put("about-scene", {
  scene: "room",
  palette: ["#E6BCA4", "#C0805F", "#F6E7DC", "#101D30", "#D09A7C"],
  detail: "full",
  label: `A room decorated by ${business.name} in ${business.city}`,
  ...RATIO.std,
});

/* ── occasions: one compact, one full ── */
for (const o of occasions) {
  const base = { scene: o.scene, palette: [...o.palette], ...RATIO.std };
  const label = `${o.name} balloon decoration in ${business.city}`;
  put(`occ-${o.slug}`, { ...base, detail: "compact", label });
  put(`occ-${o.slug}-lg`, { ...base, detail: "full", label });
}

/* ── decorations: one compact, one full ── */
for (const d of decorations) {
  const base = { scene: d.scene, palette: [...d.palette], ...RATIO.std };
  const label = `${d.name} by ${business.name} in ${business.city}`;
  put(`dec-list-${d.slug}`, { ...base, detail: "compact", label });
  put(`dec-${d.slug}`, { ...base, detail: "full", label });
}

/* ── gallery ──
 * Only items with no photograph need an illustrated fallback. Now that the
 * studio's real photo library backs the gallery, this loop normally emits
 * nothing — generating 133 SVGs that no page would ever request was pure waste.
 */
for (const g of galleryItems) {
  if (g.src) continue;
  put(`gal-${g.id}`, {
    scene: g.scene,
    palette: [...g.palette],
    detail: "compact",
    label: g.caption,
    ...RATIO.std,
  });
}

/* ── vibes ── */
for (const v of vibes) {
  put(`vibe-${v.slug}`, {
    scene: v.scene,
    palette: [...v.palette],
    detail: "compact",
    label: `${v.name} style balloon decoration`,
    ...RATIO.std,
  });
}

export const getSceneSpec = (key: string) => registry.get(key);
export const allSceneKeys = () => [...registry.keys()];
export const sceneSrc = (key: string) => `/scenes/${key}.svg`;
