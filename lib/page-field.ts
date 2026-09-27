export type PageField = "dark" | "light";

const LIGHT_PREFIXES = [
  "/resources",
  "/faq",
  "/request-a-quote",
  "/contact",
  "/the-pledge",
] as const;

/** Sell pages are moss. Guides, FAQ, forms, pledge, and contact are bone. */
export function pageField(pathname: string | null | undefined): PageField {
  const path = (pathname ?? "/").split("?")[0].replace(/\/+$/, "") || "/";
  if (LIGHT_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return "light";
  }
  return "dark";
}
