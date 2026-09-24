/** Unresolved copy must never reach HTML. Empty, `{{`, or `TBD` all count. */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (value == null) return true;
  const text = value.trim();
  if (text.length === 0) return true;
  return text.includes("{{") || text.includes("TBD");
}
