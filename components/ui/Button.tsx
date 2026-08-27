"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { track, type AnalyticsEvent } from "@/lib/analytics/events";

type Variant = "primary" | "accent" | "outline" | "ghost" | "onDark";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 font-body font-semibold " +
  "tracking-[0.14em] uppercase whitespace-nowrap rounded-full " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-400 " +
  "ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.985] " +
  "disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-ivory hover:bg-ink-soft shadow-[var(--shadow-lift)] hover:shadow-[var(--shadow-raise)]",
  accent:
    "bg-rose-deep text-white hover:bg-rose shadow-[var(--shadow-lift)] hover:shadow-[var(--shadow-raise)]",
  outline:
    "border border-ink/22 text-ink hover:border-ink/55 hover:bg-ink/[0.035]",
  ghost: "text-ink hover:bg-ink/[0.05]",
  onDark:
    "border border-ivory/30 text-ivory hover:bg-ivory hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "text-[0.66rem] px-5 py-2.5",
  md: "text-[0.72rem] px-7 py-3.5",
  lg: "text-[0.78rem] px-9 py-4.5",
};

export type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Fires on click, before navigation. */
  analytics?: AnalyticsEvent;
  analyticsData?: Record<string, string | number | boolean>;
  /** Adds the sliding arrow used on primary CTAs. */
  arrow?: boolean;
  /** Opens in a new tab with the right rel attributes. */
  external?: boolean;
  "aria-label"?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  onClick,
  type = "button",
  disabled,
  analytics,
  analyticsData,
  arrow,
  external,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  const handle = () => {
    if (analytics) track(analytics, analyticsData);
    onClick?.();
  };

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={handle}
          {...rest}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={handle} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={handle} disabled={disabled} {...rest}>
      {inner}
    </button>
  );
}
