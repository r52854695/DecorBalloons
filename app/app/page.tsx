import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { InstallApp } from "@/components/pwa/InstallApp";
import { buildMetadata } from "@/lib/seo/metadata";
import { business } from "@/data/business";

export const metadata: Metadata = buildMetadata({
  title: `Get the ${business.name} app`,
  description: `Install the ${business.name} app on your phone to browse decoration setups and book faster in ${business.city}.`,
  path: "/app",
});

/**
 * The "get the app" page.
 *
 * Two routes are offered and the order is deliberate. Installing the web app
 * is first because it takes one tap, works on both iPhone and Android, and
 * updates itself. The APK is second because sideloading on Android means
 * walking past a security warning, and pretending otherwise would just lose
 * people at the scary screen with no explanation.
 */
export default function AppPage() {
  return (
    <>
      <PageHero
        eyebrow="Mobile app"
        lines={["Put us on", { text: "your home screen.", className: "italic text-rose-deep" }]}
        lead={`Browse setups, check prices and book — without opening a browser. Works offline for anything you have already looked at.`}
        crumbs={[{ name: "App", path: "/app" }]}
      />

      <section className="section-y">
        <div className="shell grid max-w-4xl gap-6 md:grid-cols-2">
          {/* ── recommended ── */}
          <div className="rounded-[10px] border-2 border-ink bg-white p-6">
            <p className="eyebrow">Recommended</p>
            <h2 className="mt-2 font-display text-[1.5rem] leading-tight text-ink">
              Install the web app
            </h2>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-muted">
              One tap. Works on both iPhone and Android, and updates itself — you
              will never need to download it again.
            </p>

            <div className="mt-5">
              <InstallApp />
            </div>

            <div className="mt-5 space-y-3 border-t border-sand pt-4 text-[0.8rem] leading-relaxed text-ink-muted">
              <p>
                <strong className="text-ink">Android:</strong> tap the ⋮ menu in Chrome,
                then <em>Install app</em> or <em>Add to Home screen</em>.
              </p>
              <p>
                <strong className="text-ink">iPhone:</strong> tap the Share button in
                Safari, then <em>Add to Home Screen</em>.
              </p>
            </div>
          </div>

          {/* ── apk ── */}
          <div className="rounded-[10px] border border-sand bg-white p-6">
            <p className="eyebrow">Android only</p>
            <h2 className="mt-2 font-display text-[1.5rem] leading-tight text-ink">
              Download the APK
            </h2>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-muted">
              An installable Android file, if you would rather have it that way.
              Same app — it just arrives as a download instead.
            </p>

            <a
              href="/downloads/decorballoons.apk"
              download
              className="mt-5 flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-[0.85rem] font-semibold text-ivory"
            >
              ⬇ Download for Android
            </a>

            <div className="mt-5 space-y-2 border-t border-sand pt-4 text-[0.8rem] leading-relaxed text-ink-muted">
              <p className="font-medium text-ink">Android will warn you first.</p>
              <p>
                Because this does not come from the Play Store, your phone will ask
                you to allow installing from this source. That prompt is normal for
                any app installed outside the store — tap <em>Settings</em>, turn the
                permission on, then <em>Install</em>.
              </p>
              <p>Not available on iPhone — use the web app above.</p>
            </div>
          </div>
        </div>

        <div className="shell mt-10 max-w-4xl">
          <p className="text-center text-[0.82rem] text-ink-muted">
            Rather not install anything?{" "}
            <Link href="/" className="underline">
              The website has everything the app does.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
