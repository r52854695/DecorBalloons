"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { business, whatsappHref } from "@/data/business";
import { occasions } from "@/data/occasions";
import { track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type Fields = {
  name: string;
  phone: string;
  occasion: string;
  date: string;
  location: string;
  budget: string;
  theme: string;
  message: string;
  company: string; // honeypot
};

const EMPTY: Fields = {
  name: "", phone: "", occasion: "", date: "",
  location: "", budget: "", theme: "", message: "", company: "",
};

const BUDGETS = ["Keep it simple", "Something in between", "Go all out", "Not sure yet"];

/**
 * Enquiry form.
 *
 * Two deliberate decisions:
 *
 * 1. Validation runs on the client for immediate feedback AND on the server in
 *    /api/lead. The client copy is a convenience, never the gate.
 *
 * 2. On success the visitor is handed a prefilled WhatsApp message containing
 *    everything they just typed. That is not a redundant extra CTA — until the
 *    client configures LEAD_WEBHOOK_URL, WhatsApp is the only delivery path
 *    that actually reaches the business, so the form guarantees the enquiry
 *    arrives rather than quietly dropping it into a server log.
 */
export function LeadForm({
  defaultOccasion,
  setup,
}: {
  defaultOccasion?: string;
  /**
   * A setup the visitor clicked in the catalogue. Carried through so the
   * enquiry does not start blank after they picked something specific — the
   * card links here with `?setup=`, and arriving at an empty form would lose
   * everything they just told us by clicking.
   */
  setup?: { name: string; price: string };
}) {
  const [fields, setFields] = useState<Fields>({
    ...EMPTY,
    occasion: defaultOccasion ?? "",
    message: setup ? `I'm interested in the ${setup.name} (${setup.price}).` : "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [started, setStarted] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!started) {
      setStarted(true);
      track("lead_form_started");
    }
    setFields((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  /** Returns the errors it found, so the caller can act on them immediately. */
  const validate = () => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (fields.name.trim().length < 2) next.name = "Please tell us your name";
    const phone = fields.phone.replace(/[\s-]/g, "");
    if (!/^(\+?91)?[6-9]\d{9}$/.test(phone)) {
      next.phone = "Enter a valid 10-digit Indian mobile number";
    }
    setErrors(next);
    return next;
  };

  const summary = () =>
    [
      `Hi ${business.name}, I'd like to plan a celebration.`,
      "",
      `Name: ${fields.name}`,
      `Phone: ${fields.phone}`,
      fields.occasion && `Occasion: ${fields.occasion}`,
      fields.date && `Date: ${fields.date}`,
      fields.location && `Location: ${fields.location}`,
      fields.budget && `Scale: ${fields.budget}`,
      fields.theme && `Theme / colours: ${fields.theme}`,
      fields.message && `Notes: ${fields.message}`,
    ]
      .filter(Boolean)
      .join("\n");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    const firstInvalid = (["name", "phone"] as const).find((k) => found[k]);
    if (firstInvalid) {
      /*
       * Focus by id, taken from the validation result — not by querying for
       * [aria-invalid="true"]. setErrors above is asynchronous, so at this
       * point React has not committed the attribute yet and the query matched
       * nothing: the form announced errors but left focus on the submit
       * button, which is exactly the case a keyboard or screen-reader user
       * depends on.
       */
      document.getElementById(`lf-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
    } catch {
      // Swallowed on purpose — the WhatsApp handoff below is the real
      // delivery guarantee, and an error here must not block it.
    }
    track("lead_form_submitted", { occasion: fields.occasion || "unspecified" });
    setStatus("done");
  };

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[6px] border border-rose/30 bg-rose-wash p-8 text-center"
        role="status"
      >
        <p aria-hidden="true" className="text-3xl">🎈</p>
        <h3 className="mt-3 font-display text-2xl text-ink">Thank you, {fields.name.split(" ")[0]}.</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.92rem] leading-relaxed text-ink-muted">
          We have your details. To reach us fastest — and so nothing gets lost —
          send the same brief over on WhatsApp and we will reply there.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <a
            href={whatsappHref(summary())}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_clicked", { source: "lead_form_success" })}
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-rose"
          >
            Send on WhatsApp
            <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setFields({ ...EMPTY, occasion: defaultOccasion ?? "" });
              setStatus("idle");
              setStarted(false);
            }}
            className="link-draw text-[0.78rem] text-ink-muted"
          >
            Send another enquiry
          </button>
        </div>
      </motion.div>
    );
  }

  const field =
    "w-full border-b border-ink/20 bg-transparent px-0 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-faint focus:border-rose-deep focus:outline-none transition-colors";
  const labelCls = "block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-muted";

  return (
    <>
      {setup && (
        <p className="mb-5 rounded-[6px] border border-sand bg-cream/60 px-4 py-3 text-[0.86rem] text-ink">
          Enquiring about <strong className="font-semibold">{setup.name}</strong>
          <span className="text-ink-muted"> — from {setup.price}</span>
        </p>
      )}
    <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      {/* Honeypot: visually and semantically hidden from real users. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" value={fields.company} onChange={set("company")} />
      </div>

      <div>
        <label htmlFor="lf-name" className={labelCls}>
          Your name <span className="text-rose-deep">*</span>
        </label>
        <input
          id="lf-name"
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={set("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "lf-name-err" : undefined}
          className={cn(field, errors.name && "border-occ-proposal")}
          placeholder="Priya Sharma"
        />
        {errors.name && (
          <p id="lf-name-err" className="mt-1.5 text-[0.76rem] text-occ-proposal">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="lf-phone" className={labelCls}>
          Phone / WhatsApp <span className="text-rose-deep">*</span>
        </label>
        <input
          id="lf-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={fields.phone}
          onChange={set("phone")}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "lf-phone-err" : undefined}
          className={cn(field, errors.phone && "border-occ-proposal")}
          placeholder="98765 43210"
        />
        {errors.phone && (
          <p id="lf-phone-err" className="mt-1.5 text-[0.76rem] text-occ-proposal">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="lf-occasion" className={labelCls}>Occasion</label>
        <select id="lf-occasion" name="occasion" value={fields.occasion} onChange={set("occasion")} className={cn(field, "cursor-pointer")}>
          <option value="">Select an occasion</option>
          {occasions.map((o) => (
            <option key={o.slug} value={o.name}>{o.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lf-date" className={labelCls}>Event date</label>
        <input id="lf-date" name="date" type="date" value={fields.date} onChange={set("date")} className={cn(field, "cursor-pointer")} />
      </div>

      <div>
        <label htmlFor="lf-location" className={labelCls}>Location</label>
        <input
          id="lf-location"
          name="location"
          value={fields.location}
          onChange={set("location")}
          className={field}
          placeholder={`Area in ${business.city}`}
        />
      </div>

      <div>
        <label htmlFor="lf-budget" className={labelCls}>Scale</label>
        <select id="lf-budget" name="budget" value={fields.budget} onChange={set("budget")} className={cn(field, "cursor-pointer")}>
          <option value="">Select a scale</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="lf-theme" className={labelCls}>Theme or colours</label>
        <input
          id="lf-theme"
          name="theme"
          value={fields.theme}
          onChange={set("theme")}
          className={field}
          placeholder="Pastel, rose gold, jungle theme…"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="lf-message" className={labelCls}>Anything else?</label>
        <textarea
          id="lf-message"
          name="message"
          rows={3}
          value={fields.message}
          onChange={set("message")}
          className={cn(field, "resize-none")}
          placeholder="Tell us about the room, the timing, or how you imagine it."
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-4 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-ink-soft disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Sending…" : "Get my decoration plan"}
          <span aria-hidden="true">→</span>
        </button>
        <p className="mt-3 text-[0.76rem] text-ink-faint">
          We reply on WhatsApp or by phone. Your details are only used to plan
          your celebration.
        </p>
      </div>
    </form>
    </>
  );
}
