---
name: ai-party-planner
description: Architecture and guardrails for Party Pal, the DecorBalloons AI celebration planner. Use when changing the chat flow, the AI providers, the prompt, or /api/chat.
---

# Party Pal

The floating celebration planner. Collects a short structured brief, then
recommends one setup and hands the visitor to WhatsApp with everything they
typed prefilled.

## Architecture

```
lib/ai/
├── types.ts    Zod-validated PlanBrief + Recommendation
├── mock.ts     MockProvider  — rules engine over the site's own data
├── openai.ts   OpenAIProvider — plain fetch, falls back to mock on any error
└── index.ts    getProvider()  — picks based on OPENAI_API_KEY
```

`app/api/chat/route.ts` is the only entry point. The browser never talks to a
model directly.

## The mock provider is not a stub

It resolves the occasion against `data/occasions.ts`, picks a matching setup
from `data/decorations.ts` and composes a specific recommendation. **The chat is
fully functional with no API key**, which matters because the most likely
production state of this site is "launched before anyone bought a key". It is
also the fallback when a model call fails, so the planner always answers.

When editing it, keep answers specific to the visitor's brief. Watch for echoing
a non-answer back into a sentence — "Not sure yet" once produced *"we will scale
the setup to your Not sure yet range"*. There is a `vague()` guard; extend it
rather than adding special cases.

## Guardrails (system prompt in `openai.ts`)

The model is constrained to the real catalogue and explicitly forbidden from:

- stating or estimating **any price, discount or currency amount**
- promising a **setup duration, arrival time or same-day availability**
- inventing **reviews, ratings, awards or customer counts**
- claiming an item is in stock

If asked about price or availability it must say the studio will confirm
directly. These mirror the site-wide honesty rules — see `decorballoon-brand`.

Never relax these to make the bot sound more confident.

## Budget step

Budget options are **qualitative** ("Keep it simple", "Go all out"), never rupee
brackets. The client has published no pricing, so bracket options would be
inventing a rate card and anchoring the customer to a number nobody agreed to.

## Security

- `OPENAI_API_KEY` is server-only — never prefix it `NEXT_PUBLIC_`.
- Every field is Zod-validated and length-capped before reaching a model.
- The brief is passed as JSON data, not prose, so a visitor cannot easily
  restructure the instruction block.
- Rate limited per IP (`lib/rate-limit.ts`). In-memory and per-instance — swap
  for Redis behind the same interface if this is ever scaled horizontally.
- Provider errors are logged by shape only, never with the payload or the key.
