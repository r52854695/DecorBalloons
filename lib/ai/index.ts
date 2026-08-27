import { MockProvider } from "./mock";
import { OpenAIProvider } from "./openai";
import type { AIProvider } from "./types";

/**
 * Provider selection.
 *
 * `OPENAI_API_KEY` is intentionally NOT prefixed with NEXT_PUBLIC_, so it is
 * only ever readable on the server. This module must never be imported from a
 * client component; the chat UI talks to /api/chat instead.
 */
export function getProvider(): AIProvider {
  const key = process.env.OPENAI_API_KEY;
  if (key && key.trim().length > 0) return new OpenAIProvider(key.trim());
  return new MockProvider();
}

export type { AIProvider, PlanBrief, Recommendation } from "./types";
export { planBriefSchema } from "./types";
