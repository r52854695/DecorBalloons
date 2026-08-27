"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export type MotionBudget = {
  /** User asked for reduced motion — drop scroll-linked and idle animation entirely. */
  reduced: boolean;
  /** Narrow viewport — keep the personality, spend less on it. */
  mobile: boolean;
  /** Multiplier for parallax distance and balloon counts. */
  scale: number;
};

/**
 * useLayoutEffect warns when it runs during server rendering, so fall back to
 * useEffect there. On the client this must be a layout effect — see below.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Central place that decides how much motion this visitor gets.
 *
 * Two separate concerns, deliberately not conflated:
 *  - `reduced` is an accessibility requirement. CSS already kills transitions,
 *    but scroll-linked transforms are driven in JS and would otherwise still
 *    move, so components branch on this and render statically.
 *  - `mobile` is a performance budget. The site should still feel cinematic on
 *    a phone (brief section 47), just with fewer elements and shorter travel.
 *
 * ── Why both values start `false` ──
 *
 * Components branch on these to render structurally different trees (a plain
 * <div> instead of two nested motion.divs, a static grid instead of a pinned
 * horizontal track). The server has no matchMedia, so it always renders the
 * full-motion tree. If the first client render read the real media queries it
 * would produce a *different* tree and React would throw a hydration mismatch
 * and re-render the whole page — which is exactly what happened for every
 * reduced-motion visitor before this.
 *
 * So the first client render deliberately matches the server (both false), and
 * a layout effect corrects it. It is a layout effect rather than useEffect
 * because layout effects run before the browser paints: the correction lands
 * in the same frame, so a reduced-motion visitor never sees a flash of the
 * animated tree with its content still at opacity 0.
 */
export function useMotionBudget(): MotionBudget {
  const reducedPref = useReducedMotion();
  const [state, setState] = useState({ hydrated: false, mobile: false });

  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setState({ hydrated: true, mobile: mq.matches });
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const reduced = state.hydrated ? Boolean(reducedPref) : false;
  const mobile = state.hydrated ? state.mobile : false;

  return {
    reduced,
    mobile,
    scale: reduced ? 0 : mobile ? 0.5 : 1,
  };
}
