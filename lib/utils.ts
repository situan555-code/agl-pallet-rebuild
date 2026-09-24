import { cn as baseCn, clsx, type ClassValue } from "cn";

// AGL font-size tokens (tailwind.config.ts theme.extend.fontSize). Stock cn
// classifies e.g. `text-link` as a color and drops it (or `text-white`) when
// both are merged. `createCn` from "cn/config" can extend the tables but ships
// the full runtime config (~45 KB) to the client, which cost LCP. Instead:
// pull AGL size tokens out, merge the rest with the precompiled engine, drop
// stock text sizes the AGL token overrides, and append the last AGL size per
// variant prefix. Keep this list in sync with tailwind.config.ts.
const AGL_SIZES = [
  "display-1",
  "display-2",
  "display-3",
  "display-4",
  "display-kicker",
  "display-row",
  "display-numeral",
  "step-sm",
  "step-lg",
  "body",
  "eyebrow",
  "link",
  "nav-link",
  "button",
];
const AGL_SIZE_RE = new RegExp(`^(.*:)?!?text-(?:${AGL_SIZES.join("|")})$`);
const STOCK_SIZE_RE = /^(.*:)?!?text-(?:xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])$/;

export function cn(...inputs: ClassValue[]): string {
  const tokens = clsx(...inputs).split(/\s+/).filter(Boolean);
  const aglByPrefix = new Map<string, string>();
  const rest: string[] = [];
  for (const token of tokens) {
    const m = AGL_SIZE_RE.exec(token);
    if (m) {
      const prefix = m[1] ?? "";
      aglByPrefix.delete(prefix);
      aglByPrefix.set(prefix, token);
    } else {
      rest.push(token);
    }
  }
  if (aglByPrefix.size === 0) return baseCn(rest);
  const filtered = rest.filter((token) => {
    const m = STOCK_SIZE_RE.exec(token);
    return !(m && aglByPrefix.has(m[1] ?? ""));
  });
  return [baseCn(filtered), ...aglByPrefix.values()].filter(Boolean).join(" ");
}

export function getDeviceLanguage() {
  const primaryLocale = navigator.language;
  return primaryLocale.split("-")[0];
}

export function noop() {
  // noop
}

// Shaka's player and media elements both expose addEventListener, with
// different event object types. Keep the callback wide so either can register.
type MediaListener = (event: never) => void;

export function off(
  element: EventTarget,
  events: string | string[],
  callback: MediaListener
): EventTarget {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      element.removeEventListener(event, callback as EventListener);
    });
  } else {
    element.removeEventListener(events, callback as EventListener);
  }

  return element;
}

export function on(
  element: EventTarget,
  events: string | string[],
  callback: MediaListener
): EventTarget {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      element.addEventListener(event, callback as EventListener);
    });
  } else {
    element.addEventListener(events, callback as EventListener);
  }

  return element;
}

export function toFixedNumber(num: number, digits: number, base = 10) {
  const pow = Math.pow(base, digits);
  return Math.round(num * pow) / pow;
}
