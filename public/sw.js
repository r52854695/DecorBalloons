/*
 * Service worker for the DecorBalloons PWA.
 *
 * Caching strategy is chosen around one fact: this site sells things at a
 * price. Serving a stale page could quote a customer a number the studio no
 * longer honours, so HTML is ALWAYS network-first and the cache is only a
 * fallback for when the connection is genuinely gone. Images and build assets
 * are immutable (Next fingerprints them), so those are cache-first.
 *
 * Bump CACHE_VERSION to retire every old cache on the next visit.
 */

const CACHE_VERSION = "v1";
const SHELL_CACHE = `db-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `db-assets-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline";

/** Small enough to precache without costing anyone their data. */
const SHELL = [OFFLINE_URL, "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((c) => c.addAll(SHELL))
      // One missing file must not stop the worker installing.
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== ASSET_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only GET is cacheable. Never touch the enquiry or chat endpoints — a
  // cached POST response would silently swallow somebody's booking.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // Navigations: network first, cache as a safety net, offline page last.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached ?? (await caches.match(OFFLINE_URL)) ?? Response.error();
        }),
    );
    return;
  }

  // Fingerprinted build output and optimised images never change under the
  // same URL, so serving them from cache is safe and saves the round trip.
  const isImmutable =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/");

  if (isImmutable) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((res) => {
            // Opaque or failed responses are not worth storing.
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSET_CACHE).then((c) => c.put(request, copy));
            }
            return res;
          }),
      ),
    );
  }
});
