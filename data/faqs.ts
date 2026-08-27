import { business } from "./business";

export type Faq = {
  q: string;
  a: string;
  /** Limits the FAQ to one occasion page; undefined = shows everywhere. */
  occasion?: string;
};

/**
 * Answers are deliberately written so that none of them asserts a fact the
 * client has not confirmed — no fixed prices, no turnaround guarantees, no
 * team size, no delivery radius. Where a real answer depends on the client,
 * the copy routes the visitor to a conversation instead of inventing one.
 */
export const faqs: Faq[] = [
  {
    q: "Which areas of Patna do you cover?",
    a: `We work across ${business.city} — including ${business.serviceAreas
      .slice(0, 6)
      .join(", ")} and the surrounding areas. If you are just outside the city, send us the location and we will confirm whether we can reach you.`,
  },
  {
    q: "How much does a balloon decoration cost?",
    a: "It depends on the size of the setup, the balloon count, the venue and whether you want extras like lighting, florals or personalised lettering. Rather than quote a number that turns out to be wrong, we look at what you actually want and send a clear quote. Share your occasion, date and rough budget and we will come back with options.",
  },
  {
    q: "How far in advance should I book?",
    a: "Earlier is always safer, especially for weekends and festival dates when several setups run on the same day. That said, short-notice and same-day surprises are often possible — message us with the date and we will tell you straight away whether it can be done.",
  },
  {
    q: "Do you decorate at home, or only at halls?",
    a: "Both. A large share of what we do is inside homes — living rooms, bedrooms, doorways and terraces — alongside banquet halls, hotels, offices and shop frontages. Home setups are planned around your space and the time window you give us.",
  },
  {
    q: "Can you keep it a surprise?",
    a: "Yes, and it is one of the things we plan around most carefully. Tell us when the room will be free and when the person is expected back. We work to that window, keep the setup quiet, and are finished and gone before they arrive.",
  },
  {
    q: "Can you match a specific colour or theme?",
    a: "Yes. Send a reference photo, a colour, or even just the outfit or cake you are planning around, and we will build the palette to match. For kids parties we carry a single theme through the backdrop, props, garland and cake table.",
  },
  {
    q: "Who sets it up and who clears it away?",
    a: "Our team handles the full installation, brings the materials, and fixes everything safely in place. Tell us at the time of booking whether you also want us to return and clear the setup afterwards, and we will include it in the quote.",
  },
  {
    q: "Are the balloons safe around small children?",
    a: "We place balloon work clear of where children play and run, keep small parts and fixings out of reach, and anchor free-standing pieces on weighted bases so they cannot be pulled over. If very young children will be present, mention it when you book so we plan the placement accordingly.",
  },
  {
    q: "How do I book?",
    a: `Message us on WhatsApp or call ${business.city.length ? "us" : "us"} directly — that is the fastest route. You can also use the planner on this site to put together your requirement first, and we will pick it up from there.`,
  },
  {
    q: "Do you do outdoor and terrace setups?",
    a: "Yes. Terraces and rooftops are popular for proposals and anniversary dinners. Wind and weather change what holds up outdoors, so we adjust the build and anchoring for it — mention that it is an outdoor setup when you enquire.",
  },

  /* ── Occasion-specific ── */
  {
    q: "Can you do a midnight birthday surprise?",
    a: "Yes — midnight setups are one of the most common birthday requests. We agree an arrival window with you in advance so the room is ready before the clock turns.",
    occasion: "birthday",
  },
  {
    q: "Can you add the baby name to the decoration?",
    a: "Yes. Name lettering is a standard part of baby shower, welcome-baby and Annaprashan setups. Send us the exact spelling when you book so it is prepared before we arrive.",
    occasion: "baby-shower",
  },
  {
    q: "Do you help plan how the proposal moment unfolds?",
    a: "We plan the setup around the reveal — where they will be standing, what they see first, and how the space is lit. Tell us how you imagine the moment and we will build the decoration to support it.",
    occasion: "proposal",
  },
  {
    q: "Can you decorate the stage and the entrance for a wedding function?",
    a: "Yes. Entrance arches, stage backdrops and photo corners are usually planned together so the palette carries through the whole venue. Share your venue and guest numbers and we will scale it appropriately.",
    occasion: "wedding",
  },
  {
    q: "Do you decorate for Annaprashan at home?",
    a: "Yes. Annaprashan setups at home usually centre on the ceremony seating, a name backdrop for the baby and a family photo corner, styled so everyone can gather into the frame.",
    occasion: "annaprashan",
  },
];

export const generalFaqs = faqs.filter((f) => !f.occasion);
export const faqsForOccasion = (slug: string) => [
  ...faqs.filter((f) => f.occasion === slug),
  ...generalFaqs.slice(0, 4),
];
