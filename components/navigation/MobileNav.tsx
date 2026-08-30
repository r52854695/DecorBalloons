"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InstallApp } from "@/components/pwa/InstallApp";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { openPartyPal } from "@/components/chat/bus";
import { track } from "@/lib/analytics/events";
import { megaMenus } from "@/data/mega-menu";
import { business, formatPhone, telHref } from "@/data/business";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Mobile navigation: an accordion, not the desktop drawer shrunk down.
 *
 * Hover has no meaning here and a three-column drawer cannot survive 375px, so
 * this is a separate component rather than a responsive variant. Sections
 * expand one at a time; thumbnails mount only for the open section, so opening
 * the menu does not pull down a dozen images.
 */
export function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(megaMenus[0]?.id ?? null);
  const { reduced } = useMotionBudget();

  return (
    <div className="flex h-full flex-col pt-[calc(6rem+var(--marquee-h))] pb-10">
      <div className="flex-1 overflow-y-auto">
        <ul>
          {megaMenus.map((menu) => {
            const isOpen = expanded === menu.id;
            return (
              <li key={menu.id} className="border-b border-sand">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`m-${menu.id}`}
                  onClick={() => setExpanded(isOpen ? null : menu.id)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="font-display text-[1.65rem] leading-none text-ink">
                    {menu.label}
                  </span>
                  {/* A +/− that rotates, rather than a chevron — reads as
                      "expand a list" instead of "go somewhere". */}
                  <span aria-hidden="true" className="relative block h-4 w-4 shrink-0">
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink-muted" />
                    <span
                      className={cn(
                        "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink-muted transition-transform duration-300",
                        isOpen && "rotate-90",
                      )}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`m-${menu.id}`}
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5">
                        {menu.columns.map((col) => (
                          <div key={col.heading} className="mt-3 first:mt-0">
                            <p className="eyebrow">{col.heading}</p>
                            <ul className="mt-2">
                              {col.items.map((item) => {
                                const body = (
                                  <>
                                    {item.photo ? (
                                      <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-[4px] bg-cream">
                                        <Image
                                          src={item.photo.src}
                                          alt=""
                                          fill
                                          sizes="44px"
                                          className="object-cover"
                                        />
                                      </span>
                                    ) : (
                                      <span className="block h-11 w-11 shrink-0 rounded-[4px] bg-cream" />
                                    )}
                                    <span className="min-w-0">
                                      <span className="block text-[0.95rem] text-ink">
                                        {item.label}
                                      </span>
                                      <span className="block truncate text-[0.76rem] text-ink-faint">
                                        {item.description}
                                      </span>
                                    </span>
                                  </>
                                );

                                return (
                                  <li key={item.label}>
                                    {item.action === "partypal" ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          track("chat_opened", { source: "mobile_nav" });
                                          openPartyPal({ source: "mobile_nav" });
                                          onNavigate();
                                        }}
                                        className="flex w-full items-center gap-3 py-2 text-left"
                                      >
                                        {body}
                                      </button>
                                    ) : (
                                      <Link
                                        href={item.href!}
                                        onClick={onNavigate}
                                        className="flex items-center gap-3 py-2"
                                      >
                                        {body}
                                      </Link>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}

                        <Link
                          href={menu.href}
                          onClick={onNavigate}
                          className="mt-4 inline-block text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-rose-deep"
                        >
                          View all {menu.label.toLowerCase()} →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}

          {[
            { label: "Gallery", href: "/gallery" },
            { label: "About", href: "/about" },
          ].map((l, i) => (
            <motion.li
              key={l.href}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: EASE }}
              className="border-b border-sand"
            >
              <Link
                href={l.href}
                onClick={onNavigate}
                className="block py-4 font-display text-[1.65rem] leading-none text-ink"
              >
                {l.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-3 pt-2">
        {/* Only appears when the browser reports the site is installable. */}
        <InstallApp />
        <Button href="/contact" variant="primary" size="lg" arrow onClick={onNavigate}>
          🎈 Plan my celebration
        </Button>
        <a href={telHref(business.primaryPhone)} className="text-center text-sm text-ink-muted">
          or call {formatPhone(business.primaryPhone)}
        </a>
      </div>
    </div>
  );
}
