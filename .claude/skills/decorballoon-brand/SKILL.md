---
name: decorballoon-brand
description: Brand voice, palette, typography and the honesty rules for DecorBalloons. Use when writing any customer-facing copy, choosing colours, or adding claims, reviews, prices or statistics to the site.
---

# DecorBalloons brand

A premium balloon and event decoration studio in Patna, Bihar. Editorial and
calm, not a party-supplies template.

## Palette — derived from the client's actual logo

The logo is rose gold/copper and deep navy on warm ivory. The brief's suggested
"champagne, blush, lavender, pastel blue" was a guess made before anyone looked
at the mark; those live on only as per-occasion accents.

- `ink` `#101d30` — the logo's navy
- `rose-deep` `#965b44` — copper, for eyebrows and links
- `rose` `#c0805f` — decorative marks only, **never body text** (2.7:1 on cream)
- `ivory` / `cream` / `paper` — grounds

Every text tone clears WCAG AA (4.5:1) against `cream`, the darkest light
surface. Check any new colour against cream, not against white.

## Typography

- Display: Playfair Display, **weight 400 only** — nothing pairs `font-display`
  with a heavier weight, and loading 500/600 shipped unused fonts.
- Body: Manrope. Script: Parisienne, used solely for the "Balloons" wordmark.

## Voice

Warm, plain, specific. British-Indian English. Describe what actually happens
("our own team installs and anchors it") rather than adjectives ("best-in-class
service"). Short sentences. No exclamation marks outside the chat.

## The honesty rules — these are not negotiable

The client supplied no reviews, no rate card, no photographs and no statistics.
Everything below is a deliberate product decision, not an unfinished section:

- **No prices anywhere.** Every card says "Get a quote". Publishing a figure the
  studio never agreed to is the fastest way to lose the first enquiry.
- **No reviews.** `data/testimonials.ts` ships empty and the section renders an
  honest "collecting reviews" state. Fabricated reviews on a local business are
  a Google review-spam violation that can suppress the business profile.
- **No invented statistics, ratings, counts, years in business, or team size.**
  Trust comes from describing the craft, not from numbers a visitor half
  believes.
- **Photography is real** — 132 images of the studio's own work. Occasions it
  has not shot keep an illustration rather than borrowing a photo of something
  else. Never publish an image the studio did not take: one competitor
  screenshot ("shop4party") already had to be removed from the library.
- **No fabricated structured data.** `AggregateRating`, `Review`, `Offer` and
  `openingHours` stay out of the JSON-LD until real data exists.

Unverified client facts are marked `@verify` in `data/business.ts`. Do not
quietly promote one to fact.
