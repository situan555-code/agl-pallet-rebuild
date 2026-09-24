import sizes from "@/content/resources/pillars/pallet-sizes.json";
import ispm from "@/content/resources/pillars/heat-treated-pallets-ispm-15.json";
import catalog from "@/content/resources/downloads.json";
import { plainText } from "@/components/resources/RichText";
import type { ResourceSection, ResourceSource, ResourceTable } from "@/lib/resources";

// Charts and the stamp sheet read the guide JSON. Tables are the same objects
// the guide renders, not a second copy of the numbers.

export const DOWNLOADS_PATH = "/resources/downloads/";
export const STAMP_DECODER_PATH = "/resources/heat-treated-pallets-ispm-15/stamp-decoder/";

export interface DownloadRelated {
  label: string;
  href: string;
}

export interface DownloadItem {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  metaDescription: string;
  figuresNote: string;
  exampleNote?: string;
  pdfSourceLine: string;
  pdfFilename: string;
  guideHref: string;
  guideLabel: string;
  updated: string;
  related: DownloadRelated[];
}

type GuideSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  table?: ResourceTable;
  after?: string[];
};

const sizeGuide = sizes as { sections: GuideSection[]; sources: ResourceSource[] };
const ispmGuide = ispm as { sections: GuideSection[]; sources: ResourceSource[] };

function guideSection(guide: { sections: GuideSection[] }, id: string): GuideSection {
  const found = guide.sections.find((section) => section.id === id);
  if (!found) throw new Error(`missing guide section ${id}`);
  return found;
}

export const downloadsIndex = catalog.index;
export const downloads = catalog.items as DownloadItem[];

export function downloadPath(slug: string) {
  return `${DOWNLOADS_PATH}${slug}/`;
}

export function downloadPdfPath(slug: string) {
  return `${DOWNLOADS_PATH}${slug}/pdf/`;
}

export function getDownload(slug: string) {
  return downloads.find((item) => item.slug === slug);
}

export function requireDownload(slug: string) {
  const item = getDownload(slug);
  if (!item) throw new Error(`unknown download ${slug}`);
  return item;
}

export function sizeChartSections(): ResourceSection[] {
  const sizeItem = catalog.items.find((item) => item.slug === "pallet-size-chart");
  const ids = sizeItem && "sectionIds" in sizeItem ? sizeItem.sectionIds : undefined;
  if (!ids || ids.length === 0) throw new Error("size chart section ids missing");
  const sections = ids.map((id) => guideSection(sizeGuide, id) as ResourceSection);
  const na = sections.find((section) => section.id === "north-american-sizes");
  const iso = sections.find((section) => section.id === "iso-and-international");
  const guideNa = guideSection(sizeGuide, "north-american-sizes");
  const guideIso = guideSection(sizeGuide, "iso-and-international");
  if (!na?.table || na.table !== guideNa.table) throw new Error("size chart is not using the guide's North American table");
  if (!iso?.table || iso.table !== guideIso.table) throw new Error("size chart is not using the guide's international table");
  if (na.table.rows.length < 11 || iso.table.rows.length < 6) throw new Error("size chart tables lost rows");
  return sections;
}

export function sizeChartSources(): ResourceSource[] {
  if (sizeGuide.sources.length === 0) throw new Error("size guide sources missing");
  return sizeGuide.sources;
}

function stampSection() {
  return guideSection(ispmGuide, "reading-the-stamp");
}

function treatmentSection() {
  return guideSection(ispmGuide, "ht-vs-mb");
}

function checklistSection() {
  return guideSection(ispmGuide, "export-checklist");
}

export function stampFieldCopy() {
  const list = stampSection().list ?? [];
  const symbol = list.find((item) => /IPPC symbol/i.test(item));
  const country = list.find((item) => /country code/i.test(item) && /hyphen/i.test(item));
  const producer = list.find((item) => /producer/i.test(item) && item.includes("January 1, 2026"));
  const treatment = list.find((item) => /treatment code/i.test(item));
  const dun = list.find((item) => /\bDUN\b/.test(item));
  if (!symbol || !country || !producer || !treatment || !dun) {
    throw new Error("stamp field explanations missing from the heat-treatment guide");
  }
  return { symbol, country, producer, treatment, dun };
}

export function hyphenRulePlain() {
  const text = plainText(stampFieldCopy().producer);
  const start = text.indexOf("APHIS and U.S. Customs");
  const dateAt = text.indexOf("January 1, 2026");
  const end = dateAt === -1 ? -1 : text.indexOf(".", dateAt);
  if (start === -1 || end === -1 || end < start) throw new Error("hyphen rule lost the enforcement date");
  return text.slice(start, end + 1);
}

