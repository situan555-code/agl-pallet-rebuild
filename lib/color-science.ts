// Color math for the internal Accent Lab (/accent-lab/).
// WCAG 2.x contrast ratio and an OKLCH readout. No dependencies.

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function isHex(value: string): boolean {
  return HEX_RE.test(value);
}

export function normalizeHex(value: string): string | null {
  const v = value.trim();
  const withHash = v.startsWith("#") ? v : `#${v}`;
  return isHex(withHash) ? withHash.toUpperCase() : null;
}

function channels(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function toLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const x = relativeLuminance(a);
  const y = relativeLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Whichever of the two inks reads better on the given fill. */
export function bestInk(fill: string, dark: string, light: string): string {
  return contrastRatio(fill, dark) >= contrastRatio(fill, light) ? dark : light;
}

export type Oklch = { l: number; c: number; h: number };

export function toOklch(hex: string): Oklch {
  const [r, g, b] = channels(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.sqrt(A * A + B * B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

export function formatOklch(hex: string): string {
  const { l, c, h } = toOklch(hex);
  return `OKLCH L ${l.toFixed(2)}  C ${c.toFixed(3)}  H ${Math.round(h)}°`;
}
