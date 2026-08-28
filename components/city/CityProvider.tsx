"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CITY_KEY, defaultCity, getCity, type City } from "@/data/cities";

type Ctx = {
  city: City;
  /** False until hydration has happened, so nothing flashes the wrong city. */
  ready: boolean;
  setCity: (slug: string) => void;
  openPicker: () => void;
  closePicker: () => void;
  pickerOpen: boolean;
};

const CityContext = createContext<Ctx | null>(null);

export const useCity = () => {
  const c = useContext(CityContext);
  if (!c) throw new Error("useCity must be used inside <CityProvider>");
  return c;
};

/* ── the stored city, as an external store ────────────────────
   Read through useSyncExternalStore rather than an effect. localStorage
   cannot be read while rendering (the server has none), and reading it in an
   effect and calling setState is exactly the pattern React now flags — it
   renders once with the wrong answer and then corrects it. useSyncExternalStore
   is the supported way to read browser state: it uses the server snapshot for
   hydration and the live value immediately after, and it gives cross-tab sync
   for free. */

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab changing the city should update this one.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readStored(): string | null {
  try {
    return localStorage.getItem(CITY_KEY);
  } catch {
    // Private mode or blocked storage: behave as if nothing was ever chosen.
    return null;
  }
}

/** Server renders as "not hydrated"; the client flips true on hydration. */
const subscribeNoop = () => () => {};

export function CityProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(subscribe, readStored, () => null);
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const [manualOpen, setManualOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const setCity = useCallback((next: string) => {
    if (!getCity(next)) return;
    try {
      localStorage.setItem(CITY_KEY, next);
    } catch {
      // The choice still applies this session; it just will not persist.
    }
    emit();
    setManualOpen(false);
    setDismissed(true);
  }, []);

  const closePicker = useCallback(() => {
    // Dismissing without choosing settles on the default rather than asking
    // again on the next page — the picker is a convenience, not a gate.
    setManualOpen(false);
    setDismissed(true);
    if (!readStored()) {
      try {
        localStorage.setItem(CITY_KEY, defaultCity.slug);
      } catch {
        /* not persisted; the default applies anyway */
      }
      emit();
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      city: getCity(stored) ?? defaultCity,
      ready: hydrated,
      setCity,
      openPicker: () => setManualOpen(true),
      closePicker,
      // Opens by itself only on a genuine first visit: hydrated, nothing
      // stored, and not already dismissed this session.
      pickerOpen: manualOpen || (hydrated && !stored && !dismissed),
    }),
    [stored, hydrated, manualOpen, dismissed, setCity, closePicker],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}
