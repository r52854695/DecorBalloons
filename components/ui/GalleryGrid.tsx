import Image from "next/image";
import { SceneImage } from "@/components/decor/SceneImage";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/utils";

const ASPECT: Record<GalleryItem["aspect"], string> = {
  portrait: "aspect-4/5",
  landscape: "aspect-3/2",
  square: "aspect-square",
  tall: "aspect-2/3",
};

/**
 * Editorial gallery grid.
 *
 * Mixed aspect ratios on a masonry-ish column layout, so the page reads like a
 * portfolio spread rather than a uniform product grid. Each tile renders a
 * real photograph when `src` is set and an illustrated decor scene until then,
 * which means dropping in real photos later is a data change, not a rebuild.
 *
 * Deliberately a SERVER component. It was previously a client component only
 * so it could fire an analytics ping on hover — which meant React shipped and
 * hydrated every one of these SVG scenes, hundreds of nodes each, for
 * telemetry nobody asked for. The scenes are entirely static, so they now
 * stay on the server; only the ScrollReveal wrapper is client code, and
 * server-rendered children passed through it are never hydrated.
 */
export function GalleryGrid({
  items,
  columns = 3,
  className,
}: {
  items: GalleryItem[];
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "columns-1 gap-4 sm:columns-2 md:gap-6",
        columns === 3 && "lg:columns-3",
        className,
      )}
    >
      {items.map((item, i) => (
        <ScrollReveal
          key={item.id}
          variant="fadeUp"
          delay={(i % 3) * 0.07}
          as="figure"
          className="mb-4 break-inside-avoid md:mb-6"
        >
          <div
            className={cn(
              "scene-frame group relative overflow-hidden rounded-[5px] bg-cream",
              ASPECT[item.aspect],
            )}
          >
            {item.src ? (
              <Image
                src={item.src}
                alt={item.caption}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
            ) : (
              <SceneImage
                sceneKey={`gal-${item.id}`}
                className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
            )}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-[0.8rem] leading-snug text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {item.caption}
            </figcaption>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
