import { cn } from "@/lib/utils";
import { business } from "@/data/business";

/**
 * Typographic lockup echoing the client's logo: a letterspaced Didone "Decor"
 * paired with the script "Balloons".
 *
 * Set on one baseline rather than stacked like the logo artwork. Stacking a
 * 0.8rem cap-height serif above a script face whose ascenders climb well past
 * its own em box makes the two collide at navbar size; side by side, both stay
 * legible and the lockup reads as one word at a glance.
 *
 * Why type rather than the logo image here: the supplied mark is a circular
 * emblem whose internal wordmark is unreadable below roughly 80px, so at
 * navbar scale it would render as a smudge. Live text stays crisp at any size,
 * recolours for dark surfaces, and costs no image request. The actual artwork
 * is used where it has room to work — the footer, favicon and OG image.
 */
export function Wordmark({
  className,
  tone = "ink",
  size = "md",
}: {
  className?: string;
  tone?: "ink" | "ivory";
  size?: "sm" | "md" | "lg";
}) {
  const scale = {
    sm: { decor: "text-[0.78rem] tracking-[0.2em]", script: "text-[1.28rem]" },
    md: { decor: "text-[0.92rem] tracking-[0.22em]", script: "text-[1.55rem]" },
    lg: { decor: "text-[1.25rem] tracking-[0.24em]", script: "text-[2.15rem]" },
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.34em] leading-none select-none",
        className,
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "font-display uppercase",
          scale.decor,
          tone === "ink" ? "text-ink" : "text-ivory",
        )}
      >
        Decor
      </span>
      <span
        className={cn(
          "font-script translate-y-[0.06em]",
          scale.script,
          tone === "ink" ? "text-rose-deep" : "text-rose-light",
        )}
      >
        Balloons
      </span>
      <span className="sr-only">{business.name}</span>
    </span>
  );
}
