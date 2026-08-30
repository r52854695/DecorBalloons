# Handover

Everything that is live, and everything still outstanding. Each outstanding
item says who can do it — several cannot be finished without the client.

**Live:** https://www.decorballoon.in
**Repo:** https://github.com/r52854695/DecorBalloons — push to `main` deploys.
**Android app:** `DecorBalloons-app/` (sibling folder, see its own README).

---

## 1. Blocking — must be resolved before real marketing spend

### Prices, MRPs and badges are invented

`data/catalog.ts` — all 70 setups. Every price, every struck-through MRP,
every "Best Seller" / "Most Loved" / "Trending" label. They were written at
the client's request so the layout could be built before a real rate card
existed, benchmarked against comparable Patna services, and **confirmed by
nobody**.

Customers hold a business to a published price. This is the single highest
risk on the site.

To fix: replace the numbers in `data/catalog.ts`, then set
`PRICES_VERIFIED = true` (line 49). That flag also releases the `offers`
block into the Product structured data, so Google can show the prices in
search results — which is exactly why it is off until they are real.

The homepage title also carries **"from ₹1,499"**, derived from the same
placeholder data. That number is what Google prints in the search result.
Review it with the rate card.

### Enquiries are not delivered anywhere

`LEAD_WEBHOOK_URL` is not set in Vercel. `/api/lead` validates and
rate-limits correctly, then logs the enquiry server-side and returns
`{"ok":true,"delivered":false}`. Vercel logs are ephemeral.

The visitor is still handed a prefilled WhatsApp message, so nothing is
completely lost — but anyone who does not complete that handoff is gone.

To fix: create a webhook (Zapier or Make → Gmail / Google Sheet / WhatsApp),
add `LEAD_WEBHOOK_URL` as a **Secret** in Vercel, redeploy.

---

### Resolved

**Brand name — settled as plural, "DecorBalloons".** The domain is
`decorballoon.in` (singular) but that is only an address; the brand matches
the logo. No change needed, and it should not be "fixed" later by someone
who spots the difference.

---

## 2. Unverified client facts

All marked `@verify` in `data/business.ts`:

| Item | State |
|---|---|
| Phone `+91 9155539922` | The brief contradicted itself. Unconfirmed, and this is a lead-generation site. |
| Address | Two different versions were supplied. Currently omitted from schema. |
| Email | None supplied. Field is empty and nothing renders. |
| Opening hours | Unknown. Omitted from LocalBusiness schema rather than guessed. |
| Social profiles | None supplied. Empty entries are not rendered. |

`data/cities.ts` — the ten cities in the delivery picker are **service-area
claims**. Each one tells a visitor the studio will travel there and set up.
Confirm and prune. Someone in Gaya booking a setup that never arrives is
worse than a shorter list.

---

## 3. Photography

- **131 real photographs** from the client, used across the catalogue,
  occasion pages and gallery.
- **36 of them are never shown** — a customer's name is legible on the
  backdrop. Filtered centrally in `data/photos.ts` (`NAMED_BACKDROPS`), so
  they cannot leak onto a product card. Two were only caught by zooming in.
- **14 Pexels stock images** fill genuine gaps — haldi, mehndi, mandap,
  ribbon-cutting, event staging. Each was looked at before being used.
- **Occasion pages for proposal, wedding, corporate, engagement and shop
  opening** show representative setups, not photographs of that occasion —
  the studio has not shot them. Alt text describes the decoration, not the
  event. Marked `@verify` in `data/occasions.ts`. Swap when real ones exist.
- **Car Decoration and Balloon Bouquets were removed** as categories. No
  usable photography exists for either, in the client's library or on
  Pexels. They come back the day there are real photographs.

---

## 4. Reviews

No ratings anywhere, and none invented.

- `data/testimonials.ts` — empty array. The testimonials section hides
  itself rather than rendering blank.
- Product cards have a rating slot that appears the moment real data lands
  in `Product["rating"]`.
- `AggregateRating` is wired on **Product** nodes, not on the business.
  Google treats a business publishing its own rating on its own site as
  self-serving: ineligible for LocalBusiness/Organization and a
  manual-action risk. The org node is double-guarded so real numbers in
  `verifiedAggregate` cannot silently switch it on.

**Google reviews cannot be copied into this markup.** Re-publishing another
platform's aggregate breaks the same policy. It has to be first-party review
data the business collects — e.g. a short feedback link sent after each job.
Google reviews can be *displayed* with attribution and a link.

---

## 5. Needs checking on a real device

Service worker registration and the "Install app" prompt could not be
verified here: this environment refuses to register **any** service worker,
including a one-line test one, so it is the environment and not the code.
`sw.js` passes `node --check` and is served as `application/javascript`.

Open https://www.decorballoon.in on a phone in Chrome and confirm the menu
offers **Install app**.

---

## 6. Nice to have

- **Vercel recommends a newer apex IP.** DNS currently points at
  `76.76.21.21`, which Vercel's own notice says will keep working. Change
  the GoDaddy `A @` record to `216.198.79.1` next time you are in there.
- **`www` is the primary domain**; the apex 308-redirects to it, and
  `NEXT_PUBLIC_SITE_URL` matches. Keep the two in step if either changes.
- **Locality pages were deliberately not built.** Ten near-identical
  "balloon decoration in <locality>" pages differing only by a place name is
  the doorway pattern Google penalises. `/areas` covers all of them honestly
  in one page. Real per-locality pages need real per-locality substance —
  typical venues, travel times, what the studio actually does there.

---

## Current measurements

Taken on the live site, not locally.

| | Mobile | Desktop |
|---|---|---|
| Performance | 82 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |

42 routes in the sitemap, all returning 200. No console errors. No
horizontal scroll at any width from 320px up.
