"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Occasion } from "@/data/occasions";
import { track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

/**
 * Occasion card.
 *
 * Deliberately not a bordered, heavily rounded box — the brief calls those out
 * explicitly. The scene block carries the visual weight, the type sits on the
 * page beneath it, and a rose-gold rule draws in on hover. The per-occasion
 * accent arrives as a CSS custom property rather than an interpolated class
 * name, because Tailwind cannot see `bg-${accent}` when it scans the source.
 *
 * `scene` is passed in as an already-rendered node rather than built here.
 * This component has to be a client component (it tracks the click), and
 * anything it renders itself gets shipped to the browser and hydrated — which
 * for a several-hundred-node SVG is pure waste, since the artwork never
 * changes. Handing it in from a server component keeps the markup on the
 * server and out of both the bundle and the hydration pass.
 */
export function OccasionCard({
  occasion,
  scene,
  size = "md",
  className,
}: {
  occasion: Occasion;
  /** Server-rendered <DecorScene>, supplied by the parent. */
  scene: ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <Link
      href={`/occasions/${occasion.slug}`}
      onClick={() => track("occasion_selected", { occasion: occasion.slug })}
      className={cn("group block focus-visible:outline-offset-8", className)}
      style={{ "--accent": `var(--color-${occasion.accent})` } as React.CSSProperties}
    >
      <div
        className={cn(
          "scene-frame relative overflow-hidden rounded-[4px] bg-cream",
          size === "lg" ? "aspect-16/10" : "aspect-4/5",
        )}
      >
        {scene}

        {/* accent wash — barely there at rest, present on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[var(--accent)] opacity-0 mix-blend-multiply transition-opacity duration-600 group-hover:opacity-[0.14]"
        />

        <span
          aria-hidden="true"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/92 text-base shadow-[var(--shadow-lift)] backdrop-blur-sm"
        >
          {occasion.emoji}
        </span>
      </div>

      <div className="pt-4">
        <span aria-hidden="true" className="block h-px w-full bg-sand">
          <span className="block h-px w-0 bg-[var(--accent)] transition-[width] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
        </span>

        <h3
          className={cn(
            "mt-3.5 font-display text-ink transition-colors duration-300 group-hover:text-rose-deep",
            size === "lg" ? "text-2xl md:text-3xl" : "text-xl",
          )}
        >
          {occasion.name}
        </h3>
        <p className="mt-1.5 text-[0.84rem] leading-relaxed text-ink-muted">
          {occasion.tagline}
        </p>
      </div>
    </Link>
  );
}

/**
 * Convenience wrapper for server components: builds the scene on the server
 * and hands it to the card, so call sites stay a one-liner.
 */
export function occasionSceneProps(occasion: Occasion, size: "md" | "lg" = "md") {
  return { detail: (size === "lg" ? "full" : "compact") as "full" | "compact" };
}
