"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MegaMenuPanel } from "./MegaMenuPanel";
import { useMotionBudget } from "@/components/motion/useMotionBudget";
import { megaMenus, defaultItem, type MegaItem } from "@/data/mega-menu";
import { cn } from "@/lib/utils";

/** Hover intent. Short enough to feel instant, long enough not to flicker. */
const OPEN_DELAY = 110;
const CLOSE_DELAY = 220;

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Desktop mega navigation.
 *
 * Renders both the triggers and the drawer, because they share one piece of
 * state and one set of hover timers — splitting them would mean lifting all of
 * that into the navbar for no gain.
 *
 * Hover intent is the detail that makes or breaks this pattern. The drawer does
 * not close the moment the pointer leaves a trigger; it closes only when the
 * pointer genuinely leaves the whole header, after a short delay. That is what
 * lets someone move diagonally from "Celebrate" down into the panel without it
 * vanishing under them.
 *
 * Keyboard is a first-class path, not an afterthought: triggers are real
 * buttons (so Enter and Space work for free), Escape closes and returns focus,
 * and moving focus out of the header closes the drawer. Focusing a link updates
 * the preview exactly as hovering does.
 */
export function MegaMenu({
  headerRef,
  onOpenChange,
}: {
  headerRef: RefObject<HTMLElement | null>;
  /** Lets the header go solid while a drawer is open. */
  onOpenChange?: (open: boolean) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [preview, setPreview] = useState<Record<string, MegaItem>>({});
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pathname = usePathname();
  const { reduced } = useMotionBudget();

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = undefined;
    closeTimer.current = undefined;
  }, []);

  /**
   * Cancels only a pending close.
   *
   * This must NOT touch the open timer. `pointerover` — which React synthesizes
   * `onPointerEnter` from — fires before the native `pointerenter` on an
   * ancestor, so entering the header lands on the trigger's handler first and
   * the header's handler second. Clearing both timers here would cancel the
   * open that the trigger just scheduled, and the drawer would never appear on
   * the first hover (it only worked once the pointer was already inside).
   */
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = undefined;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const open = useCallback(
    (id: string, immediate = false) => {
      clearTimers();
      const run = () => {
        setOpenId(id);
        setPreview((p) =>
          p[id]
            ? p
            : { ...p, [id]: defaultItem(megaMenus.find((m) => m.id === id)!) },
        );
      };
      // Switching between already-open menus should feel instant; opening from
      // closed waits out the hover-intent delay.
      if (immediate || openId !== null) run();
      else openTimer.current = setTimeout(run, OPEN_DELAY);
    },
    [clearTimers, openId],
  );

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY);
  }, [clearTimers]);

  const closeNow = useCallback(() => {
    clearTimers();
    setOpenId(null);
  }, [clearTimers]);

  /* Close whenever the route changes — adjusting during render rather than in
     an effect, so the drawer is never painted over the new page. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (openId !== null) setOpenId(null);
  }

  /* Pointer leaving the entire header closes; re-entering cancels. */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onLeave = () => scheduleClose();
    const onEnter = () => cancelClose();
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerenter", onEnter);
    return () => {
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerenter", onEnter);
    };
  }, [headerRef, scheduleClose, cancelClose]);

  /* Escape closes and hands focus back to the trigger it came from. */
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const id = openId;
      closeNow();
      triggerRefs.current[id]?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId, closeNow]);

  /* Tabbing out of the header closes the drawer. */
  const onBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    closeNow();
  };

  /* Report open/closed upward so the header can switch to its solid style. */
  useEffect(() => {
    onOpenChange?.(openId !== null);
  }, [openId, onOpenChange]);

  const activeMenu = megaMenus.find((m) => m.id === openId) ?? null;
  const activeItem = activeMenu
    ? (preview[activeMenu.id] ?? defaultItem(activeMenu))
    : null;

  return (
    <div onBlurCapture={onBlurCapture} className="contents">
      {/* ── triggers ── */}
      <div className="hidden items-center gap-1 lg:flex">
        <Link
          href="/"
          className={cn(
            "rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors",
            pathname === "/"
              ? "text-rose-deep"
              : "text-ink-soft hover:text-ink",
          )}
        >
          Home
        </Link>

        {megaMenus.map((menu) => {
          const isOpen = openId === menu.id;
          const isActive = pathname.startsWith(menu.href) && menu.href !== "/";
          return (
            <Fragment key={menu.id}>
              <button
                ref={(el) => {
                  triggerRefs.current[menu.id] = el;
                }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`mega-${menu.id}`}
                aria-haspopup="true"
                onPointerEnter={(e) => {
                  // Touch taps fire pointerenter too; let the click handler own those.
                  if (e.pointerType === "touch") return;
                  open(menu.id);
                }}
                onClick={() => (isOpen ? closeNow() : open(menu.id, true))}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors",
                  isOpen || isActive
                    ? "text-rose-deep"
                    : "text-ink-soft hover:text-ink",
                )}
              >
                {menu.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-[0.58rem] transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                >
                  ▾
                </span>
              </button>

              {/* The drawer is rendered immediately after its own trigger so that
                Tab walks straight into it and Shift+Tab comes back out to the
                trigger. Rendered after the whole trigger row instead, a
                keyboard user would have to tab past every other trigger to
                reach the menu they just opened. It is absolutely positioned
                against the header, so DOM position costs nothing visually. */}
              <AnimatePresence>
                {isOpen && activeMenu && activeItem && (
                  <motion.div
                    id={`mega-${menu.id}`}
                    initial={reduced ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="absolute inset-x-0 top-full hidden border-b border-sand bg-ivory shadow-[var(--shadow-raise)] lg:block"
                  >
                    <MegaMenuPanel
                      menu={activeMenu}
                      activeItem={activeItem}
                      onPreview={(item) =>
                        setPreview((prev) =>
                          prev[menu.id] === item
                            ? prev
                            : { ...prev, [menu.id]: item },
                        )
                      }
                      onClose={closeNow}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Fragment>
          );
        })}

        <Link
          href="/gallery"
          className={cn(
            "rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors",
            pathname === "/gallery"
              ? "text-rose-deep"
              : "text-ink-soft hover:text-ink",
          )}
        >
          Gallery
        </Link>
        <Link
          href="/about"
          className={cn(
            "rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors",
            pathname === "/about"
              ? "text-rose-deep"
              : "text-ink-soft hover:text-ink",
          )}
        >
          About
        </Link>
      </div>
    </div>
  );
}
