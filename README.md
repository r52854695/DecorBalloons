# DecorBalloons

Premium balloon and event decoration studio site for **Patna, Bihar** — built with
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and Motion 13.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (36 static pages)
npm start
npm run lint
```

---

## ⚠️ Read this before launch — unverified client data

Several facts were supplied second-hand or inconsistently. Nothing has been
invented to fill the gaps: unknown values are left empty and the UI hides the
relevant element. **Confirm each of these with the client**, then update the one
file named beside it.

| # | Item | Status | Where to fix |
|---|------|--------|--------------|
| 1 | **Phone number** | The brief contradicts itself — its sample config shows `+919155533992`, its prose says `+91 9155539922` three times. The prose spelling is live. **A wrong number costs every enquiry.** | `data/business.ts` → `primaryPhone`, `whatsappNumber` |
| 2 | **Brand name** | Brief prose says "DecorBalloon"; the supplied logo artwork and the repo README both read "DecorBalloons". Plural is live, because it sits beside the logo. One value changes it everywhere. | `data/business.ts` → `name` |
| 3 | **Address** | Two versions supplied. The shorter, better-reading one is live; the long form is kept alongside it. Neither is verified. | `data/business.ts` → `address` |
| 4 | **Email** | None supplied. Deliberately blank — every email link and mention is hidden while empty, rather than inventing an address. | `NEXT_PUBLIC_CONTACT_EMAIL` |
| 5 | **Reviews** | **Zero reviews ship.** None were supplied, and fabricating them is a Google review-spam violation that can suppress a business profile. The reviews section renders an honest "collecting reviews" state that still converts. | `data/testimonials.ts` |
| 6 | **Pricing** | No rate card supplied, so **no price appears anywhere**. Every card says "Get a quote". | `data/decorations.ts` → `priceFrom` |
| 7 | **Photography** | ✅ **132 real photographs** imported from the client's Drive library across 11 categories. One image (`anniversary-12`) was **removed** — it was a screenshot of another vendor's post carrying "shop4party" branding. **The library needs a human review pass** for others like it, and for photos showing customer names. | `data/photos.ts`, `public/images/decor/` |
| 8 | **Opening hours / ratings / stats** | All unknown, so all omitted from the page **and** from the structured data. | `lib/seo/schema.ts` |
| 9 | **Lead delivery** | Not configured. See "Enquiries" below — enquiries are **not** silently lost, but server-side capture needs a webhook. | `LEAD_WEBHOOK_URL` |

The guiding rule throughout: **describe the service honestly; never state a fact
the client has not confirmed.** That is why there are no invented statistics,
no "500+ happy customers", and no star ratings.

---

## Environment

Copy `.env.example` → `.env.local`. Every variable is optional for development.

| Variable | Effect if unset |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Falls back to `https://decorballoons.in`. **Set in production** — it builds every canonical URL, the sitemap, robots.txt and OG tags. |
| `OPENAI_API_KEY` | Party Pal runs on the built-in rules engine. **The chat is fully functional without a key.** Server-only — never prefix `NEXT_PUBLIC_`. |
| `LEAD_WEBHOOK_URL` | Enquiries are logged server-side only; the visitor is still handed a prefilled WhatsApp message. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email is hidden everywhere. |
| `NEXT_PUBLIC_SHOW_SAMPLE_REVIEWS` | Reviews section shows its honest empty state. Set `true` only to demo the carousel — cards are ribboned "SAMPLE" and never enter structured data. |

---

## Architecture

```
app/            routes, API handlers, sitemap/robots/icons/OG image
components/
  decor/        scene generator, balloon primitives, <SceneImage>
  motion/       shared motion system (variants, ScrollReveal, Parallax, …)
  sections/     homepage + page sections
  ui/           buttons, cards, gallery, party mode
  chat/         Party Pal assistant
  forms/        lead form
  layout/       navbar, footer, wordmark, page hero
data/           ALL content lives here — no copy hard-coded in JSX
lib/
  ai/           provider abstraction (OpenAI + Mock), prompt, types
  scenes/       registry of every decor scene, keyed by content
  seo/          metadata + JSON-LD builders
  analytics/    provider-agnostic event tracking
scripts/
  build-scenes.mjs   pre-renders scenes to public/scenes/*.svg (prebuild)
.claude/skills/ project skills: brand, motion, ui, local-seo, performance,
                accessibility, ai-party-planner
```

Content is data-driven throughout, so a CMS can be dropped in later by
replacing the `data/*` modules without touching a component.

### Decor scenes are generated files, not inline SVG

No real photography was supplied, so setups are drawn as SVG rather than filled
with stock imagery — illustration is visibly a drawing, so it never passes
itself off as the client's own work.

`scripts/build-scenes.mjs` pre-renders every scene in `lib/scenes/registry.ts`
to `public/scenes/<key>.svg` before each build, and `<SceneImage>` renders a
plain lazy `<img>`. That indirection is load-bearing — two simpler arrangements
were measured and both lost:

