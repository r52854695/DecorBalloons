"use client";

import { useEffect } from "react";

/**
 * Registers the service worker.
 *
 * Registered after `load` rather than during render: the worker is a
 * progressive enhancement and has no business competing with the first paint
 * for main-thread time on a mid-range phone.
 *
 * Development is skipped — a worker caching a dev build is a reliable way to
 * spend an afternoon debugging something that was fixed twenty minutes ago.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failing is not worth surfacing: the site works without it.
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
