"use client";

import { motion } from "motion/react";
import { business, whatsappHref } from "@/data/business";
import { track } from "@/lib/analytics/events";
import { useMotionBudget } from "@/components/motion/useMotionBudget";

/**
 * Floating WhatsApp action. Sits directly above the PartyPal trigger in the
 * same bottom-right stack; the offsets in both components are coordinated so
 * they never overlap, and both clear the mobile sticky CTA bar.
 */
export function WhatsAppButton({ context }: { context?: string }) {
  const { reduced } = useMotionBudget();

  const message = context
    ? `Hi ${business.name}, I'd like to plan a ${context} in ${business.city}.`
    : undefined;

  return (
    <motion.a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_clicked", { source: "floating", context: context ?? "general" })}
      aria-label="Chat with us on WhatsApp"
      initial={reduced ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-4 bottom-[7.6rem] z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-[var(--shadow-raise)] md:right-6 md:bottom-[7.2rem]"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true" focusable="false">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21z" />
      </svg>
    </motion.a>
  );
}
