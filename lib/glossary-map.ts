import glossary from "@/content/resources/glossary.json";

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  href: string;
};

/**
 * Build-time map of lowercase term → definition for hover cards.
 * First-occurrence wrapping happens in the article renderer (R5.4).
 */
export function buildGlossaryTermMap(): Map<string, GlossaryTerm> {
  const map = new Map<string, GlossaryTerm>();
  for (const t of glossary.terms) {
    const href = t.link
      ? t.link.endsWith("/")
        ? t.link
        : `${t.link}/`
      : `/resources/glossary/#${t.id}`;
    const entry: GlossaryTerm = {
      id: t.id,
      term: t.term,
      definition: t.definition,
      href,
    };
    map.set(t.term.toLowerCase(), entry);
    const bare = t.term.replace(/\s*\([^)]*\)\s*/g, " ").trim().toLowerCase();
    if (bare && bare !== t.term.toLowerCase() && !map.has(bare)) {
      map.set(bare, entry);
    }
  }
  return map;
}

export function glossaryTermsSorted(): GlossaryTerm[] {
  return [...buildGlossaryTermMap().values()].filter(
    (t, i, all) => all.findIndex((x) => x.id === t.id) === i
  );
}
