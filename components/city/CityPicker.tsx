"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useCity } from "./CityProvider";
import { cities } from "@/data/cities";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { cn } from "@/lib/utils";

const FOCUSABLE = 'button, [href], input, [tabindex]:not([tabindex="-1"])';

/**
 * The delivery-city dialog. Opens on a first visit and from "Deliver to".
 *
 * Dismissible on purpose. The reference site blocks the page until a city is
 * chosen; a modal with no way out is both an accessibility failure and a good
 * way to lose someone who only wanted to look at photographs. Escape and the
 * backdrop both close it, and closing without choosing settles on Patna.
 *
 * Focus moves into the dialog on open, is kept inside while it is open, and
 * returns to whatever opened it on close.
 */
export function CityPicker() {
  const { pickerOpen, closePicker, setCity, city } = useCity();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const { reduced } = useMotionBudget();

  useEffect(() => {
    if (!pickerOpen) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    // Focus the panel itself rather than the first city, so a screen reader
    // hears the heading and the explanation before the options.
    //
    // Focused directly rather than inside requestAnimationFrame: rAF is
    // throttled in background and non-compositing tabs, so the callback can be
    // delayed indefinitely and the dialog opens with focus still behind it.
    // AnimatePresence has already mounted the panel by the time this runs.
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePicker();
        return;
      }
      if (e.key !== "Tab") return;
      const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      style.overflow = prevOverflow;
      returnTo.current?.focus?.();
    };
  }, [pickerOpen, closePicker]);

  return (
    /*
     * The pointer-events guard lives on this wrapper, OUTSIDE AnimatePresence.
     *
     * The backdrop is `fixed inset-0`, so while it is mounted it covers the
     * whole page. Putting `pointerEvents: none` in the motion element's exit
     * variant does not work: it is not an animatable value, so Motion applies
     * it only when the exit finishes — precisely the case we need to survive.
     * AnimatePresence also re-renders an exiting child with its old props, so a
     * prop derived from `pickerOpen` would still read true on the way out.
     *
     * A wrapper outside the presence tree re-renders normally, so the moment
     * the picker closes, clicks pass straight through to the page no matter how
     * long the child takes to leave.
     */
    <div
      className={cn(
        "fixed inset-0 z-[100]",
        pickerOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex items-end justify-center bg-ink/45 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) closePicker();
            }}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="city-title"
              aria-describedby="city-desc"
              tabIndex={-1}
              initial={reduced ? false : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { y: 16, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[88svh] w-full max-w-lg overflow-y-auto rounded-t-[14px] bg-ivory p-6 shadow-[var(--shadow-raise)] outline-none sm:rounded-[12px] sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="city-title"
                    className="font-display text-[1.6rem] leading-tight text-ink"
                  >
                    Choose your city
                  </h2>
                  <p
                    id="city-desc"
                    className="mt-1.5 text-[0.88rem] leading-relaxed text-ink-muted"
                  >
                    We curate local pricing &amp; availability per city. Pick
                    yours to see setups available near you.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePicker}
                  aria-label="Close"
                  className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-cream hover:text-ink"
                >
                  <span aria-hidden="true" className="text-lg leading-none">
                    ×
                  </span>
                </button>
              </div>

              <ul className="mt-5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {cities.map((c) => {
                  const active = c.slug === city.slug;
                  return (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onClick={() => setCity(c.slug)}
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-[7px] border px-3.5 py-2.5 text-left transition-colors",
                          active
                            ? "border-ink bg-ink text-ivory"
                            : "border-sand bg-white hover:border-ink/30",
                        )}
                      >
                        <span>
                          <span className="block text-[0.92rem] font-medium">
                            {c.name}
                          </span>
                          <span
                            className={cn(
                              "block text-[0.72rem]",
                              active ? "text-ivory/70" : "text-ink-faint",
                            )}
                          >
                            {c.note}
                          </span>
                        </span>
                        {active && (
                          <span aria-hidden="true" className="text-[0.8rem]">
                            ✓
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-5 border-t border-sand pt-4 text-[0.76rem] leading-relaxed text-ink-faint">
                Not on the list? Tell us where you are — we travel beyond these
                for larger setups.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
