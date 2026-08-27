---
name: accessibility
description: Accessibility requirements for the DecorBalloons site, including reduced-motion handling, contrast rules and interactive-component patterns. Use when adding animation, colours, dialogs, forms or any interactive UI.
---

# Accessibility

Lighthouse Accessibility is **100** on desktop and mobile. Keep it there.

## Reduced motion

Honoured in CSS *and* in JS. CSS alone is not enough: scroll-linked transforms
are driven by JavaScript and would keep moving. Components branch on
`useMotionBudget().reduced` and render genuinely static trees:

- the pinned before/after becomes a static diagram with the steps as text
- the horizontal vibe track becomes a plain grid
- balloons stop drifting
- Party Mode is not offered at all (it is pure decoration; a static fallback
  would be noise)

Never "support" reduced motion by setting duration to zero — an interrupted
zero-duration animation can still strand an element mid-transform.

## Contrast

Every text tone must clear 4.5:1 against `cream` (`#f3ebe2`), the darkest light
surface — passing there passes everywhere else.

`ink-faint` was once `#8d9aad`, which measured **2.42:1** and was genuinely hard
to read. At 12px you cannot sit lighter than ~4.5:1, so de-emphasis comes from
**size and weight**, not a paler grey. `rose` (`#c0805f`) is decorative only.

## Patterns in use

- One `h1` per page, semantic landmarks, skip link, visible focus rings.
- FAQ accordions are native `<details>`/`<summary>` — no ARIA to get wrong,
  keyboard behaviour for free, answers in the DOM for indexing.
- The chat is a real dialog: `aria-modal`, focus trap, Escape to close, focus
  returned to the trigger, `role="log"` with `aria-live="polite"`.
- Decorative SVG is `aria-hidden`; meaningful scenes carry real alt text.
- Horizontal scroll-jacking is desktop-only. Touch scrolling is never hijacked.
- Duplicate links to the same destination inside one card are `aria-hidden` and
  `tabIndex={-1}` so keyboard users hear the destination once.
- On form error, focus moves to the first invalid field by id from the
  validation result — querying `[aria-invalid="true"]` runs before React has
  committed the attribute and silently matches nothing.

## Checking

```bash
npx lighthouse <url> --only-categories=accessibility
```

Also sweep for stranded content: any element inside the viewport with computed
`opacity: 0` that is not an intentional hover state is a broken reveal.
