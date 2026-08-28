import { distinctThemes } from "@/data/catalog";

/**
 * The stylesheet that powers the shelf theme filter.
 *
 * One rule per theme: when a shelf carries `data-filter="Jungle"`, every card
 * that is not tagged Jungle is hidden. That is the whole mechanism.
 *
 * Doing this in CSS rather than in React is the point. Filtering by re-rendering
 * meant the cards had to live inside a client component, so all seventy of them
 * hydrated on load — which is what put mobile LCP at eight seconds. This way the
 * cards are server-rendered and static, and clicking a chip changes one
 * attribute.
 */
export function ShelfFilterStyles() {
  const rules = distinctThemes
    .map(
      (t) =>
        `[data-filter="${t}"] [data-theme]:not([data-theme="${t}"]){display:none}`,
    )
    .join("");

  return <style dangerouslySetInnerHTML={{ __html: rules }} />;
}
