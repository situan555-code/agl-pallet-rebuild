import { plainText } from "@/components/resources/RichText";
import {
  cheatSheetSections,
  downloadPath,
  requireDownload,
  sheetSections,
  sheetSources,
  sizeChartSections,
  type DownloadItem,
} from "@/lib/download-source";
import { PdfDoc, type PdfTable } from "@/lib/pdf-document";
import type { ResourceSection, ResourceSource } from "@/lib/resources";
import { getSiteUrl } from "@/lib/site-url";

// PDFs are laid out from sheetSections(), which returns the guide's own
// table objects and sentences. There is no second numeric table in this file.

function pdfPlain(text: string) {
  return plainText(text).replace(/\u00d7/g, "x").replace(/\s+/g, " ").trim();
}

function pdfTable(table: NonNullable<ResourceSection["table"]>): PdfTable {
  return {
    caption: pdfPlain(table.caption),
    columns: table.columns.map(pdfPlain),
    rows: table.rows.map((row) => row.map(pdfPlain)),
    note: table.note ? pdfPlain(table.note) : undefined,
  };
}

function renderSections(doc: PdfDoc, sections: ResourceSection[]) {
  for (const section of sections) {
    doc.heading(pdfPlain(section.heading));
    for (const paragraph of section.paragraphs ?? []) doc.paragraph(pdfPlain(paragraph));
    if (section.list && section.list.length > 0) doc.bullets(section.list.map(pdfPlain));
    if (section.table) doc.table(pdfTable(section.table));
    for (const paragraph of section.after ?? []) doc.paragraph(pdfPlain(paragraph));
  }
}

function renderSources(doc: PdfDoc, sources: ResourceSource[]) {
  doc.heading("Sources");
  for (const source of sources) {
    const note = source.note ? ` — ${pdfPlain(source.note)}` : "";
    doc.paragraph(`${pdfPlain(source.label)}${note}`, { size: 8, gap: 1 });
    doc.paragraph(source.href, { size: 7.5, color: [0.35, 0.33, 0.3], gap: 3 });
  }
}

function footerFor(item: DownloadItem) {
  return `AGL Pallet  ${getSiteUrl()}${downloadPath(item.slug)}`;
}

export function buildSizeChartPdf(): Uint8Array {
  const item = requireDownload("pallet-size-chart");
  const doc = new PdfDoc({
    breakable: true,
    continued: `${item.title} (continued)`,
    footer: footerFor(item),
  });
  doc.paragraph(item.title, { size: 16, bold: true, color: [31 / 255, 42 / 255, 25 / 255], gap: 4 });
  doc.paragraph(item.figuresNote, { size: 8.5, gap: 2 });
  doc.paragraph(item.pdfSourceLine, { size: 8, gap: 4 });
  renderSections(doc, sizeChartSections());
  renderSources(doc, sheetSources(item.slug));
  return doc.toBytes();
}

export function buildStampCheatSheetPdf(): Uint8Array {
  const item = requireDownload("ispm-15-stamp-cheat-sheet");
  const doc = new PdfDoc({
    breakable: false,
    margin: 40,
    footer: footerFor(item),
  });
  doc.paragraph(item.title, { size: 14, bold: true, color: [31 / 255, 42 / 255, 25 / 255], gap: 2 });
  doc.paragraph(item.figuresNote, { size: 8, gap: 1 });
  if (item.exampleNote) doc.paragraph(item.exampleNote, { size: 8, gap: 1 });
  doc.paragraph(item.pdfSourceLine, { size: 8, gap: 2 });
  renderSections(doc, cheatSheetSections());
  renderSources(doc, sheetSources(item.slug));
  const bytes = doc.toBytes();
  if (doc.pageCount !== 1) {
    throw new Error(`ISPM 15 stamp cheat sheet must be one page, got ${doc.pageCount}`);
  }
  return bytes;
}

export function buildDownloadPdf(slug: string): Uint8Array {
  if (slug === "pallet-size-chart") return buildSizeChartPdf();
  if (slug === "ispm-15-stamp-cheat-sheet") return buildStampCheatSheetPdf();
  throw new Error(`no pdf for ${slug}`);
}

function assertPdfs() {
  const size = buildSizeChartPdf();
  const stamp = buildStampCheatSheetPdf();
  for (const bytes of [size, stamp]) {
    const head = Buffer.from(bytes.subarray(0, 5)).toString("utf8");
    if (head !== "%PDF-") throw new Error("download pdf did not start with a PDF header");
  }
  // Touch every sheet once so a missing section fails the build here.
  for (const item of ["pallet-size-chart", "ispm-15-stamp-cheat-sheet"]) {
    if (sheetSections(item).length === 0) throw new Error(`${item} rendered no sections`);
  }
}

assertPdfs();
