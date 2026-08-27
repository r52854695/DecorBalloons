---
name: performance
description: Performance constraints and measured baselines for the DecorBalloons site. Use before adding images, client components, fonts or dependencies, and when investigating Lighthouse or Core Web Vitals regressions.
---

# Performance

Measured with Lighthouse against a production build (`npm run build && npm start`,
Chrome headless):

| | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 99 | 100 | 100 | 100 |
| Mobile | 88 | 100 | 100 | 100 |

Mobile: FCP 1.2s · LCP 3.7s · TBT 90ms · CLS 0.

Real photography *improved* mobile from 81 to 88: next/image serves ~35KB WebP
where the inline scenes cost more, and TBT fell from 320ms to 90ms.

## The scene architecture — do not inline these again

Decor scenes are generated SVGs of a few hundred nodes each, and a page can hold
twenty. They are pre-rendered to `public/scenes/*.svg` by
`scripts/build-scenes.mjs` (wired to `prebuild`/`predev`) and referenced with
`<SceneImage>`, which emits a plain lazy `<img>`.

Two earlier arrangements were measured and both lost:

1. **Inline inside client components** — React hydrated every node.
   Mobile TBT 990ms, score 61.
2. **Built in a server component, passed as props** — removed hydration but
   anything crossing the server/client boundary is *also* serialised into the
   RSC payload, so every scene shipped twice. Homepage went 564KB → 912KB.
   Score 67.

Because `ScrollReveal` wraps almost everything, no arrangement of server and
client components avoids both costs. Files sidestep them: homepage HTML is
199KB raw / 31KB gzipped, artwork is lazy and cached immutably.

## Rules

- New artwork goes in `lib/scenes/registry.ts` and is referenced by key. Key by
  **content**, not by call site — each file is its own SVG document so gradient
  ids cannot collide, and identical scenes share one file (this took 199 files
  to 61). Vary alt text per usage with `SceneImage`'s `alt` prop.
- Scene containers carry `scene-frame` (`content-visibility: auto`) so the
  browser skips style and layout for off-screen artwork.
- `SceneImage` always sets `width`/`height` from the viewBox — that is what
  keeps CLS at 0 while images load lazily. Pass `priority` only above the fold.
- Coordinates are rounded to 1dp in `scenes.tsx`. This is a *correctness*
  requirement: unrounded float chains differed between server and client
  bundles, which React treated as a hydration mismatch.
- Font weights must be used or not loaded.
- **`dynamic(..., { ssr: false })` was tried on the chat and made things worse**
  (TBT 350 → 790ms). It defers work to the client and adds a render pass rather
  than removing work. Measure before assuming lazy-loading helps.

## Always measure

```bash
npm run build && PORT=3100 npm start
CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe" \
  npx lighthouse http://localhost:3100/ --preset=desktop --view
```

Drop `--preset=desktop` for the throttled mobile run, which is the one that
actually moves.
