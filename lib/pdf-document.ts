// Small PDF 1.4 writer. Standard Helvetica fonts only (WinAnsi), so a chart
// can be produced in the Node build without a PDF dependency.
// The multiplication sign is not in that encoding; callers should pass text
// that already uses "x" if they need that glyph.

const PAGE_W = 612;
const PAGE_H = 792;

export type Rgb = [number, number, number];

export const PDF_GREEN: Rgb = [31 / 255, 42 / 255, 25 / 255];
export const PDF_INK: Rgb = [0.23, 0.2, 0.18];
export const PDF_MUTED: Rgb = [0.35, 0.33, 0.3];

const WIN: Record<string, number> = {
  "°": 0xb0,
  "–": 0x96,
  "—": 0x97,
  "‘": 0x91,
  "’": 0x92,
  "“": 0x93,
  "”": 0x94,
  "·": 0xb7,
  "•": 0x95,
  "×": 0x78,
  " ": 0x20,
  "é": 0xe9,
  "½": 0xbd,
  "¼": 0xbc,
  "¾": 0xbe,
};

function num(n: number) {
  return (Math.round(n * 100) / 100).toString();
}

function rgb(color: Rgb) {
  return `${num(color[0])} ${num(color[1])} ${num(color[2])}`;
}

function charEm(ch: string) {
  if (ch === " ") return 0.28;
  if ("ijl.,'`:;|!".includes(ch)) return 0.28;
  if ("mwMW@%".includes(ch)) return 0.84;
  if (ch >= "A" && ch <= "Z") return 0.66;
  if (ch >= "0" && ch <= "9") return 0.56;
  return 0.5;
}

export function textWidth(text: string, size: number, bold: boolean) {
  const scale = bold ? 1.08 : 1;
  let width = 0;
  for (const ch of text) width += charEm(ch) * size * scale;
  return width;
}

export function wrapText(text: string, maxWidth: number, size: number, bold: boolean) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let line = "";
  const push = (value: string) => {
    if (value) lines.push(value);
  };
  for (const word of words) {
    if (textWidth(word, size, bold) > maxWidth) {
      push(line);
      line = "";
      let chunk = "";
      for (const ch of word) {
        const next = chunk + ch;
        if (textWidth(next, size, bold) > maxWidth && chunk) {
          push(chunk);
          chunk = ch;
        } else {
          chunk = next;
        }
      }
      line = chunk;
      continue;
    }
    const next = line ? `${line} ${word}` : word;
    if (textWidth(next, size, bold) <= maxWidth) line = next;
    else {
      push(line);
      line = word;
    }
  }
  push(line);
  return lines;
}

function pdfLiteral(text: string) {
  let out = "(";
  for (const ch of text) {
    let code = ch.charCodeAt(0);
    if (code > 126 || code < 32) {
      const mapped = WIN[ch];
      if (mapped === undefined) continue;
      code = mapped;
    }
    if (code === 0x28 || code === 0x29 || code === 0x5c) out += "\\" + String.fromCharCode(code);
    else if (code < 32 || code > 126) out += "\\" + code.toString(8).padStart(3, "0");
    else out += String.fromCharCode(code);
  }
  out += ")";
  return out;
}