export function treatmentCodes() {
  const table = treatmentSection().table;
  if (!table) throw new Error("treatment table missing");
  return table.rows.map((row) => ({
    code: plainText(row[0]).trim(),
    name: plainText(row[1]).trim(),
    involves: plainText(row[2]).trim(),
    notes: plainText(row[3] ?? "").trim(),
  }));
}

export function cheatSheetSections(): ResourceSection[] {
  const stamp = stampSection();
  const treatments = treatmentSection();
  const checklist = checklistSection();
  const fields = stampFieldCopy();
  if (!stamp.list || !stamp.paragraphs || !treatments.table || !treatments.paragraphs) {
    throw new Error("stamp cheat sheet source is incomplete");
  }
  if (treatments.table !== treatmentSection().table) throw new Error("cheat sheet treatment table drifted");
  const hyphen = checklist.list?.find((item) => /hyphen/i.test(item) && /[A-Z]{2}-\d+/.test(item));
  const dun = checklist.list?.find((item) => /\bDUN\b/.test(item));
  const brokerage = checklist.after?.find((item) => item.startsWith("AGL is a pallet brokerage"));
  if (!hyphen || !dun || !brokerage) throw new Error("hyphen, DUN, or brokerage line missing from the guide");
  const codes = treatmentCodes().map((row) => row.code);
  for (const code of ["HT", "DH", "MB", "SF"]) {
    if (!codes.includes(code)) throw new Error(`treatment code ${code} missing from the guide table`);
  }
  const sheet = catalog.items.find((item) => item.slug === "ispm-15-stamp-cheat-sheet");
  const hyphenHeading = sheet && "hyphenHeading" in sheet ? sheet.hyphenHeading : undefined;
  if (!hyphenHeading) throw new Error("cheat sheet heading missing");
  // The guide's closing sentence points at this sheet. Leave it on the guide
  // page only, so the sheet does not refer to itself.
  return [
    {
      id: stamp.id,
      heading: stamp.heading,
      paragraphs: stamp.paragraphs,
      list: [fields.symbol, fields.country, fields.producer, fields.treatment, fields.dun],
    },
    {
      id: treatments.id,
      heading: treatments.heading,
      paragraphs: treatments.paragraphs,
      table: treatments.table,
    },
    {
      id: "hyphen-and-dun",
      heading: hyphenHeading,
      list: [hyphen, dun],
      after: [brokerage],
    },
  ];
}

export function cheatSheetSources(): ResourceSource[] {
  const sheet = catalog.items.find((item) => item.slug === "ispm-15-stamp-cheat-sheet");
  const hrefs = sheet && "sourceHrefs" in sheet ? sheet.sourceHrefs : undefined;
  if (!hrefs || hrefs.length === 0) throw new Error("cheat sheet sources missing");
  return hrefs.map((href) => {
    const found = ispmGuide.sources.find((source) => source.href === href);
    if (!found) throw new Error(`cheat sheet source not on the guide: ${href}`);
    return found;
  });
}

export function sheetSources(slug: string): ResourceSource[] {
  if (slug === "pallet-size-chart") return sizeChartSources();
  if (slug === "ispm-15-stamp-cheat-sheet") return cheatSheetSources();
  throw new Error(`no sources for ${slug}`);
}

export function sheetSections(slug: string): ResourceSection[] {
  if (slug === "pallet-size-chart") return sizeChartSections();
  if (slug === "ispm-15-stamp-cheat-sheet") return cheatSheetSections();
  throw new Error(`no sheet for ${slug}`);
}

function assertDownloadSource() {
  const slugs = new Set(downloads.map((item) => item.slug));
  if (!slugs.has("pallet-size-chart") || !slugs.has("ispm-15-stamp-cheat-sheet")) {
    throw new Error("download catalog is missing a required sheet");
  }
  sizeChartSections();
  cheatSheetSections();
  stampFieldCopy();
  for (const item of downloads) {
    if (!item.pdfSourceLine || !item.figuresNote) throw new Error(`${item.slug} is missing its figure label`);
  }
  if (!/January 1, 2026/.test(hyphenRulePlain())) throw new Error("hyphen rule lost the enforcement date");
  if (!/\bDUN\b/.test(plainText(stampFieldCopy().dun))) throw new Error("DUN explanation missing");
}

assertDownloadSource();
