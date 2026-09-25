import Link from "next/link";
import { Fragment } from "react";

// Renders [label](href) inline links inside content strings. Internal paths
// use next/link; outbound links open in place with rel="noopener".
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

const linkClass =
  "font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:decoration-brand-green focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_RE)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      href.startsWith("/") || href.startsWith("#") ? (
        <Link key={start} href={href} prefetch={false} className={linkClass}>
          {label}
        </Link>
      ) : (
        <a key={start} href={href} rel="noopener" className={linkClass}>
          {label}
        </a>
      )
    );
    last = start + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts.map((p, i) => (typeof p === "string" ? <Fragment key={`t${i}`}>{p}</Fragment> : p))}</>;
}

// Plain-text form of a content string, for JSON-LD and meta.
export function plainText(text: string) {
  return text.replace(LINK_RE, "$1");
}
