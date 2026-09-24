import hub from "@/content/resources/hub.json";

// Shape of one pillar guide in content/resources/pillars/<slug>.json.
// Paragraph and list strings may carry inline links as [label](href).

export interface ResourceSource {
  label: string;
  href: string;
  note?: string;
}

export interface ResourceTable {
  caption: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export interface ResourceSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  ordered?: boolean;
  table?: ResourceTable;
  /**
   * Backing file in content/resources/data/. The table renders only when that
   * file has measured or quoted values. An empty file stays a sentence.
   */
  dataRef?: string;
  after?: string[];
}

export interface ResourceQuestion {
  id: string;
  question: string;
  answer: string[];
}

export interface ResourcePillar {
  slug: string;
  title: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  directAnswer: string;
  published: string;
  updated: string;
  sections: ResourceSection[];
  questions?: { heading: string; items: ResourceQuestion[] };
  sources: ResourceSource[];
  related: string[];
  cta: { heading: string; body: string };
}

export type HubPillar = (typeof hub.pillars)[number];

export function getHubPillar(slug: string): HubPillar | undefined {
  return hub.pillars.find((p) => p.slug === slug);
}

export function quoteHref(source: string) {
  return `/request-a-quote/?source=${encodeURIComponent(source)}`;
}

/**
 * First complete sentence, for hub and related-guide cards. Abbreviations
 * such as U.S. are not treated as the end of the sentence.
 */
export function firstSentence(text: string) {
  const masked = text.replace(/\b(?:U\.S|U\.K|No|vs|Dr|St|ft|in|lb|mm)\./g, (m) => m.replace(/\./g, "\u0000"));
  const match = masked.match(/^[\s\S]*?[.!?](?=\s|$)/);
  return (match ? match[0] : masked).replace(/\u0000/g, ".").trim();
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
