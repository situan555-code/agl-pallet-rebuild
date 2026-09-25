import hub from "@/content/resources/hub.json";
import glossary from "@/content/resources/glossary.json";
import questions from "@/content/resources/questions.json";
import products from "@/content/pages/products.json";

export type SearchKind = "guide" | "glossary" | "question" | "product";

export type SearchEntry = {
  kind: SearchKind;
  title: string;
  href: string;
  description: string;
};

/**
 * Build-time search documents from content JSON only. No UI imports.
 */
export function buildSearchIndex(): SearchEntry[] {
  const guides: SearchEntry[] = hub.pillars.map((p) => ({
    kind: "guide",
    title: p.title,
    href: p.href.endsWith("/") ? p.href : `${p.href}/`,
    description: p.directAnswer,
  }));

  const terms: SearchEntry[] = glossary.terms.map((t) => ({
    kind: "glossary",
    title: t.term,
    href: t.link
      ? t.link.endsWith("/")
        ? t.link
        : `${t.link}/`
      : `/resources/glossary/#${t.id}`,
    description: t.definition,
  }));

  const qs: SearchEntry[] = questions.items.map((q) => ({
    kind: "question",
    title: q.question,
    href: `/resources/questions/${q.slug}/`,
    description: q.summary,
  }));

  const productEntries: SearchEntry[] = products.lines.map((line) => ({
    kind: "product",
    title: line.heading,
    href: line.cta?.href ?? "/products/",
    description: line.copy,
  }));

  return [...guides, ...terms, ...qs, ...productEntries];
}

export function searchIndex(query: string, entries = buildSearchIndex()): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return entries.filter(
    (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
  );
}
