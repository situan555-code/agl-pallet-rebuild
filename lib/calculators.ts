// Pure planning math for the Resource Library calculators. Every function is
// deterministic and runs on the server; pages render the result as HTML.
// Inputs are inches, pounds, and dollars.

type Params = Record<string, string | string[] | undefined>;

/** Read a numeric query param, falling back to `fallback` when missing or out of range. */
export function numParam(params: Params, key: string, fallback: number, min: number, max: number): number {
  const raw = params[key];
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  if (raw === undefined || raw === "" || !Number.isFinite(value) || value < min || value > max) return fallback;
  return value;
}

/** Numeric query param with no default: undefined when blank or invalid. */
export function optionalNumParam(params: Params, key: string, min: number, max: number): number | undefined {
  const raw = params[key];
  const str = Array.isArray(raw) ? raw[0] : raw;
  if (str === undefined || str.trim() === "") return undefined;
  const value = Number(str);
  return Number.isFinite(value) && value >= min && value <= max ? value : undefined;
}

export function strParam<T extends string>(params: Params, key: string, allowed: readonly T[], fallback: T): T {
  const raw = params[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (allowed as readonly string[]).includes(value ?? "") ? (value as T) : fallback;
}

export function hasParams(params: Params) {
  return Object.keys(params).length > 0;
}

// ---------------------------------------------------------------------------
// Floor patterns

export interface FloorPattern {
  count: number;
  /** Plain-language description of the winning pattern. */
  pattern: string;
}

/**
 * Most footprints of `pl × pw` that fit on a `floorL × floorW` floor, testing
 * simple patterns a loader would actually use: every pallet straight, every
 * pallet turned, rows of each along the length, and lanes of each across the
 * width. Pinwheel or interlocked patterns can sometimes fit one or two more.
 */
export function bestFloorPattern(floorL: number, floorW: number, pl: number, pw: number): FloorPattern {
  const candidates: FloorPattern[] = [];

  // Rows along the floor length: `a` rows straight (pl along length), the rest turned.
  const straightPerRow = Math.floor(floorW / pw);
  const turnedPerRow = Math.floor(floorW / pl);
  for (let a = 0; a * pl <= floorL; a++) {
    const b = Math.floor((floorL - a * pl) / pw);
    const count = a * straightPerRow + b * turnedPerRow;
    candidates.push({ count, pattern: describeRows(a, straightPerRow, b, turnedPerRow) });
  }

  // Lanes running the full length: `k` lanes straight (pw across), `j` lanes turned (pl across).
  const straightPerLane = Math.floor(floorL / pl);
  const turnedPerLane = Math.floor(floorL / pw);
  for (let k = 0; k * pw <= floorW; k++) {
    const j = Math.floor((floorW - k * pw) / pl);
    const count = k * straightPerLane + j * turnedPerLane;
    candidates.push({ count, pattern: describeLanes(k, straightPerLane, j, turnedPerLane) });
  }

  return candidates.reduce((best, c) => (c.count > best.count ? c : best), { count: 0, pattern: "Footprint does not fit" });
}

function describeRows(a: number, perA: number, b: number, perB: number) {
  const parts = [];
  if (a > 0 && perA > 0) parts.push(`${a} row${a === 1 ? "" : "s"} straight, ${perA} across`);
  if (b > 0 && perB > 0) parts.push(`${b} row${b === 1 ? "" : "s"} turned, ${perB} across`);
  return parts.join(" + ") || "Footprint does not fit";
}

function describeLanes(k: number, perK: number, j: number, perJ: number) {
  const parts = [];
  if (k > 0 && perK > 0) parts.push(`${k} lane${k === 1 ? "" : "s"} straight, ${perK} deep`);
  if (j > 0 && perJ > 0) parts.push(`${j} lane${j === 1 ? "" : "s"} turned, ${perJ} deep`);
  return parts.join(" + ") || "Footprint does not fit";
}

// ---------------------------------------------------------------------------
// Truckload

export interface TruckloadInput {
  floorL: number;
  floorW: number;
  interiorH: number;
  palletL: number;
  palletW: number;
  /** Loaded unit height including the pallet. */
  loadH: number;
  /** Loaded unit weight including the pallet. */
  loadWeight: number;
  maxLevels: number;
  payload: number;
}

export interface TruckloadResult {
  floor: FloorPattern;
  levels: number;
  bySpace: number;
  byWeight: number;
  count: number;
  limitedBy: "floor space" | "height" | "weight";
  totalWeight: number;
}

export function truckload(i: TruckloadInput): TruckloadResult {
  const floor = bestFloorPattern(i.floorL, i.floorW, i.palletL, i.palletW);
  const levels = Math.max(0, Math.min(i.maxLevels, Math.floor(i.interiorH / i.loadH)));
  const bySpace = floor.count * levels;
  const byWeight = i.loadWeight > 0 ? Math.floor(i.payload / i.loadWeight) : Infinity;
  const count = Math.min(bySpace, byWeight);
  const limitedBy = byWeight < bySpace ? "weight" : levels < i.maxLevels ? "height" : "floor space";
  return { floor, levels, bySpace, byWeight, count, limitedBy, totalWeight: count * i.loadWeight };
}

export interface EmptyLoadInput {
  floorL: number;
  floorW: number;
  interiorH: number;
  palletL: number;
  palletW: number;
  palletH: number;
  clearance: number;
  palletWeight: number;
  payload: number;
}

export interface EmptyLoadResult {
  floor: FloorPattern;
  perStack: number;
  bySpace: number;
  byWeight: number;
  count: number;
  limitedBy: "space" | "weight";
  totalWeight: number;
}

/** Empty pallets shipped in stacks, one stack per floor position. */
export function emptyLoad(i: EmptyLoadInput): EmptyLoadResult {
  const floor = bestFloorPattern(i.floorL, i.floorW, i.palletL, i.palletW);
  const perStack = Math.max(0, Math.floor((i.interiorH - i.clearance) / i.palletH));
  const bySpace = floor.count * perStack;
  const byWeight = i.palletWeight > 0 ? Math.floor(i.payload / i.palletWeight) : Infinity;
  const count = Math.min(bySpace, byWeight);
  return { floor, perStack, bySpace, byWeight, count, limitedBy: byWeight < bySpace ? "weight" : "space", totalWeight: count * i.palletWeight };
}

// ---------------------------------------------------------------------------
// Boxes per pallet

export interface BoxesInput {
  palletL: number;
  palletW: number;
  palletH: number;
  boxL: number;
  boxW: number;
  boxH: number;
  /** Maximum unit load height including the pallet. */
  maxH: number;
  /** Optional per-box weight and maximum load weight (excluding the pallet). */
  boxWeight?: number;
  maxWeight?: number;
}

export interface BoxesResult {
  perLayer: FloorPattern;
  layers: number;
  bySpace: number;
  byWeight?: number;
  count: number;
  stackHeight: number;
  loadWeight?: number;
  limitedBy: "space" | "weight";
}

/** Column-stacked cartons, no overhang, same pattern on every layer. */
export function boxesPerPallet(i: BoxesInput): BoxesResult {
  const perLayer = bestFloorPattern(i.palletL, i.palletW, i.boxL, i.boxW);
  const layers = Math.max(0, Math.floor((i.maxH - i.palletH) / i.boxH));
  const bySpace = perLayer.count * layers;
  const byWeight = i.boxWeight && i.maxWeight ? Math.floor(i.maxWeight / i.boxWeight) : undefined;
  const count = byWeight !== undefined ? Math.min(bySpace, byWeight) : bySpace;
  const usedLayers = perLayer.count > 0 ? Math.ceil(count / perLayer.count) : 0;
  return {
    perLayer,
    layers,
    bySpace,
    byWeight,
    count,
    stackHeight: i.palletH + usedLayers * i.boxH,
    loadWeight: i.boxWeight ? count * i.boxWeight : undefined,
    limitedBy: byWeight !== undefined && byWeight < bySpace ? "weight" : "space",
  };
}

// ---------------------------------------------------------------------------
// Pallet weight estimate

export interface WoodSpecies {
  id: string;
  label: string;
  /** Specific gravity, oven-dry weight over green volume. */
  sgGreen: number;
  /** Specific gravity, oven-dry weight over volume at 12% moisture. */
  sg12: number;
}

export interface ComponentLine {
  label: string;
  qty: number;
  thickness: number;
  width: number;
  length: number;
}

const WATER_LB_PER_FT3 = 62.4;

/**
 * Specific gravity at moisture content `mc` (%). Uses the 12% value at or
 * below 12%, the green value at or above 30% (roughly fiber saturation, where
 * volume stops changing), and straight-line interpolation between.
 */
export function sgAtMoisture(s: WoodSpecies, mc: number) {
  if (mc <= 12) return s.sg12;
  if (mc >= 30) return s.sgGreen;
  return s.sg12 + ((s.sgGreen - s.sg12) * (mc - 12)) / 18;
}

/** Weight density in lb/ft³: water density × SG at MC × (1 + MC/100). */
export function densityLbFt3(s: WoodSpecies, mc: number) {
  return WATER_LB_PER_FT3 * sgAtMoisture(s, mc) * (1 + mc / 100);
}

export function palletWeight(lines: ComponentLine[], species: WoodSpecies, mc: number) {
  const density = densityLbFt3(species, mc);
  const rows = lines
    .filter((l) => l.qty > 0)
    .map((l) => {
      const volumeIn3 = l.qty * l.thickness * l.width * l.length;
      return { ...l, volumeIn3, weight: (volumeIn3 / 1728) * density };
    });
  const volumeIn3 = rows.reduce((sum, r) => sum + r.volumeIn3, 0);
  return { density, rows, volumeIn3, volumeFt3: volumeIn3 / 1728, boardFeet: volumeIn3 / 144, weight: (volumeIn3 / 1728) * density };
}

// ---------------------------------------------------------------------------
// Cost per trip

export interface CostPerTripInput {
  price: number;
  trips: number;
  repairPerTrip: number;
  returnPerTrip: number;
  residual: number;
}

export function costPerTrip(i: CostPerTripInput) {
  const capitalPerTrip = (i.price - i.residual) / i.trips;
  const perTrip = capitalPerTrip + i.repairPerTrip + i.returnPerTrip;
  return { capitalPerTrip, perTrip, lifetime: perTrip * i.trips, oneWay: i.price };
}

// ---------------------------------------------------------------------------
// Formatting

export function fmt(n: number, digits = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
