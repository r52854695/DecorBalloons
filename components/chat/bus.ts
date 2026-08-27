/**
 * Tiny event bus for opening PartyPal from anywhere.
 *
 * The assistant lives in the root layout while the buttons that open it live
 * inside page sections, so there is no shared React ancestor to hold the state
 * without wrapping the entire app in a provider for one boolean. A DOM event
 * is the smaller, more honest tool for exactly this.
 */
const OPEN_EVENT = "partypal:open";

export type PartyPalOpenDetail = {
  /** Pre-selects an occasion when opened from an occasion page. */
  occasion?: string;
  /** Where the open came from, for analytics. */
  source?: string;
};

export function openPartyPal(detail: PartyPalOpenDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PartyPalOpenDetail>(OPEN_EVENT, { detail }));
}

export function onPartyPalOpen(handler: (detail: PartyPalOpenDetail) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<PartyPalOpenDetail>).detail ?? {});
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
