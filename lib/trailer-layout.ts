import type { FloorPattern } from "@/lib/calculators";

export type TrailerLayoutInput = {
  floorL: number;
  floorW: number;
  palletL: number;
  palletW: number;
  floor: FloorPattern;
};

export type PalletFootprint = {
  x: number;
  y: number;
  w: number;
  h: number;
  turned: boolean;
};

const ROW_STRAIGHT = /(\d+)\s+rows?\s+straight,\s+(\d+)\s+across/i;
const ROW_TURNED = /(\d+)\s+rows?\s+turned,\s+(\d+)\s+across/i;
const LANE_STRAIGHT = /(\d+)\s+lanes?\s+straight,\s+(\d+)\s+deep/i;
const LANE_TURNED = /(\d+)\s+lanes?\s+turned,\s+(\d+)\s+deep/i;

/**
 * Place pallet rectangles from the calculator's winning floor-pattern string.
 * Origin is the trailer nose (x along length, y across width). Units match
 * the calculator (inches). Does not rewrite formulas.
 */
export function trailerFloorPositions(input: TrailerLayoutInput): PalletFootprint[] {
  const { floorL, floorW, palletL, palletW, floor } = input;
  if (!floor.pattern || floor.pattern === "Footprint does not fit" || floor.count === 0) {
    return [];
  }

  const pattern = floor.pattern;
  const boxes: PalletFootprint[] = [];

  if (LANE_STRAIGHT.test(pattern) || LANE_TURNED.test(pattern)) {
    const ks = pattern.match(LANE_STRAIGHT);
    const jt = pattern.match(LANE_TURNED);
    const k = ks ? Number(ks[1]) : 0;
    const perK = ks ? Number(ks[2]) : 0;
    const j = jt ? Number(jt[1]) : 0;
    const perJ = jt ? Number(jt[2]) : 0;
    let y = 0;
    for (let lane = 0; lane < k; lane++) {
      for (let d = 0; d < perK; d++) {
        boxes.push({ x: d * palletL, y, w: palletL, h: palletW, turned: false });
      }
      y += palletW;
    }
    for (let lane = 0; lane < j; lane++) {
      for (let d = 0; d < perJ; d++) {
        boxes.push({ x: d * palletW, y, w: palletW, h: palletL, turned: true });
      }
      y += palletL;
    }
  } else {
    const as = pattern.match(ROW_STRAIGHT);
    const bt = pattern.match(ROW_TURNED);
    const a = as ? Number(as[1]) : 0;
    const perA = as ? Number(as[2]) : 0;
    const b = bt ? Number(bt[1]) : 0;
    const perB = bt ? Number(bt[2]) : 0;
    let x = 0;
    for (let row = 0; row < a; row++) {
      for (let across = 0; across < perA; across++) {
        boxes.push({ x, y: across * palletW, w: palletL, h: palletW, turned: false });
      }
      x += palletL;
    }
    for (let row = 0; row < b; row++) {
      for (let across = 0; across < perB; across++) {
        boxes.push({ x, y: across * palletL, w: palletW, h: palletL, turned: true });
      }
      x += palletW;
    }
  }

  return boxes.filter((box) => box.x + box.w <= floorL + 0.01 && box.y + box.h <= floorW + 0.01);
}
