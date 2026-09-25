import { trailerFloorPositions } from "@/lib/trailer-layout";
import type { FloorPattern } from "@/lib/calculators";

export function TrailerDiagram({
  floorL,
  floorW,
  palletL,
  palletW,
  floor,
}: {
  floorL: number;
  floorW: number;
  palletL: number;
  palletW: number;
  floor: FloorPattern;
}) {
  const boxes = trailerFloorPositions({ floorL, floorW, palletL, palletW, floor });
  if (!boxes.length) return null;
  return (
    <svg
      viewBox={`0 0 ${floorL} ${floorW}`}
      className="mt-8 w-full max-w-xl rounded-card border border-smoke bg-moss text-ice"
      role="img"
      aria-label={`Floor pattern: ${floor.pattern}`}
    >
      <rect x="0" y="0" width={floorL} height={floorW} fill="#131913" />
      {boxes.map((b, i) => (
        <rect
          key={`${b.x}-${b.y}-${i}`}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={b.turned ? "#DDE9E2" : "#AEB5AE"}
          stroke="#1F2A1F"
          strokeWidth="0.4"
        />
      ))}
    </svg>
  );
}
