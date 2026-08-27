"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { primaryNav } from "@/data/navigation";
import { business, formatPhone, telHref } from "@/data/business";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "./Wordmark";
import { EASE } from "@/components/motion/variants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  /**
   * One state write per threshold crossing rather than one per scroll frame —
   * the difference between a navbar and a performance problem.
   */
  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  /**
   * Close everything on navigation.
   *
   * Adjusted during render rather than in an effect. Closing the menu is a
   * reaction to a prop changing, not synchronisation with an external system,
   * so an effect would queue a second render pass and briefly paint the open
   * menu over the new page. React explicitly supports this pattern for
   * "state that depends on previous props".
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setOpenSub(null);
  }

  // Escape closes; body scroll locks while the mobile sheet is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setOpenSub(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = menuOpen ? "hidden" : prev || "";
    return () => {
      style.overflow = prev || "";
    };
  }, [menuOpen]);

  // Click-away for the desktop occasions panel.
  useEffect(() => {
    if (!openSub) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpenSub(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openSub]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]) && href !== "/#reviews";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-ivory"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "border-b border-sand/70 bg-ivory/85 backdrop-blur-xl supports-[backdrop-filter]:bg-ivory/72"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "shell flex items-center justify-between transition-all duration-500",
            scrolled ? "h-16 md:h-[4.5rem]" : "h-20 md:h-[6rem]",
          )}
        >
          <Link href="/" aria-label={`${business.name} — home`} className="shrink-0">
            <Wordmark size={scrolled ? "sm" : "md"} />
          </Link>

          {/* ── desktop ── */}
          <div className="hidden items-center gap-1 lg:flex" ref={panelRef}>
            {primaryNav.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenSub(item.href)}
                  onMouseLeave={() => setOpenSub(null)}
                >
                  <button
                    type="button"
                    aria-expanded={openSub === item.href}
                    aria-haspopup="true"
                    onClick={() => setOpenSub(openSub === item.href ? null : item.href)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.82rem] font-medium transition-colors",
                      isActive(item.href) ? "text-rose-deep" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "text-[0.6rem] transition-transform duration-300",
                        openSub === item.href && "rotate-180",
                      )}
                    >
                      ▾
                    </span>
                  </button>

                  <AnimatePresence>
                    {openSub === item.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.26, ease: EASE }}
                        className="absolute left-1/2 top-full w-[30rem] -translate-x-1/2 pt-3"
                      >
                        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-sand/80 bg-paper p-3 shadow-[var(--shadow-raise)]">
                          {item.children.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.85rem] text-ink-soft transition-colors hover:bg-rose-wash hover:text-ink"
                            >
                              <span aria-hidden="true" className="text-base">
                                {c.emoji}
                              </span>
                              {c.label}
                            </Link>
                          ))}
                          <Link
                            href="/occasions"
                            className="col-span-2 mt-1 rounded-xl bg-ink/[0.04] px-3 py-2.5 text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink/[0.08]"
                          >
                            All occasions
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-[0.82rem] font-medium transition-colors",
                    isActive(item.href) ? "text-rose-deep" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={telHref(business.primaryPhone)}
              className="link-draw text-[0.82rem] font-medium text-ink-soft hover:text-ink"
            >
              {formatPhone(business.primaryPhone)}
            </a>
            <Button href="/contact" variant="primary" size="sm" analytics="hero_cta_clicked" analyticsData={{ source: "navbar" }}>
              Plan my celebration
            </Button>
          </div>

          {/* ── mobile trigger ── */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 lg:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="flex h-3.5 w-5 flex-col justify-between">
              <span
                className={cn(
                  "block h-[1.5px] w-full bg-ink transition-transform duration-300",
                  menuOpen && "translate-y-[6.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-full bg-ink transition-opacity duration-200",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-full bg-ink transition-transform duration-300",
                  menuOpen && "-translate-y-[6.5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* ── mobile sheet ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            /*
             * Sits BELOW the header (z-50), not above it. The header is a
             * fixed, z-indexed element and therefore its own stacking context,
             * so a z-60 close button inside it cannot rise above a z-55
             * overlay — the sheet would cover both the logo and the only
             * visible way to close it. Layering the sheet at 45 keeps the
             * header, its wordmark and the close control reachable, while
             * still covering the page content and the floating actions (z-40).
             */
            className="fixed inset-0 z-45 bg-ivory lg:hidden"
          >
            <div className="shell flex h-full flex-col pt-24 pb-10">
              <ul className="flex flex-col gap-1">
                {primaryNav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.45, ease: EASE }}
                    className="border-b border-sand/70"
                  >
                    <Link
                      href={item.href}
                      className="block py-4 font-display text-3xl text-ink"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.45, ease: EASE }}
                className="mt-auto flex flex-col gap-3 pt-8"
              >
                <Button href="/contact" variant="primary" size="lg" arrow>
                  Plan my celebration
                </Button>
                <a
                  href={telHref(business.primaryPhone)}
                  className="text-center text-sm text-ink-muted"
                >
                  or call {formatPhone(business.primaryPhone)}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
