---
name: decorballoon-motion
description: Rules for adding or changing any animation in the DecorBalloons site. Use whenever touching components/motion/*, scroll-linked behaviour, reveals, parallax, or anything importing from "motion/react".
---

# DecorBalloons motion system

All animation goes through `components/motion/`. Never inline a transition in a
component — if a new kind of movement is needed, add it to `variants.ts`.

## Four rules that were learned the hard way

Each of these caused a real, user-visible bug in this codebase. Do not undo them.

**1. `inView` uses `amount: "some"`, never a fraction.**
A fractional threshold is measured against the *element's own* size, so an
element taller than the viewport can never reach it — a 1700px grid in a 900px
window tops out near a ratio of 0.2. `amount: 0.25` left whole grids stuck at
`opacity: 0`. There is also deliberately no negative `margin`: it narrows the
qualifying band for anything just below the fold on load.

**2. Never put a `whileInView` observer on a clipped, translated element.**
Headline lines rest at `translateY(110%)` inside `overflow: hidden`, so their
intersection rect is empty and IntersectionObserver reports them as *never* on
screen — permanently. `TextReveal` observes the heading and lets the lines
inherit the variant through Motion's context.

**3. Delays travel via `custom`, not a `transition` prop.**
A `transition` prop *replaces* the transition declared inside variants,
silently discarding the designed duration and easing.

**4. `useMotionBudget()` starts `false` for both `reduced` and `mobile`.**
Components branch on these to render structurally different trees. The server
has no matchMedia, so if the first client render read the real media queries it
would produce a different tree and throw a hydration mismatch. A *layout*
effect corrects the values before paint.

## Budget

`useMotionBudget()` decides how much motion a visitor gets:

- `reduced` — an accessibility requirement. CSS kills transitions, but
  scroll-linked transforms are driven in JS and would still move, so components
  must render genuinely static trees (not zero-duration animations).
- `mobile` — a performance budget. Keep the personality, spend less on it:
  fewer balloons, shorter travel.

## Performance

- Drive scroll with motion values (`useScroll` / `useTransform`), never React
  state. One state write per threshold crossing at most.
- Animate `transform` and `opacity` only.
- Balloon configuration is fixed and hand-tuned, never randomised — random
  placement cannot survive server rendering and produces a worse composition
  each load.