| Arrangement | Cost | Mobile score |
|---|---|---|
| Inline inside client components | React hydrated every node (TBT 990ms) | 61 |
| Built server-side, passed as props | Also serialised into the RSC payload — every scene shipped twice, 564KB → 912KB | 67 |
| **Pre-rendered files + lazy `<img>`** | **HTML 199KB raw / 31KB gzip, artwork cached** | **81** |

Because `ScrollReveal` wraps almost everything, no arrangement of server and
client components avoids both costs at once.

Notes for anyone extending it:

- Keys describe **content, not usage**. Each file is its own SVG document so
  gradient ids cannot collide, and identical scenes share one file — keying by
  content took this from 199 files to 61. Vary alt text per usage with
  `SceneImage`'s `alt` prop.
- Scenes are composed **for an aspect ratio**; wide strips use the dedicated
  `band` scene rather than a crop of a 4:3 composition.
- Generation is deterministic (seeded PRNG, explicit ids) and coordinates are
  rounded to 1dp. The rounding is a correctness requirement: unrounded float
  chains differed in their last bits between server and client bundles, which
  React treated as a hydration mismatch.


### Photography

The studio's real photo library — 132 images across 11 categories — is committed
under `public/images/decor/` and described by the generated `data/photos.ts`
(dimensions read from each JPEG header, so `<Image>` reserves the right box and
CLS stays at 0).

Photographs replaced the illustrated scenes everywhere the studio has actually
shot the work. Occasions it has **not** photographed — proposal, wedding,
corporate, shop opening — deliberately keep the illustration: labelling an
anniversary photo as a wedding would be a claim about what the picture shows.
`PhotoOrScene` picks between them, and the "these are illustrations" notices on
the gallery disappear by themselves now that `galleryIsIllustrated` is false.

Counter-intuitively this made the site **faster** — mobile Performance went
81 → 88 and TBT 320ms → 90ms, because next/image serves ~35KB WebP where the
inline scenes cost more.

**Before launch, someone who knows the work must review the library.** Two
problems are already known: one image was another vendor's screenshot (removed),
and several photographs show personalised signage with real customer names,
which is the client's call to publish.

### Cinematic showcase

`CinematicShowcase` gives every photographed decoration the same pinned,
scroll-driven treatment as the homepage transformation: the stage stays fixed
while frames take over from one another, each paired with the line of the setup
it shows.

Frames are revealed with a **wipe, not a cross-fade**. Two photographs at
partial opacity ghost — the previous backdrop's lettering reads straight through
the next one — so each frame stays fully opaque and clips down over the one
beneath.

One constraint worth keeping: every `useTransform` input range here must stay
inside [0, 1] and strictly increase. Motion binds these to native WAAPI
animations, and an out-of-bounds range produces keyframe offsets the browser
rejects with "Offsets must be monotonically non-decreasing" — which took the
whole page down when the first frame's range started at −0.09.

### The motion system (`components/motion/`)

Shared variants and wrappers so every reveal on the site comes from one hand.
Three non-obvious rules are documented in the source and worth keeping:

1. **`inView` uses `amount: "some"`, never a fraction.** A fractional threshold
   is measured against the element's own size, so an element taller than the
   viewport can never reach it — a 1700px grid in a 900px window tops out
   around 0.2. `amount: 0.25` left tall grids permanently invisible.
2. **A `whileInView` observer must never sit on a clipped, translated element.**
   Headline lines rest at `translateY(110%)` inside `overflow: hidden`, so their
   visible area is zero and IntersectionObserver reports them as never on
   screen. `TextReveal` observes the *heading* and lets the lines inherit.
3. **Delays travel via `custom`, not a `transition` prop.** A `transition` prop
   *replaces* the transition declared in variants, silently discarding the
   designed duration and easing.

`useMotionBudget()` centralises how much motion a visitor gets. Both `reduced`
and `mobile` start `false` so the first client render matches the server, then
a **layout** effect corrects them before paint — reading the real media queries
during the first render produced a different tree and a hydration mismatch for
every reduced-motion visitor.

### Accessibility

- `prefers-reduced-motion` is honoured in CSS **and** in JS. Scroll-linked
  transforms are driven by JS and would otherwise still move, so components
  render genuinely static trees: the pinned before/after becomes a static
  diagram, the horizontal vibe track becomes a grid, balloons stop drifting,
  and Party Mode is not offered at all.
- Semantic landmarks, one `h1` per page, skip link, visible focus rings.
- FAQ accordions are native `<details>`/`<summary>` — no ARIA to get wrong.
- The chat is a real dialog: `aria-modal`, focus trap, Escape to close, focus
  returned to the trigger, and an `aria-live` log.
- Horizontal scroll-jacking is desktop-only; touch scrolling is never hijacked.

### Party Pal (`lib/ai/`, `app/api/chat`)

```
AIProvider
├── OpenAIProvider   (used when OPENAI_API_KEY is set; falls back on any error)
└── MockProvider     (default — a real rules engine over the site's own data)
```

