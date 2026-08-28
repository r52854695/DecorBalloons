"use client";

/**
 * Scroll arrows for a catalogue shelf.
 *
 * Stateless, and separate from the chips because it needs nothing they know —
 * splitting them keeps each piece of client code to what it actually does.
 *
 * Reaches the shelf by id rather than a ref: the shelf is rendered by the
 * server component that owns this one, so there is no ref to hand down.
 * The arrows are an enhancement; the shelf scrolls by touch and trackpad
 * without them.
 */
export function ShelfArrows({
  shelfId,
  categoryName,
}: {
  shelfId: string;
  categoryName: string;
}) {
  const nudge = (dir: 1 | -1) => {
    const el = document.getElementById(shelfId);
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(el.clientWidth * 0.8, 640),
      behavior: "smooth",
    });
  };

  return (
    <div className="hidden gap-1.5 md:flex">
      {([-1, 1] as const).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => nudge(d)}
          aria-label={
            d === -1
              ? `Scroll ${categoryName} left`
              : `Scroll ${categoryName} right`
          }
          className="flex h-8 w-8 items-center justify-center rounded-full border border-sand text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
        >
          <span aria-hidden="true" className="text-[0.8rem]">
            {d === -1 ? "←" : "→"}
          </span>
        </button>
      ))}
    </div>
  );
}