export interface PdfTable {
  caption: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export class PdfDoc {
  readonly margin: number;
  readonly width: number;
  private readonly breakable: boolean;
  private readonly continued: string;
  private readonly footer: string;
  private ops: string[] = [];
  private pages: string[] = [];
  y: number;

  constructor(options?: { margin?: number; breakable?: boolean; continued?: string; footer?: string }) {
    this.margin = options?.margin ?? 44;
    this.width = PAGE_W - this.margin * 2;
    this.breakable = options?.breakable ?? true;
    this.continued = options?.continued ?? "";
    this.footer = options?.footer ?? "AGL Pallet";
    this.y = PAGE_H - this.margin;
  }

  get pageCount() {
    return this.pages.length + (this.ops.length > 0 ? 1 : 0);
  }

  private drawText(text: string, x: number, y: number, size: number, bold: boolean, color: Rgb) {
    const font = bold ? "F2" : "F1";
    this.ops.push("BT");
    this.ops.push(`${rgb(color)} rg`);
    this.ops.push(`/${font} ${num(size)} Tf`);
    this.ops.push(`1 0 0 1 ${num(x)} ${num(y)} Tm`);
    this.ops.push(`${pdfLiteral(text)} Tj`);
    this.ops.push("ET");
  }

  private hline(y: number, weight: number) {
    this.ops.push(`${rgb(PDF_GREEN)} RG`);
    this.ops.push(`${num(weight)} w`);
    this.ops.push(`${num(this.margin)} ${num(y)} m ${num(this.margin + this.width)} ${num(y)} l S`);
  }

  private finishPage() {
    const pageNumber = this.pages.length + 1;
    this.drawText(this.footer, this.margin, 26, 8, false, PDF_MUTED);
    this.drawText(String(pageNumber), this.margin + this.width - 12, 26, 8, false, PDF_MUTED);
    this.pages.push(this.ops.join("\n"));
    this.ops = [];
  }

  private ensure(height: number) {
    if (this.y - height >= this.margin) return;
    if (!this.breakable) {
      throw new Error(`stamp cheat sheet overflowed one page with ${Math.ceil(height)}pt still to draw`);
    }
    this.finishPage();
    this.y = PAGE_H - this.margin;
    if (this.continued) {
      this.paragraph(this.continued, { size: 9, bold: true, color: PDF_GREEN, gap: 2 });
    }
  }

  gap(amount: number) {
    this.y -= amount;
  }

  paragraph(
    text: string,
    opts?: { size?: number; bold?: boolean; color?: Rgb; indent?: number; gap?: number; leading?: number }
  ) {
    const size = opts?.size ?? 9;
    const bold = opts?.bold ?? false;
    const leading = opts?.leading ?? size * 1.3;
    const indent = opts?.indent ?? 0;
    const lines = wrapText(text, this.width - indent, size, bold);
    if (lines.length === 0) return;
    for (const line of lines) {
      this.ensure(leading);
      this.drawText(line, this.margin + indent, this.y - size, size, bold, opts?.color ?? PDF_INK);
      this.y -= leading;
    }
    this.y -= opts?.gap ?? 3;
  }

  bullets(items: string[], size = 8.5) {
    for (const item of items) {
      this.paragraph(`- ${item}`, { size, indent: 2, gap: 2 });
    }
    this.y -= 2;
  }

  heading(text: string) {
    this.y -= 6;
    this.paragraph(text, { size: 11, bold: true, color: PDF_GREEN, gap: 2 });
    this.ensure(4);
    this.hline(this.y, 0.8);
    this.y -= 8;
  }

  table(table: PdfTable) {
    this.paragraph(table.caption, { size: 8, bold: true, color: PDF_GREEN, gap: 2 });
    const columns = table.columns;
    const rows = table.rows;
    const weights = columns.map((column, index) => {
      const sample = [column, ...rows.map((row) => row[index] ?? "")];
      const longest = sample.reduce((max, cell) => Math.max(max, Math.min(cell.length, 48)), 4);
      return Math.max(6, longest);
    });
    const sum = weights.reduce((total, weight) => total + weight, 0);
    const colW = weights.map((weight) => (weight / sum) * this.width);
    const paint = (cells: string[], header: boolean) => {
      const size = header ? 7.5 : 7.5;
      const wrapped = cells.map((cell, index) => wrapText(cell, Math.max(12, colW[index] - 6), size, header));
      const lineCount = Math.max(1, ...wrapped.map((lines) => lines.length));
      const leading = size * 1.25;
      const height = lineCount * leading + 5;
      this.ensure(height);
      const top = this.y;
      wrapped.forEach((lines, index) => {
        const x = this.margin + colW.slice(0, index).reduce((total, width) => total + width, 0) + 2;
        lines.forEach((line, lineIndex) => {
          this.drawText(line, x, top - size - lineIndex * leading, size, header, header ? PDF_GREEN : PDF_INK);
        });
      });
      this.y = top - height;
      this.hline(this.y + 2, header ? 0.9 : 0.3);
    };
    paint(columns, true);
    for (const row of rows) paint(row, false);
    if (table.note) this.paragraph(table.note, { size: 7.5, color: PDF_MUTED, gap: 2 });
    this.y -= 2;
  }

  toBytes(): Uint8Array {
    if (this.ops.length > 0 || this.pages.length === 0) this.finishPage();
    return serializePdf(this.pages);
  }
}

function serializePdf(contents: string[]): Uint8Array {
  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
  let id = 5;
  const kids: string[] = [];
  for (const stream of contents) {
    const contentId = id++;
    const pageId = id++;
    const length = Buffer.byteLength(stream, "utf8");
    objects[contentId] = `<< /Length ${length} >>\nstream\n${stream}\nendstream`;
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`;
    kids.push(`${pageId} 0 R`);
  }
  objects[2] = `<< /Type /Pages /Count ${kids.length} /Kids [${kids.join(" ")}] >>`;

  let body = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (let i = 1; i < objects.length; i++) {
    if (!objects[i]) throw new Error(`pdf object ${i} is empty`);
    offsets[i] = Buffer.byteLength(body, "utf8");
    body += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefPos = Buffer.byteLength(body, "utf8");
  body += `xref\n0 ${objects.length}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 1; i < objects.length; i++) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return new Uint8Array(Buffer.from(body, "utf8"));
}
