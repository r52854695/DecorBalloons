import type { Metadata, Viewport } from "next";
import { Manrope, Parisienne, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { CityProvider } from "@/components/city/CityProvider";
import { CityPicker } from "@/components/city/CityPicker";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MobileStickyCTA } from "@/components/ui/MobileStickyCTA";
import { PartyPal } from "@/components/chat/PartyPal";
import { business, siteUrl } from "@/data/business";
import { jsonLd, organizationSchema, websiteSchema } from "@/lib/seo/schema";

/**
 * Editorial display face — the high-contrast serif in the logo.
 *
 * Weight 400 only. Headings are set to 400 in the base layer and nothing
 * anywhere pairs `font-display` with a heavier weight class, so 500 and 600
 * were being downloaded on every visit and never drawn.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400"],
});

/** UI/body face — warmer and less ubiquitous than Inter. */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/** Script face matching the logo's "Balloons" calligraphy. */
const parisienne = Parisienne({
  subsets: ["latin"],
  variable: "--font-parisienne",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} | Premium Balloon Decoration in ${business.city}`,
    template: `%s | ${business.name}`,
  },
  description: `Premium balloon decorations for birthdays, anniversaries, baby showers, proposals and special celebrations in ${business.city}. Plan your celebration with ${business.name}.`,
  applicationName: business.name,
  authors: [{ name: business.name }],
  creator: business.name,
  publisher: business.name,
  formatDetection: { telephone: true, address: true, email: true },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: business.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf6f1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${playfair.variable} ${manrope.variable} ${parisienne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory">
        <script
          type="application/ld+json"
          // Site-wide LocalBusiness + WebSite graph. Page-level schema (Service,
          // FAQPage, BreadcrumbList) is emitted by the individual routes.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              jsonLd(organizationSchema(), websiteSchema()),
            ),
          }}
        />

        <CityProvider>
          <Navbar />

          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer />

          {/* Spacer so the mobile sticky bar can never cover the last footer row. */}
          <div className="h-16 md:hidden" aria-hidden="true" />

          <WhatsAppButton />
          <PartyPal />
          <MobileStickyCTA />
          <CityPicker />
        </CityProvider>
      </body>
    </html>
  );
}
