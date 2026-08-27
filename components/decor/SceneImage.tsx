import { getSceneSpec, sceneSrc } from "@/lib/scenes/registry";
import { cn } from "@/lib/utils";

/**
 * Renders a decor scene as an image rather than inline SVG.
 *
 * A plain <img>, not next/image: the source is already an SVG, so there is no
 * raster pipeline to run and next/image would need `unoptimized` anyway. The
 * scene's own `preserveAspectRatio="… slice"` makes it cover the box, so this
 * behaves like `object-fit: cover` without needing it.
 *
 * `width`/`height` carry the viewBox ratio so the box is reserved before the
 * file arrives — that is what keeps CLS at zero while these load lazily.
 */
export function SceneImage({
  sceneKey,
  className,
  /** Overrides the registry's default alt text for this specific context. */
  alt,
  /** Set for anything above the fold so it is not deferred. */
  priority = false,
}: {
  sceneKey: string;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  const spec = getSceneSpec(sceneKey);

  if (!spec) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `SceneImage: unknown scene key "${sceneKey}". Add it to lib/scenes/registry.ts.`,
      );
    }
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG source; next/image adds no value and would need `unoptimized`.
    <img
      src={sceneSrc(sceneKey)}
      alt={alt ?? spec.label}
      width={spec.w}
      height={spec.h}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn("h-full w-full", className)}
    />
  );
}
