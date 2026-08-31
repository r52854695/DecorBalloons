import { occasions } from "@/data/occasions";
import { decorations, decorationsForOccasion } from "@/data/decorations";
import type { AIProvider, PlanBrief, Recommendation } from "./types";

/**
 * The no-API-key provider.
 *
 * This is deliberately NOT a stub that returns lorem ipsum. It is a real
 * rules engine over the same occasion and decoration data the rest of the site
 * renders, so the planner gives a genuinely useful, specific answer with zero
 * configuration — which matters because the most likely production state of
 * this site is "launched before anyone has bought an OpenAI key".
 *
 * It also guarantees the assistant degrades to something correct rather than
 * something broken if the model call fails.
 */

/** Maps loose free text onto a known occasion slug. */
function resolveOccasion(input?: string) {
  if (!input) return undefined;
  const q = input.toLowerCase();
  return (
    occasions.find((o) => q.includes(o.slug.replace(/-/g, " "))) ??
    occasions.find((o) => q.includes(o.name.toLowerCase())) ??
    occasions.find((o) => o.styles.some((s) => q.includes(s.toLowerCase())))
  );
}

/** Picks a palette word from whatever the visitor said about colour or style. */
function paletteWord(brief: PlanBrief): string | undefined {
  const src = `${brief.colours ?? ""} ${brief.style ?? ""} ${brief.theme ?? ""}`.toLowerCase();
  const known = [
    "pastel", "rose gold", "gold", "red", "white", "blue", "pink",
    "navy", "ivory", "champagne", "burgundy", "green", "purple",
  ];
  return known.find((k) => src.includes(k));
}

export class MockProvider implements AIProvider {
  readonly name = "mock" as const;

  async recommend(brief: PlanBrief): Promise<Recommendation> {
    const occasion = resolveOccasion(brief.occasion) ?? occasions[0];
    const candidates = decorationsForOccasion(occasion.slug);
    const pick = candidates[0] ?? decorations[0];
    const colour = paletteWord(brief);

    const titleColour = colour
      ? colour.replace(/\b\w/g, (c) => c.toUpperCase())
      : occasion.styles[0];

    // Merge the setup's contents with occasion-specific extras, de-duplicated.
    const includes = Array.from(
      new Set([...pick.includes.slice(0, 4), ...occasion.includes.slice(0, 3)]),
    ).slice(0, 6);

    const bits: string[] = [];
    if (brief.venue) {
      // The venue chips are phrases ("At home"), not nouns, so a blind
      // "at your ..." produces "at your at home" in a sentence the visitor
      // reads. Leave an answer that already carries a preposition alone.
      const venue = brief.venue.toLowerCase().trim();
      bits.push(/^(at|in|on)\b/.test(venue) ? venue : `at your ${venue}`);
    }
    if (brief.guests) bits.push(`for around ${brief.guests} guests`);
    const context = bits.length ? ` ${bits.join(", ")}` : "";

    const intro =
      `For a ${occasion.name.toLowerCase()}${context}, we would build around ` +
      `${pick.name.toLowerCase()}${colour ? ` in a ${colour} palette` : ""}. ` +
      occasion.tagline;

    // "Not sure yet" is a valid answer, so it must not be echoed back into a
    // sentence as though it were a value ("...to your Not sure yet range").
    const vague = (v?: string) => !v || /not sure|deciding|you decide|dunno/i.test(v);

    const notes: string[] = [];
    if (!vague(brief.date)) {
      notes.push(`We have your timing as ${brief.date!.toLowerCase()} — confirm the exact date and we will check availability.`);
    }
    if (!vague(brief.budget)) {
      notes.push(`We will scale the setup to match "${brief.budget!.toLowerCase()}".`);
    }
    if (occasion.slug === "proposal" || occasion.slug === "home-surprise") {
      notes.push("Tell us the arrival time and we will set up and be gone before then.");
    }

    return {
      title: `${titleColour} ${occasion.name} Setup`,
      intro,
      includes,
      note: notes.join(" ") || undefined,
      decorationSlug: pick.slug,
      source: "mock",
    };
  }
}
