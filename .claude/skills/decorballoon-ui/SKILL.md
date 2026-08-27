---
name: decorballoon-ui
description: Layout, spacing, component and design-system conventions for the DecorBalloons site. Use when building or editing any page, section, card or form.
---

# DecorBalloons UI

## Structure

- Content lives in `data/*`, never hard-coded in JSX. Adding an occasion or a
  decoration to its data file gives you the page, sitemap entry, nav entry,
  schema and cross-links automatically.
- Sections compose from `components/sections/`, primitives from
  `components/ui/`, motion wrappers from `components/motion/`.
- Every section opens with `<SectionHeading>`: rose-gold eyebrow, editorial
  display heading, optional lead.

## Design system

Tokens are defined in `app/globals.css` under `@theme`. Use utilities
(`shell`, `section-y`, `eyebrow`, `link-draw`, `grain`, `scene-frame`) rather
than repeating raw values.

- `shell` — page gutter and max width. `section-y` — vertical rhythm.
- Radii stay small (3–6px). The brief explicitly rejects heavily rounded cards.
- Elevation is warm and low, never grey.

## Things to avoid (from the brief)

Cheap gradients, glassmorphism, cartoonish UI, confetti everywhere, heavy
shadows, SaaS-dashboard aesthetics, excessive rounded cards, animation for its
own sake.

## Avoid two grids back to back

The occasions section is a grid, so featured decorations are alternating
editorial rows instead. Varying the rhythm is what stops the page reading as a
template.

## Cards

Cards are not bordered boxes. The scene block carries the visual weight, type
sits beneath it, and a rose-gold rule draws in on hover.

Per-occasion accent colours arrive as a CSS custom property
(`style={{ "--accent": ... }}`) and are used via `bg-[var(--accent)]`. Tailwind
cannot see an interpolated class name like `` bg-${accent} `` when it scans the
source, so that will silently produce no styles.

## Forms

Underline inputs on ivory, labels above. Validate on the client for feedback and
again on the server — the client copy is convenience, never the gate. On error,
move focus to the first invalid field **by id from the validation result**, not
by querying `[aria-invalid="true"]`: `setState` is asynchronous and the
attribute is not in the DOM yet.

## Responsive

Designed at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920. 320px is the one
that breaks — check it. Body uses `overflow-x: clip`; note that
`documentElement.scrollWidth` can still report a larger value than the viewport
even when the page is genuinely not scrollable, so test **scrollability**
(`window.scrollX` after `scrollTo`), not `scrollWidth`.
