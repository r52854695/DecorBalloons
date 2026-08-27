/**
 * Minimal class joiner. Deliberately not clsx + tailwind-merge: every class in
 * this codebase is authored by hand, so there are no conflicting utilities to
 * merge and two extra dependencies would earn nothing.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Stable slug for ids passed to DecorScene (which needs deterministic ids). */
export function slugId(...parts: Array<string | number>): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Title-cases a slug for display fallbacks. */
export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
