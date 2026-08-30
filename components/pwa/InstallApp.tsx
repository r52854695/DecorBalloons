"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STANDALONE = "(display-mode: standalone)";

/* Browser facts are read through useSyncExternalStore rather than an effect.
   They cannot be read while rendering — the server has no navigator or
   matchMedia — and reading them in an effect then calling setState renders once
   with the wrong answer before correcting it, which is what
   react-hooks/set-state-in-effect exists to catch. */

function subscribeStandalone(onChange: () => void) {
  const m = window.matchMedia(STANDALONE);
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
}

const noopSubscribe = () => () => {};

/**
 * "Install app" entry point.
 *
 * Renders nothing until the browser says the site is genuinely installable, so
 * it never offers something that cannot happen. Chrome on Android fires
 * `beforeinstallprompt`; iOS Safari fires nothing at all and needs the manual
 * Share → Add to Home Screen route, so that gets a short instruction rather
 * than a button that would do nothing.
 */
export function InstallApp({ className }: { className?: string }) {
  const alreadyInstalled = useSyncExternalStore(
    subscribeStandalone,
    () => window.matchMedia(STANDALONE).matches,
    () => false,
  );

  const isIOS = useSyncExternalStore(
    noopSubscribe,
    () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window),
    () => false,
  );

  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installedNow, setInstalledNow] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      // Chrome shows its own mini-infobar otherwise; this replaces it.
      e.preventDefault();
      setPrompt(e as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalledNow(true);
      setPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (alreadyInstalled || installedNow) return null;
  if (!prompt && !isIOS) return null;

  if (isIOS) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => setShowIOSHelp((v) => !v)}
          aria-expanded={showIOSHelp}
          className="w-full rounded-full border border-ink/15 px-5 py-3 text-[0.85rem] font-semibold text-ink"
        >
          📲 Install app
        </button>
        {showIOSHelp && (
          <p className="mt-2 text-center text-[0.78rem] leading-relaxed text-ink-muted">
            Tap the Share button in Safari, then <strong>Add to Home Screen</strong>.
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={async () => {
        if (!prompt) return;
        await prompt.prompt();
        await prompt.userChoice;
        // The event is single-use: a prompt cannot be shown twice.
        setPrompt(null);
      }}
      className={`w-full rounded-full border border-ink/15 px-5 py-3 text-[0.85rem] font-semibold text-ink ${className ?? ""}`}
    >
      📲 Install app
    </button>
  );
}
