/**
 * ─────────────────────────────────────────────────────────────
 *  ⚠  NO VERIFIED CUSTOMER REVIEWS HAVE BEEN SUPPLIED.
 *
 *  `testimonials` is intentionally EMPTY. Publishing invented
 *  reviews on a local business site is both dishonest and a
 *  Google review-spam policy violation that can get a business
 *  profile suppressed — so nothing is fabricated here.
 *
 *  TO GO LIVE WITH REAL REVIEWS:
 *    1. Paste genuine ones into `testimonials` below.
 *    2. Review JSON-LD then emits automatically (lib/seo/schema.ts).
 *    3. AggregateRating stays OFF until `verifiedAggregate` is set
 *       with a real count and average from a real review platform.
 *
 *  TO PREVIEW THE CAROUSEL DESIGN (client demo only):
 *    set NEXT_PUBLIC_SHOW_SAMPLE_REVIEWS=true — sample cards then
 *    render with a permanent "SAMPLE" ribbon and are still excluded
 *    from all structured data.
 * ─────────────────────────────────────────────────────────────
 */

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  /** Locality within Patna, if the customer is happy to be named. */
  location: string;
  occasion: string;
  /** Only set for reviews the client has actually collected. */
  rating?: number;
  /** Where the review came from — needed for honest Review schema. */
  source?: "google" | "whatsapp" | "instagram" | "direct";
  date?: string;
};

/** Real, client-supplied reviews. Empty until the client provides them. */
export const testimonials: Testimonial[] = [];

/**
 * Verified aggregate rating from a real platform. MUST stay null until the
 * client supplies a genuine count + average, because AggregateRating schema
 * built on invented numbers is exactly what Google penalises.
 */
export const verifiedAggregate: { ratingValue: number; reviewCount: number } | null = null;

/**
 * Design-preview content only. Obviously illustrative rather than
 * plausible-looking, and never emitted into structured data.
 */
export const sampleTestimonials: Testimonial[] = [
  {
    id: "sample-1",
    quote:
      "This is sample text showing how a customer review will appear once real reviews are collected. Replace it in data/testimonials.ts.",
    author: "Sample Review",
    location: "Patna",
    occasion: "Birthday",
  },
  {
    id: "sample-2",
    quote:
      "A second placeholder card, here only so the layout, carousel and spacing can be checked before genuine reviews are added.",
    author: "Sample Review",
    location: "Patna",
    occasion: "Anniversary",
  },
  {
    id: "sample-3",
    quote:
      "Placeholder copy for the third slide. No real customer said this — it exists purely to preview the design.",
    author: "Sample Review",
    location: "Patna",
    occasion: "Baby Shower",
  },
];

export const showSampleReviews =
  process.env.NEXT_PUBLIC_SHOW_SAMPLE_REVIEWS === "true";

/** What the reviews section should actually render. */
export const displayTestimonials: Testimonial[] =
  testimonials.length > 0 ? testimonials : showSampleReviews ? sampleTestimonials : [];

/** True only when the rendered cards are placeholders. */
export const displayingSamples =
  testimonials.length === 0 && displayTestimonials.length > 0;
