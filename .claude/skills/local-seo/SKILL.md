---
name: local-seo
description: Local SEO conventions for DecorBalloons (Patna, Bihar) — metadata, JSON-LD, occasion taxonomy and city pages. Use when adding pages, changing metadata or touching structured data.
---

# Local SEO — Patna

Lighthouse SEO is **100**. Every route has a unique title, description and
canonical.

## Metadata

Build it with `buildMetadata()` in `lib/seo/metadata.ts` — never hand-roll a
`Metadata` object. The root layout defines a `"%s | Brand"` template, so the
homepage passes `title: { absolute }` (handled inside the helper) to avoid a
doubled suffix.

## Structured data

Builders live in `lib/seo/schema.ts`. In use: `LocalBusiness`, `WebSite`,
`Service`, `FAQPage`, `BreadcrumbList`.

Deliberately **absent** until the client supplies verified data:
`AggregateRating`, `Review`, `Offer`/price, `openingHoursSpecification`, `geo`.
These emit automatically once the underlying data exists — do not hard-code
them, and never invent values to "fill in" the schema.

## Taxonomy

Occasion pages carry the highest-value local intent. The set deliberately
includes regionally important occasions the original brief omitted, found by
studying what competitors rank for:

- **Annaprashan** (rice ceremony) — major in Bihar, real search volume
- **Shop / showroom opening** — common commercial category in India
- **Engagement / ring ceremony**

Decorations also carry **venue** and **style** axes (room, terrace, banquet
hall, stage, shop frontage) because those match how people actually search
("balloon decoration terrace patna").

## Writing for local intent

Mention Patna and the specific occasion naturally, once or twice per page, in
sentences a human would write. Do **not** stack keywords — competitors do this
and it reads as spam. `business.serviceAreas` is listed once in the footer and
on contact, not sprinkled everywhere.

## City pages

URLs are structured so `/patna/...` style pages can be added later without
moving anything. When adding a city, extend `data/business.ts` service areas and
add the route — `sitemap.ts` derives from the same data.

## Images

Scenes are served as `<img>` with real alt text, so alt is genuine image SEO
now. `SceneImage` takes an `alt` override — use it to describe the specific
context ("Balloon garland for a birthday in Patna"), not just the artwork.
