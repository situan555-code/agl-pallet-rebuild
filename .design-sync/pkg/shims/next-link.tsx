// design-sync shim for next/link: a plain anchor. Next-only props are dropped.
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

type Href = string | { pathname?: string; hash?: string; query?: Record<string, string> };

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: Href;
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  legacyBehavior?: boolean;
  passHref?: boolean;
  locale?: string | false;
  children?: ReactNode;
};

function toHref(href: Href): string {
  if (typeof href === "string") return href;
  const q = href.query ? "?" + new URLSearchParams(href.query).toString() : "";
  return (href.pathname ?? "") + q + (href.hash ? "#" + href.hash : "");
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch, replace, scroll, shallow, legacyBehavior, passHref, locale, ...rest },
  ref,
) {
  return <a ref={ref} href={toHref(href)} {...rest} />;
});

export default Link;
