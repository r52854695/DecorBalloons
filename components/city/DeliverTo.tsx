"use client";

import { useCity } from "./CityProvider";
import { cn } from "@/lib/utils";

/**
 * The "Deliver to" control in the header. Opens the city picker.
 *
 * Renders a non-breaking space in place of the city name until the stored
 * choice has been read. The alternative — showing Patna immediately — means
 * anyone who picked Gaya watches the header say Patna and then change under
 * them on every single page load.
 */
export function DeliverTo({ className }: { className?: string }) {
  const { city, ready, openPicker } = useCity();

  return (
    <button
      type="button"
      onClick={openPicker}
      aria-haspopup="dialog"
      aria-label={
        ready ? `Deliver to ${city.name}. Change city` : "Choose your city"
      }
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-left transition-colors hover:bg-cream",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="text-[0.95rem] leading-none text-rose-deep"
      >
        ⌖
      </span>
      <span className="leading-tight">
        <span className="block text-[0.58rem] uppercase tracking-[0.12em] text-ink-faint">
          Deliver to
        </span>
        <span className="block text-[0.78rem] font-semibold text-ink">
          {ready ? city.name : " "}
        </span>
      </span>
      <span aria-hidden="true" className="text-[0.55rem] text-ink-muted">
        ▾
      </span>
    </button>
  );
}
