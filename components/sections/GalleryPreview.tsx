import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/ui/GalleryGrid";
import { galleryItems, galleryIsIllustrated } from "@/data/gallery";

export function GalleryPreview() {
  return (
    <section className="section-y bg-cream" aria-labelledby="gallery-heading">
      <div className="shell">
        <SectionHeading
          eyebrow="Portfolio"
          lines={["A look at", { text: "the work.", className: "italic text-rose-deep" }]}
          lead="Setups across birthdays, showers, proposals and functions in Patna."
          link={{ href: "/gallery", label: "Full gallery" }}
        />
        <span id="gallery-heading" className="sr-only">
          Gallery of our decoration work
        </span>

        <div className="mt-12">
          <GalleryGrid items={galleryItems.slice(0, 6)} />
        </div>

        {/*
          Honesty notice. These are illustrations of the kinds of setups the
          studio builds, not photographs of completed jobs. Presenting drawings
          as a portfolio without saying so would be the single most misleading
          thing this site could do — so it says so, quietly, once.
          This block disappears on its own as soon as real photos are added.
        */}
        {galleryIsIllustrated && (
          <p className="mt-10 max-w-2xl text-[0.78rem] leading-relaxed text-ink-faint">
            <span className="font-semibold text-ink-muted">A note on these images:</span>{" "}
            they are illustrations of the setups we build, shown while our
            photo gallery is being put together. Ask us on WhatsApp and we will
            send recent photographs of real setups.
          </p>
        )}
      </div>
    </section>
  );
}
