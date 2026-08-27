import { PhotoOrScene } from "@/components/decor/PhotoOrScene";
import type { Occasion } from "@/data/occasions";

/**
 * The artwork half of an occasion card: a real photograph wherever one exists —
 * either a whole folder of that occasion, or hand-picked representative setups
 * for occasions the studio has not photographed yet.
 */
export function OccasionScene({
  occasion,
  size = "md",
  priority = false,
  index = 0,
}: {
  occasion: Occasion;
  size?: "md" | "lg";
  priority?: boolean;
  index?: number;
}) {
  return (
    <PhotoOrScene
      photos={occasion.photos}
      photoCategory={occasion.photoCategory}
      index={index}
      sceneKey={size === "lg" ? `occ-${occasion.slug}-lg` : `occ-${occasion.slug}`}
      alt={`${occasion.name} decoration in Patna`}
      priority={priority}
      sizes={size === "lg" ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
      className="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
    />
  );
}
