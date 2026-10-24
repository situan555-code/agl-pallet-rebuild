import flag from "@/lib/launch-lite.json";

/** Launch build. Source for the other routes stays in the tree; this flag
 *  drops them from routing, nav, footer, sitemap, and search. */
export const LAUNCH_LITE = flag.enabled === true;

export const LAUNCH_EXCLUDE_PREFIXES = flag.excludePrefixes;

/** Form-only partner pages stay served inside the otherwise excluded /partners tree. */
export const LAUNCH_ALLOW_PATHS: string[] = flag.allowPaths ?? [];

const SALES_EMAIL = "mailto:sales@aglpallet.com";
const SALES_PHONE = "tel:2342860402";

export function pathOnly(href: string): string {
  const bare = href.split("#")[0]?.split("?")[0] ?? href;
  if (!bare.startsWith("/")) return bare;
  if (bare.length > 1 && bare.endsWith("/")) return bare.slice(0, -1);
  return bare;
}

export function isExcludedPath(href: string): boolean {
  if (!LAUNCH_LITE) return false;
  const path = pathOnly(href);
  if (LAUNCH_ALLOW_PATHS.includes(path)) return false;
  return LAUNCH_EXCLUDE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** Keep a label that must stay on the page, but don't send it at a route
 *  the launch build does not serve. */
export function launchHref(href: string): string {
  if (!LAUNCH_LITE) return href;
  const path = pathOnly(href);
  if (LAUNCH_ALLOW_PATHS.includes(path)) return href;
  if (path === "/partners/suppliers" || path.startsWith("/partners/suppliers/")) return SALES_EMAIL;
  if (path === "/partners/carriers" || path.startsWith("/partners/carriers/")) return SALES_PHONE;
  if (path === "/partners" || path.startsWith("/partners/")) return SALES_EMAIL;
  if (path === "/the-pledge" || path.startsWith("/the-pledge/")) return "/#pledge";
  if (path === "/custom-engineered" || path.startsWith("/custom-engineered/")) return "/products/#custom-engineered";
  if (path === "/services" || path.startsWith("/services/")) return "/how-we-work/";
  if (path === "/contact" || path.startsWith("/contact/")) return "/request-a-quote/";
  if (path === "/faq" || path.startsWith("/faq/")) return "/request-a-quote/";
  if (path === "/case-studies" || path.startsWith("/case-studies/")) return "/products/";
  if (path === "/resources" || path.startsWith("/resources/")) return "/products/";
  if (path === "/blog" || path.startsWith("/blog/")) return "/";
  return href;
}

export function navForLaunch<T extends { href: string; children?: { href: string; label: string }[] | undefined }>(
  items: T[],
): T[] {
  if (!LAUNCH_LITE) return items;
  return items.flatMap((item) => {
    if (isExcludedPath(item.href)) return [];
    const children = item.children?.flatMap((child) => {
      const path = pathOnly(child.href);
      if (path === "/custom-engineered") {
        return [{ ...child, href: "/products/#custom-engineered" }];
      }
      if (isExcludedPath(child.href)) return [];
      return [child];
    });
    return [{ ...item, children }];
  });
}

export function footerLinksForLaunch<T extends { href: string }>(links: T[]): T[] {
  if (!LAUNCH_LITE) return links;
  return links.flatMap((link) => {
    if (pathOnly(link.href) === "/custom-engineered") {
      return [{ ...link, href: "/products/#custom-engineered" }];
    }
    if (isExcludedPath(link.href)) return [];
    return [link];
  });
}
