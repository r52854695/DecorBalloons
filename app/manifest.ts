import type { MetadataRoute } from "next";
import { business } from "@/data/business";

/**
 * Web app manifest.
 *
 * This is what makes the site installable — "Add to Home Screen" on Android and
 * iOS, opening without browser chrome. It is also the prerequisite for wrapping
 * the site as an Android APK later: a Trusted Web Activity is a thin native
 * shell around exactly this, so nothing here is throwaway work.
 *
 * `display: standalone` rather than fullscreen: people need the status bar to
 * see the time and their battery while they are on the phone to us.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${business.name} — Balloon Decoration in ${business.city}`,
    short_name: business.name,
    description: `Book balloon decoration in ${business.city} for birthdays, anniversaries, baby showers, annaprashan and more.`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAF6F1",
    theme_color: "#FAF6F1",
    lang: "en-IN",
    dir: "ltr",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops these to whatever shape the launcher uses, so the mark
      // sits inside the inner 80% and the ivory bleeds to the edge.
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Book a setup", short_name: "Book", url: "/contact" },
      { name: "Birthday decoration", short_name: "Birthday", url: "/catalog/birthday-decoration" },
      { name: "Our work", short_name: "Gallery", url: "/gallery" },
    ],
  };
}
