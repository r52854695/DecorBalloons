import Link from "next/link";
import { cn } from "@/lib/utils";
import { TextReveal, type RevealLine } from "@/components/motion/TextReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

/**
 * Shared section header so every section on the site opens the same way:
 * a rose-gold eyebrow, an editorial display heading, and an optional lead.
 */
export function SectionHeading({
  eyebrow,
  lines,
  lead,
  link,
  align = "left",
  tone = "ink",
  as = "h2",
  className,
}: {
  eyebrow?: string;
  lines: RevealLine[];
  lead?: string;
  link?: { href: string; label: string };
  align?: "left" | "center";
  tone?: "ink" | "ivory";
  as?: "h1" | "h2";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered && "items-center text-center",
        link && !centered && "md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <div className={cn(centered ? "max-w-2xl" : "max-w-3xl")}>
        {eyebrow && (
          <ScrollReveal variant="fadeUp" as="p">
            <span
              className={cn(
                "eyebrow flex items-center gap-3",
                centered && "justify-center",
                tone === "ivory" && "text-rose-light",
              )}
            >
              <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-50" />
              {eyebrow}
            </span>
          </ScrollReveal>
        )}

        <TextReveal
          as={as}
          lines={lines}
          className={cn(
            "mt-4 font-display text-display",
            tone === "ink" ? "text-ink" : "text-ivory",
          )}
        />

        {lead && (
          <ScrollReveal variant="fadeUp" delay={0.12} as="p">
            <span
              className={cn(
                "mt-5 block text-lead",
                tone === "ink" ? "text-ink-muted" : "text-ivory/70",
              )}
            >
              {lead}
            </span>
          </ScrollReveal>
        )}
      </div>

      {link && (
        <ScrollReveal variant="fadeUp" delay={0.18} className={cn("shrink-0", centered && "mt-2")}>
          <Link
            href={link.href}
            className={cn(
              "link-draw inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em]",
              tone === "ink" ? "text-ink" : "text-ivory",
            )}
          >
            {link.label}
            <span aria-hidden="true">→</span>
          </Link>
        </ScrollReveal>
      )}
    </div>
  );
}
