import { cn } from "@/lib/utils";

/**
 * Honest photo slot. Pale bone field with a quiet grain, a smoke edge,
 * and a gray “Photo” label. Inline paint only — no image request, so it
 * never takes fetchpriority.
 */
const GRAIN = {
  backgroundColor: "#ECE8DF",
  backgroundImage: [
    "repeating-linear-gradient(180deg, rgba(174,181,174,0.5) 0 1px, transparent 1px 9px, rgba(46,52,47,0.14) 9px 10px, transparent 10px 20px)",
    "repeating-linear-gradient(90deg, transparent 0 36px, rgba(174,181,174,0.28) 36px 37px, transparent 37px 72px)",
  ].join(","),
} as const;

export function PhotoPlaceholder({
  alt = "",
  className,
}: {
  /** Empty leaves the visible “Photo” label as the name. Pass a title only when one already exists. */
  alt?: string;
  className?: string;
}) {
  const named = alt.trim().length > 0;
  return (
    <div
      className={cn("relative aspect-4/3 w-full overflow-hidden ring-1 ring-inset ring-smoke/45", className)}
      style={GRAIN}
      role={named ? "img" : undefined}
      aria-label={named ? alt : undefined}
    >
      <span className="absolute bottom-3 left-3 rounded-input bg-smoke px-2.5 py-1 text-[12px] font-semibold leading-none tracking-wide text-gray">
        Photo
      </span>
    </div>
  );
}
