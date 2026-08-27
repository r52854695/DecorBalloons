import Image from "next/image";
import { SceneImage } from "./SceneImage";
import { photosFor, pickPhotos, type PhotoCategory } from "@/data/photos";
import { cn } from "@/lib/utils";

/**
 * Shows a real photograph of the work when there is one, and the illustrated
 * scene only when there is genuinely nothing to show.
 *
 * Two ways to supply photographs, in order of precedence:
 *   `photos`        — hand-picked srcs, for a piece with no matching folder
 *                     (an arch, a pair of columns, a lit stage).
 *   `photoCategory` — a whole folder of the studio's work for that occasion.
 *
 * Both branches use `fill`, so the parent must be positioned and carry the
 * aspect ratio: the library is mixed portrait and landscape, so the container
 * owns the shape and the image covers it.
 */
export function PhotoOrScene({
  photos,
  photoCategory,
  index = 0,
  sceneKey,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  /** Explicit picks — take precedence over `photoCategory`. */
  photos?: string[];
  photoCategory?: PhotoCategory;
  /** Which photo to use, so sibling cards can differ. */
  index?: number;
  /** Illustrated fallback. */
  sceneKey: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const picked = pickPhotos(photos);
  const list = picked.length ? picked : photoCategory ? photosFor(photoCategory) : [];
  const photo = list.length ? list[index % list.length] : undefined;

  if (photo) {
    return (
      <Image
        src={photo.src}
        alt={alt ?? photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return <SceneImage sceneKey={sceneKey} alt={alt} priority={priority} className={className} />;
}
