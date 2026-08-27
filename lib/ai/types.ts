import { z } from "zod";

/**
 * The structured brief Party Pal collects. Every field is optional because a
 * visitor is allowed to bail out at any point and still get a useful answer —
 * an enquiry with only "birthday" in it is worth more than no enquiry.
 */
export const planBriefSchema = z.object({
  occasion: z.string().max(60).optional(),
  date: z.string().max(60).optional(),
  venue: z.string().max(80).optional(),
  guests: z.string().max(40).optional(),
  budget: z.string().max(40).optional(),
  colours: z.string().max(80).optional(),
  theme: z.string().max(80).optional(),
  style: z.string().max(60).optional(),
  /** Anything the visitor typed freely. Capped hard — it reaches a model. */
  notes: z.string().max(600).optional(),
});

export type PlanBrief = z.infer<typeof planBriefSchema>;

export type Recommendation = {
  /** e.g. "Pastel Birthday Setup" */
  title: string;
  /** One or two sentences of reasoning. */
  intro: string;
  /** Bulleted contents of the suggested setup. */
  includes: string[];
  /** Optional practical note (timing, venue, safety). */
  note?: string;
  /** Which decoration slug this maps to, for a "see details" link. */
  decorationSlug?: string;
  /** Which provider produced this, surfaced in dev only. */
  source: "openai" | "mock";
};

export interface AIProvider {
  readonly name: "openai" | "mock";
  recommend(brief: PlanBrief): Promise<Recommendation>;
}
