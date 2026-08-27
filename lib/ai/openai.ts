import { occasions } from "@/data/occasions";
import { decorations } from "@/data/decorations";
import { business } from "@/data/business";
import { MockProvider } from "./mock";
import type { AIProvider, PlanBrief, Recommendation } from "./types";

/**
 * OpenAI-backed recommendations.
 *
 * Uses plain fetch rather than the SDK — one HTTP call does not justify a
 * dependency, and it keeps the bundle and the audit surface small.
 *
 * Three deliberate safety properties:
 *  1. The key is read from a server-only env var and never leaves this module.
 *  2. The model is constrained to the studio's real catalogue and explicitly
 *     forbidden from inventing prices, timings or guarantees — the same rule
 *     the rest of the site follows.
 *  3. Any failure (network, quota, malformed JSON) falls back to MockProvider
 *     rather than showing the visitor an error. A planner that always answers
 *     is worth more than one that is occasionally cleverer.
 */

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const TIMEOUT_MS = 12_000;

function systemPrompt(): string {
  const occasionList = occasions.map((o) => `${o.slug} (${o.name})`).join(", ");
  const decorationList = decorations.map((d) => `${d.slug} (${d.name})`).join(", ");

  return [
    `You are Party Pal, the celebration planner for ${business.name}, a balloon and event decoration studio in ${business.city}, ${business.state}, India.`,
    `Recommend ONE decoration setup based on the customer's brief.`,
    ``,
    `Only recommend from these occasions: ${occasionList}.`,
    `Only reference these setups: ${decorationList}.`,
    ``,
    `HARD RULES — these exist because the business has not published this information and stating it would be a lie:`,
    `- NEVER state or estimate a price, a discount, or a currency amount.`,
    `- NEVER promise a setup duration, an arrival time, or same-day availability.`,
    `- NEVER invent reviews, ratings, awards, or numbers of customers served.`,
    `- NEVER claim a specific item is in stock.`,
    `- If the customer asks about price or availability, say the studio will confirm it directly.`,
    ``,
    `Write warmly and concretely in British-Indian English. Keep "intro" to two sentences at most.`,
    `Respond with ONLY a JSON object of this exact shape:`,
    `{"title":string,"intro":string,"includes":string[4-6],"note":string,"decorationSlug":string}`,
  ].join("\n");
}

export class OpenAIProvider implements AIProvider {
  readonly name = "openai" as const;

  constructor(private readonly apiKey: string) {}

  async recommend(brief: PlanBrief): Promise<Recommendation> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.7,
          max_tokens: 500,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt() },
            {
              role: "user",
              // The brief is passed as data, not prose, so a visitor cannot
              // easily restructure the instruction block above.
              content: `Customer brief (JSON):\n${JSON.stringify(brief)}`,
            },
          ],
        }),
      });

      if (!res.ok) throw new Error(`OpenAI responded ${res.status}`);

      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content;
      if (typeof raw !== "string") throw new Error("No content in OpenAI response");

      const parsed = JSON.parse(raw) as Partial<Recommendation>;
      if (!parsed.title || !Array.isArray(parsed.includes) || parsed.includes.length === 0) {
        throw new Error("OpenAI response missing required fields");
      }

      return {
        title: String(parsed.title).slice(0, 90),
        intro: String(parsed.intro ?? "").slice(0, 400),
        includes: parsed.includes.slice(0, 6).map((s) => String(s).slice(0, 120)),
        note: parsed.note ? String(parsed.note).slice(0, 300) : undefined,
        decorationSlug: decorations.some((d) => d.slug === parsed.decorationSlug)
          ? parsed.decorationSlug
          : undefined,
        source: "openai",
      };
    } catch (err) {
      // Never surface provider errors to the visitor; degrade to the rules
      // engine, which is always able to answer.
      console.error(
        "[party-pal] OpenAI provider failed, falling back to mock:",
        err instanceof Error ? err.message : "unknown error",
      );
      return new MockProvider().recommend(brief);
    } finally {
      clearTimeout(timeout);
    }
  }
}
