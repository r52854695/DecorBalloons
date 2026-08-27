"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { business, whatsappHref } from "@/data/business";
import { track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { onPartyPalOpen } from "./bus";
import type { PlanBrief, Recommendation } from "@/lib/ai/types";

/* ── conversation script ───────────────────────────────────── */

type Step = {
  key: keyof PlanBrief;
  question: string;
  chips: string[];
  /** Allows a free-text answer in addition to the chips. */
  freeText?: boolean;
  placeholder?: string;
};

/**
 * Note on the budget step: the options are qualitative, never rupee amounts.
 * The client has published no pricing, so offering "₹2,000–5,000" brackets
 * would be inventing a rate card — and anchoring a customer to a number the
 * studio never agreed to is worse than asking nothing at all.
 */
const STEPS: Step[] = [
  {
    key: "occasion",
    question: "Hey! 🎉 Let's plan something unforgettable. What are we celebrating?",
    chips: ["🎂 Birthday", "💍 Anniversary", "👶 Baby Shower", "❤️ Proposal", "🎉 Something else"],
    freeText: true,
    placeholder: "Or type the occasion…",
  },
  {
    key: "date",
    question: "Lovely. When is it happening?",
    chips: ["In a few days", "This month", "Next month", "Still deciding"],
    freeText: true,
    placeholder: "Or type a date…",
  },
  {
    key: "venue",
    question: "Where should we set up?",
    chips: ["At home", "Terrace or rooftop", "Banquet hall", "Office or shop", "Hotel room"],
    freeText: true,
    placeholder: "Or describe the place…",
  },
  {
    key: "guests",
    question: "Roughly how many people?",
    chips: ["Just the two of us", "Under 20", "20 to 50", "More than 50"],
  },
  {
    key: "budget",
    question: "What scale are you thinking? We'll send exact pricing once we know the details.",
    chips: ["Keep it simple", "Something in between", "Go all out", "Not sure yet"],
  },
  {
    key: "colours",
    question: "Last one — any colours or a theme in mind?",
    chips: ["Pastel", "Rose gold", "Red & white", "Bright and bold", "You decide"],
    freeText: true,
    placeholder: "Or describe the look…",
  },
];

type Msg = { id: string; from: "bot" | "user"; text: string };

/* ── component ─────────────────────────────────────────────── */

export function PartyPal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<PlanBrief>({});
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { reduced } = useMotionBudget();

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const say = useCallback(
    (text: string, delay = 480) => {
      setTyping(true);
      const t = setTimeout(
        () => {
          setTyping(false);
          setMessages((m) => [...m, { id: `b${Date.now()}${m.length}`, from: "bot", text }]);
        },
        reduced ? 120 : delay,
      );
      timers.current.push(t);
    },
    [reduced],
  );

  /* open / close ------------------------------------------------ */

  const openPanel = useCallback(
    (source = "floating") => {
      setOpen(true);
      track("chat_opened", { source });
      if (messages.length === 0) say(STEPS[0].question, 380);
    },
    [messages.length, say],
  );

  const closePanel = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Allow any section on the page to open the assistant.
  useEffect(() => onPartyPalOpen(() => openPanel("promo_section")), [openPanel]);

  // Escape closes; focus moves into the panel on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
      if (e.key !== "Tab" || !panelRef.current) return;

      // Simple focus trap so keyboard users cannot tab out behind the overlay.
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, closePanel]);

  // Lock background scroll only where the panel is full-screen.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(max-width: 640px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, typing, result, reduced]);

  /* answering --------------------------------------------------- */

  const submitPlan = useCallback(
    async (finalBrief: PlanBrief) => {
      setTyping(true);
      setError(null);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalBrief),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Request failed");
        setTyping(false);
        setResult(data.recommendation as Recommendation);
        track("chat_completed", { occasion: finalBrief.occasion ?? "unknown" });
      } catch {
        setTyping(false);
        setError(
          "I could not put the plan together just now — but send us your details on WhatsApp and we will do it by hand.",
        );
      }
    },
    [],
  );

  const answer = useCallback(
    (value: string) => {
      const clean = value.trim();
      if (!clean) return;

      const current = STEPS[step];
      setMessages((m) => [...m, { id: `u${Date.now()}${m.length}`, from: "user", text: clean }]);
      setDraft("");

      // Strip the leading emoji from chip labels before storing.
      const stored = clean.replace(/^[^\p{L}\p{N}]+/u, "").trim();
      const next: PlanBrief = { ...brief, [current.key]: stored };
      setBrief(next);

      if (step + 1 < STEPS.length) {
        setStep(step + 1);
        say(STEPS[step + 1].question);
      } else {
        say("Perfect — putting your plan together now…", 300);
        const t = setTimeout(() => void submitPlan(next), reduced ? 200 : 900);
        timers.current.push(t);
      }
    },
    [brief, step, say, submitPlan, reduced],
  );

  const restart = () => {
    clearTimers();
    setStep(0);
    setBrief({});
    setMessages([]);
    setResult(null);
    setError(null);
    setDraft("");
    say(STEPS[0].question, 260);
  };

  /* handoff ----------------------------------------------------- */

  const briefLines = () =>
    (Object.entries(brief) as [keyof PlanBrief, string][])
      .filter(([, v]) => v)
      .map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${v}`)
      .join("\n");

  const handoffHref = whatsappHref(
    [
      `Hi ${business.name}, I planned this with Party Pal:`,
      "",
      briefLines(),
      result ? `\nSuggested setup: ${result.title}` : "",
      "\nCould you send me a quote?",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const current = STEPS[step];
  const done = result !== null || error !== null;

  /* render ------------------------------------------------------ */

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-expanded={open}
        aria-haspopup="dialog"
        initial={reduced ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed right-4 bottom-[4.4rem] z-40 flex items-center gap-2.5 rounded-full bg-ink py-3 pl-4 pr-5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ivory shadow-[var(--shadow-raise)] transition-colors hover:bg-ink-soft md:right-6 md:bottom-6"
      >
        <motion.span
          aria-hidden="true"
          className="text-base leading-none"
          animate={reduced || open ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          🎈
        </motion.span>
        {open ? "Close" : "Plan my party"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* scrim, phones only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm sm:hidden"
              aria-hidden="true"
            />

            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="partypal-title"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 flex h-[86svh] flex-col overflow-hidden rounded-t-2xl border border-sand bg-ivory shadow-[var(--shadow-float)] outline-none sm:inset-x-auto sm:right-6 sm:bottom-[7.5rem] sm:h-[min(34rem,72svh)] sm:w-[24rem] sm:rounded-2xl"
            >
              {/* header */}
              <div className="flex shrink-0 items-center gap-3 border-b border-sand bg-paper px-4 py-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-base"
                >
                  🎈
                </span>
                <div className="flex-1">
                  <p id="partypal-title" className="text-[0.86rem] font-semibold text-ink">
                    Party Pal
                  </p>
                  <p className="text-[0.7rem] text-ink-faint">Your celebration planner</p>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close planner"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <span aria-hidden="true" className="text-lg leading-none">
                    ×
                  </span>
                </button>
              </div>

              {/* progress */}
              {!done && (
                <div className="h-0.5 shrink-0 bg-sand" aria-hidden="true">
                  <div
                    className="h-full bg-rose-deep transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ width: `${(step / STEPS.length) * 100}%` }}
                  />
                </div>
              )}

              {/* log */}
              <div
                ref={logRef}
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
                role="log"
                aria-live="polite"
                aria-label="Conversation with Party Pal"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[0.85rem] leading-relaxed",
                      m.from === "bot"
                        ? "rounded-tl-sm bg-cream text-ink-soft"
                        : "ml-auto rounded-tr-sm bg-ink text-ivory",
                    )}
                  >
                    {m.text}
                  </div>
                ))}

                {typing && (
                  <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-tl-sm bg-cream px-3.5 py-3">
                    <span className="sr-only">Party Pal is typing</span>
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        aria-hidden="true"
                        className="block h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                )}

                {result && (
                  <div className="rounded-2xl rounded-tl-sm border border-rose/30 bg-rose-wash p-4">
                    <p className="eyebrow">Suggested setup</p>
                    <h3 className="mt-1.5 font-display text-xl text-ink">{result.title}</h3>
                    <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-soft">
                      {result.intro}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {result.includes.map((inc) => (
                        <li key={inc} className="flex gap-2.5 text-[0.82rem] text-ink-soft">
                          <span aria-hidden="true" className="mt-[0.5em] block h-1 w-1 shrink-0 rounded-full bg-rose-deep" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                    {result.note && (
                      <p className="mt-3 border-t border-rose/25 pt-2.5 text-[0.78rem] leading-relaxed text-ink-muted">
                        {result.note}
                      </p>
                    )}
                    <p className="mt-3 text-[0.72rem] text-ink-faint">
                      A suggestion to start from — we will confirm the details and
                      pricing with you directly.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl rounded-tl-sm border border-sand bg-cream p-4 text-[0.84rem] leading-relaxed text-ink-soft">
                    {error}
                  </div>
                )}
              </div>

              {/* composer */}
              <div className="shrink-0 border-t border-sand bg-paper px-4 py-3.5">
                {done ? (
                  <div className="space-y-2.5">
                    <a
                      href={handoffHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("whatsapp_clicked", { source: "party_pal_result" })}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-deep px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-rose"
                    >
                      Get my decoration plan
                      <span aria-hidden="true">→</span>
                    </a>
                    <div className="flex gap-2">
                      <Link
                        href="/contact"
                        onClick={closePanel}
                        className="flex-1 rounded-full border border-ink/18 px-4 py-2.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink/5"
                      >
                        Use the form
                      </Link>
                      <button
                        type="button"
                        onClick={restart}
                        className="rounded-full border border-ink/18 px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
                      >
                        Start over
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-1.5">
                      {current.chips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => answer(chip)}
                          disabled={typing}
                          className="rounded-full border border-ink/15 bg-ivory px-3 py-1.5 text-[0.76rem] text-ink-soft transition-colors hover:border-rose hover:bg-rose-wash hover:text-ink disabled:opacity-50"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {current.freeText && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          answer(draft);
                        }}
                        className="mt-2.5 flex gap-2"
                      >
                        <label htmlFor="partypal-input" className="sr-only">
                          {current.question}
                        </label>
                        <input
                          id="partypal-input"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder={current.placeholder}
                          maxLength={120}
                          disabled={typing}
                          className="min-w-0 flex-1 rounded-full border border-ink/15 bg-ivory px-4 py-2 text-[0.82rem] text-ink placeholder:text-ink-faint focus:border-rose focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={typing || !draft.trim()}
                          aria-label="Send"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-ivory transition-opacity disabled:opacity-40"
                        >
                          <span aria-hidden="true">↑</span>
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
