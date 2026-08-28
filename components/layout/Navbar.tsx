"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { business, formatPhone, telHref } from "@/data/business";
import { Button } from "@/components/ui/Button";
import { MegaMenu } from "@/components/navigation/MegaMenu";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Wordmark } from "./Wordmark";
import { AnnouncementMarquee } from "./AnnouncementMarquee";
import { DeliverTo } from "@/components/city/DeliverTo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  /** One state write per threshold crossing, not one per scroll frame. */
  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  /* Close the mobile sheet on navigation — adjusted during render rather than
     in an effect, so it is never painted over the new page. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
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

  // An open drawer needs a solid header behind it, even at the top of the page
  // where the bar is otherwise transparent.
  const solid = scrolled || megaOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-ivory"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          solid
            ? "border-b border-sand/70 bg-ivory/95 backdrop-blur-xl supports-[backdrop-filter]:bg-ivory/85"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <AnnouncementMarquee />

        <nav
          aria-label="Primary"
          className={cn(
            "shell-wide flex items-center justify-between transition-all duration-500",
            scrolled ? "h-16 md:h-[4.5rem]" : "h-20 md:h-[6rem]",
          )}
        >
          <Link
            href="/"
            aria-label={`${business.name} — home`}
            className="shrink-0"
          >
            <Wordmark size={scrolled ? "sm" : "md"} />
          </Link>

          <MegaMenu headerRef={headerRef} onOpenChange={setMegaOpen} />

          <div className="hidden items-center gap-2 lg:flex">
            <DeliverTo className="mr-1" />
            <a
              href={telHref(business.primaryPhone)}
              className="link-draw text-[0.82rem] font-medium text-ink-soft hover:text-ink"
            >
              {formatPhone(business.primaryPhone)}
            </a>
            <Button
              href="/contact"
              variant="primary"
              size="sm"
              analytics="hero_cta_clicked"
              analyticsData={{ source: "navbar" }}
            >
              Plan my celebration
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <DeliverTo />

            {/* ── mobile trigger ── */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 lg:hidden"
            >
              <span
                aria-hidden="true"
                className="flex h-3.5 w-5 flex-col justify-between"
              >
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
          </div>
        </nav>
      </header>

      {/* ── mobile sheet ──
          Layered BELOW the header (z-45) so the wordmark and the close button
          stay visible and reachable: the header is its own stacking context,
          so a button inside it cannot rise above a sheet stacked over it. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-45 bg-ivory lg:hidden"
          >
            <div className="shell h-full">
              <MobileNav onNavigate={() => setMenuOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
