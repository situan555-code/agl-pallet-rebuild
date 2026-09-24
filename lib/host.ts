/**
 * Request Host checks for the domain-switch noindex rule.
 * Keyed off the Host header at request time — not a build-time env flag —
 * so the same deployment stops emitting noindex when Host is aglpallet.com.
 */

/** Hostname from a Host header (optional port). Lowercased, no trailing dot. */
export function hostnameFromHostHeader(hostHeader: string | null | undefined): string {
  if (!hostHeader) return "";
  let value = hostHeader.trim().toLowerCase();
  if (!value) return "";
  if (value.startsWith("[")) {
    const end = value.indexOf("]");
    return end === -1 ? value : value.slice(1, end);
  }
  const colon = value.lastIndexOf(":");
  if (colon !== -1 && /^\d+$/.test(value.slice(colon + 1))) {
    value = value.slice(0, colon);
  }
  if (value.endsWith(".")) value = value.slice(0, -1);
  return value;
}

/**
 * True for the production alias and every per-deployment preview alias.
 * aglpallet.com, www.aglpallet.com, and localhost do not match.
 */
export function isVercelAppHost(hostHeader: string | null | undefined): boolean {
  return hostnameFromHostHeader(hostHeader).endsWith(".vercel.app");
}
