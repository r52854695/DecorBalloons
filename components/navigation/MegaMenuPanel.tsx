"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MegaMenuPreview } from "./MegaMenuPreview";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { openPartyPal } from "@/components/chat/bus";
import { track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import type { MegaItem, MegaMenu } from "@/data/mega-menu";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One open drawer: link columns on the left, the live photo preview on the
 * right. Roughly a 50/50 split, with the columns sharing their half.
 *
 * Hovering or focusing a link changes the preview — focus as well as hover, so
 * a keyboard user gets the same experience rather than a static image.
 */
export function MegaMenuPanel({
  menu,
  activeItem,
  onPreview,
  onClose,
}: {
  menu: MegaMenu;
  activeItem: MegaItem;
  onPreview: (item: MegaItem) => void;
  onClose: () => void;
}) {
  const { reduced } = useMotionBudget();

  const column = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, ease: EASE, delay: 0.05 + i * 0.05 },
        };

  const renderItem = (item: MegaItem) => {
    const isActive = item.label === activeItem.label;
    const inner = (
      <>
        <span className="relative">
          {item.label}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -bottom-0.5 left-0 h-px bg-[var(--accent)] transition-[width] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isActive ? "w-full" : "w-0",
            )}
          />
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "text-[0.7rem] transition-all duration-300",
            isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
          )}
        >
          ↗
        </span>
      </>
    );

    const classes = cn(
      "group flex w-full items-center justify-between gap-3 py-[0.42rem] text-left text-[0.92rem] transition-colors duration-200",
      isActive ? "text-ink" : "text-ink-muted hover:text-ink",
    );
    const style = { "--accent": `var(--color-${item.accent})` } as React.CSSProperties;

    // "Talk to Party Pal" opens the assistant rather than navigating, so it is
    // a button. Everything else is a real, crawlable link.
    if (item.action === "partypal") {
      return (
        <button
          type="button"
          style={style}
          className={classes}
          onMouseEnter={() => onPreview(item)}
          onFocus={() => onPreview(item)}
          onClick={() => {
            track("chat_opened", { source: "mega_menu" });
            openPartyPal({ source: "mega_menu" });
            onClose();
          }}
        >
          {inner}
        </button>
      );
    }

    return (
      <Link
        href={item.href!}
        style={style}
        className={classes}
        onMouseEnter={() => onPreview(item)}
        onFocus={() => onPreview(item)}
        onClick={onClose}
      >
        {inner}
      </Link>
    );
  };

  return (
    <div className="shell-wide py-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        {/* link columns */}
        <div className="grid gap-8 sm:grid-cols-3">
          {menu.columns.map((col, i) => (
            <motion.div key={col.heading} {...column(i)}>
              <h3 className="eyebrow">{col.heading}</h3>
              <ul className="mt-3.5 border-t border-sand pt-1.5">
                {col.items.map((item) => (
                  <li key={item.label}>{renderItem(item)}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* feature preview */}
        <motion.div {...column(3)} className="hidden lg:block">
          <MegaMenuPreview item={activeItem} eyebrow={menu.featureEyebrow} />
        </motion.div>
      </div>

      <motion.div
        {...column(4)}
        className="mt-7 flex items-center justify-between border-t border-sand pt-5"
      >
        <p className="text-[0.8rem] text-ink-faint">
          Not sure what you need? Tell us the occasion and we will suggest it.
        </p>
        <Link
          href={menu.href}
          onClick={onClose}
          className="link-draw text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-ink"
        >
          View all {menu.label.toLowerCase()} →
        </Link>
      </motion.div>
    </div>
  );
}
