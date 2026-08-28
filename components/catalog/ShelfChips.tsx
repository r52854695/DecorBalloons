"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Theme chips for a catalogue shelf.
 *
 * Sets one attribute — `data-filter` — on the shelf and lets CSS hide the cards
 * that do not match (see ShelfFilterStyles). It never renders a product card,
 * which is the whole point: the cards stay server-rendered and never hydrate.
 * Filtering them in React is what put seventy card components on the main
 * thread and mobile LCP at eight seconds.
 */
export function ShelfChips({
  shelfId,
  themes,
}: {
  shelfId: string;
  themes: string[];
}) {
  const [active, setActive] = useState("All");

  const pick = (t: string) => {
    setActive(t);
    const el = document.getElementById(shelfId);
    if (!el) return;
    if (t === "All") el.removeAttribute("data-filter");
    else el.setAttribute("data-filter", t);
    // Filtering can leave the shelf scrolled past the end of a short result.
    el.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-3.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {["All", ...themes].map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={active === t}
          onClick={() => pick(t)}
          className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.76rem] transition-colors",
            active === t
              ? "border-ink bg-ink text-ivory"
              : "border-sand bg-white text-ink-muted hover:border-ink/30 hover:text-ink",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