`MockProvider` is not a stub. It resolves the occasion, picks a matching setup
and composes a specific recommendation, so the planner is genuinely useful with
no key and no configuration. The model is constrained to the real catalogue and
explicitly forbidden from inventing prices, timings or availability. The key is
server-only; the browser only ever talks to `/api/chat`.

Both API routes are schema-validated with Zod, length-capped and rate-limited.
The limiter is in-memory and **per instance** — fine for a single-region site,
but swap it for Redis behind the same interface if this is ever scaled out.

### Enquiries

The lead form validates on the client and again on the server, then on success
hands the visitor a **prefilled WhatsApp message containing everything they
typed**. That is deliberate: until `LEAD_WEBHOOK_URL` is set, WhatsApp is the
only path that actually reaches the business, so no enquiry can be quietly
dropped into a server log. The form also carries a honeypot field.

### SEO

- Unique title, description and canonical on every route.
- JSON-LD: `LocalBusiness`, `WebSite`, `Service`, `FAQPage`, `BreadcrumbList`.
  `AggregateRating`, `Review`, `Offer` and `openingHours` are **deliberately
  absent** until real data exists.
- `sitemap.xml` (29 URLs) and `robots.txt` generated from the same data.
- Occasion taxonomy includes regionally important searches the brief omitted —
  **Annaprashan**, engagement and shop-opening — plus venue and style axes for
  long-tail intent. The URL structure leaves room for `/patna/...` city pages.
- Local relevance is stated naturally; no keyword stuffing.

---

## Editing content

**Add an occasion** → append to `data/occasions.ts`. The page, sitemap entry,
nav mega-menu, schema and cross-links all follow automatically.

**Add a decoration** → append to `data/decorations.ts`. Same.

**Adding real photos** → drop files into `public/images/gallery/` and set `src`
on the matching entry in `data/gallery.ts`. The tile switches from illustration
to a `next/image`, and the "these are illustrations" notices disappear on their
own once every item has a `src`.

**Adding real reviews** → paste them into `testimonials` in
`data/testimonials.ts`. `Review` schema then emits automatically. Leave
`verifiedAggregate` null until you have a genuine count and average from a real
review platform.

---

## Verified in this build

### Lighthouse — production build, Chrome headless

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | **99** | 100 | 100 | 100 |
| Mobile (throttled 4G, 4× CPU) | **88** | 100 | 100 | 100 |

Mobile vitals: FCP 1.2s · LCP 3.7s · **TBT 90ms** · **CLS 0** · Speed Index 3.1s.

Reproduce:

```bash
npm run build && PORT=3100 npm start
CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe" npx lighthouse http://localhost:3100/ --preset=desktop --view
```

### Functional and cross-device

Checked across `/`, `/occasions`, `/occasions/[slug]`, `/decorations`,
`/decorations/[slug]`, `/gallery`, `/about`, `/contact`, `/faq`,
`/how-it-works` and 404:

- ✅ `tsc --noEmit` clean, `eslint` clean, production build green (36 pages)
- ✅ Zero console errors across 30 page loads (desktop + mobile + forced
  reduced motion)
- ✅ Nine widths swept — 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 — no
  horizontal scrolling, no broken images, no missing `alt`
- ✅ No stranded (invisible) in-viewport content anywhere
- ✅ One `h1` per page, unique titles, valid JSON-LD
- ✅ Party Pal completes end-to-end **with no API key**
- ✅ Lead form: rejects bad input, moves focus to the first invalid field,
  and hands off to WhatsApp with the brief prefilled
- ✅ Party Mode: canvas mounts for the burst and is removed afterwards (no leak)
- ✅ `tel:` and `wa.me` links correct, with contextual prefilled messages

### Known limitations

- **Mobile Performance is 88, just short of the brief's 90 target.** It came up
  from 61 through the scene-architecture work and then the switch to real
  photography. What remains is the animation library's own bundle (~159KB of JS),
  which is inherent to the brief's requirement that Framer Motion drive the
  experience. The next lever is `LazyMotion` with the `domAnimation` feature
  subset — worth roughly 15KB — but it must first be verified that `whileInView`
  survives the reduced feature set, because every reveal on the site depends on
  it. Desktop is 99.
- **The photo library needs a human review pass.** One competitor screenshot was
  found and removed; it was spotted by eye, and no automated check can reliably
  find the rest. A dozen images also carry black letterbox bars from their
  source crop, and several show customer names.
- `dynamic(..., { ssr: false })` on the chat was tried and **reverted** — it
  moved TBT from 350ms to 790ms. Deferring a component to the client adds a
  render pass rather than removing work. Measure before lazy-loading.
- `documentElement.scrollWidth` reads wider than the viewport on some pages
  because `body` uses `overflow-x: clip`. The page is **not** horizontally
  scrollable (verified via `window.scrollX`); test scrollability, not
  `scrollWidth`. `html` is deliberately left alone: `overflow-x: clip` with
  `overflow-y: visible` coerces to `auto` and would break the sticky sections.
- The in-memory rate limiter does not span instances.
- Sample review cards are gated behind an env flag and must stay off in
  production.
