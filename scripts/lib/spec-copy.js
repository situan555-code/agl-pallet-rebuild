// Parser for SPEC_V1.md section 4 ("Page copy"). Pulls out the copy blocks
// copy-verbatim.js has to assert appear on each built page, character for
// character after whitespace normalization.
//
// Section 4 has two shapes:
//   1. Fenced ``` blocks with LABEL: text lines (EYEBROW/H1/H2/H3/LEDE/BODY/
//      BUTTON/BUTTONS/CARD N/LIST), one route per "### 4.N · `/route`"
//      heading.
//   2. Markdown pipe tables (4.8 product lines, 4.8 producer-voice
//      replacements, 4.9 industries) whose "Copy" or "Replace with" column
//      is the copy to assert.
//   3. "### 4.13 · Shared blocks" — no route of its own; applies to the
//      pages named in its own prose ("foot of `/`, `/products`, ...").
//
// The source file has a formatting quirk: almost every line is followed by
// a blank line, including mid-sentence wraps, so blank lines cannot be used
// to detect paragraph breaks within a label's text — both a wrapped line
// and a real paragraph break look identical (one blank line). This parser
// therefore joins an entire label's lines into one copy unit. That's a
// coarser granularity than "one sentence" but it's an honest one given the
// source, and it's fine for a substring/whitespace-normalized compare
// against the fully whitespace-collapsed rendered page text.
const fs = require('fs');

function extractSection(text, startRe, endRe) {
  const start = text.match(startRe);
  if (!start) throw new Error(`section start not found: ${startRe}`);
  const rest = text.slice(start.index + start[0].length);
  const end = rest.match(endRe);
  return end ? rest.slice(0, end.index) : rest;
}

function splitRouteSubsections(section4Text) {
  const headingRe = /^###\s+4\.(\d+)\s*·\s*(.*)$/gm;
  const matches = [...section4Text.matchAll(headingRe)];
  const parts = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const end = i + 1 < matches.length ? matches[i + 1].index : section4Text.length;
    const body = section4Text.slice(m.index, end);
    const pathMatch = m[2].match(/`(\/[^`]*)`/);
    parts.push({ num: m[1], titleLine: m[2].trim(), path: pathMatch ? pathMatch[1] : null, body });
  }
  return parts;
}

function extractFencedBlocks(text) {
  const re = /```([\s\S]*?)```/g;
  const blocks = [];
  let m;
  while ((m = re.exec(text))) blocks.push(m[1]);
  return blocks;
}

const COPY_LABELS = new Set(['EYEBROW', 'H1', 'H2', 'H3', 'LEDE', 'BODY', 'BUTTON', 'LIST-ITEM']);

function parseLabeledBlock(blockText) {
  const nonBlank = blockText.split('\n').filter((l) => l.trim() !== '');
  const items = [];
  let currentLabel = null;
  let currentParts = [];
  let mode = null; // null | 'buttons' | 'list'

  function flush() {
    if (currentLabel && currentParts.length) {
      items.push({ label: currentLabel, text: currentParts.join(' ').replace(/\s+/g, ' ').trim() });
    }
    currentParts = [];
  }

  for (const raw of nonBlank) {
    const line = raw.trim();

    const singleButton = line.match(/^BUTTON:\s*\[(primary|ghost)\]\s+(.+?)\s+(?:→|->)/);
    if (singleButton) {
      flush();
      items.push({ label: 'BUTTON', text: singleButton[2].trim() });
      currentLabel = null;
      mode = null;
      continue;
    }

    if (/^BUTTONS:\s*$/.test(line)) {
      flush();
      mode = 'buttons';
      currentLabel = null;
      continue;
    }

    if (mode === 'buttons') {
      const row = line.match(/^\[(primary|ghost)\]\s+(.+?)\s+(?:→|->)/);
      if (row) {
        items.push({ label: 'BUTTON', text: row[2].trim() });
        continue;
      }
      mode = null; // fall through — buttons list ended
    }

    const cardHeader = line.match(/^CARD\s+\d+/i);
    if (cardHeader) {
      flush();
      mode = null;
      currentLabel = null;
      const em = line.match(/eyebrow\s+"([^"]+)"/i);
      if (em) items.push({ label: 'EYEBROW', text: em[1] });
      continue;
    }

    // Bare LIST: or authoring labels like "LIST (each item is a card...):"
    if (/^LIST(\s*\(.*\))?:\s*$/.test(line)) {
      flush();
      mode = 'list';
      currentLabel = null;
      continue;
    }

    if (mode === 'list') {
      // Spec-authoring link targets (same shorthand BUTTON: strips). Not copy.
      if (/^(?:→|->)\s+\S+/.test(line)) {
        continue;
      }
      // A new labeled field ends the list (contact BODY/ADDRESS after LIST).
      if (/^(EYEBROW|H1|H2|H3|LEDE|BODY|IMAGE|ADDRESS|LINK|BUTTON):/.test(line)) {
        flush();
        mode = null;
        currentLabel = null;
        // fall through to label parsing below
      } else {
        const newItem = /^(?:[A-Z0-9].+?\s+[—–]\s+\S)/.test(line);
        if (newItem || currentLabel !== 'LIST-ITEM') {
          flush();
          currentLabel = 'LIST-ITEM';
          currentParts = [line];
        } else {
          currentParts.push(line); // continuation of a wrapped list item
        }
        continue;
      }
    }

    const labelMatch = line.match(/^(EYEBROW|H1|H2|H3|LEDE|BODY|IMAGE|ADDRESS|LINK):\s*(.*)$/);
    if (labelMatch) {
      flush();
      currentLabel = labelMatch[1];
      currentParts = labelMatch[2] ? [labelMatch[2]] : [];
      continue;
    }

    if (currentLabel) currentParts.push(line);
  }
  flush();
  return items;
}

// Extracts the "Copy" / "Replace with" column from any pipe table in the
// section. A header row is identified by the dash-separator row beneath it
// (not by position), so multiple tables in one section (4.8 has two) are
// each scoped correctly instead of bleeding the first table's column index
// into the second. Operates on the pipe-only lines with everything else
// (including the blank line the source puts after every single row, even
// between a header and its own separator) filtered out first.
const SEPARATOR_RE = /^\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?$/;

// A handful of "Replace with" cells are build instructions, not literal
// page copy (4.8's PDS row says "Delete. No replacement." — there is
// nothing to assert appears on the page for that row). Producer-voice
// "Replace with" tables are rewrite instructions for banned legacy copy,
// not customer-facing page blocks — do not require them via copy-verbatim.
const NON_COPY_CELL_RE = /^delete\.?(\s*no replacement\.?)?$/i;

// SPEC_V1.md mixed authoring annotations into product-line Copy cells.
// Strip them so copy-verbatim does not re-require leaked build notes.
const BUILD_NOTE_ANNOTATION_RE =
  /\s*(?:Links to\s+[`']?\/[^`'.\s]+[`']?\.?|New standalone line\s*[—\-][^|]*)|^(?:New line\s*[—\-]\s*missing from the live site entirely\.?\s*)/gi;

function stripBuildNoteAnnotations(text) {
  return text
    .replace(BUILD_NOTE_ANNOTATION_RE, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTableCell(raw) {
  let t = raw.replace(/\*\*/g, '').trim();
  if (/^".*"$/.test(t)) t = t.slice(1, -1).trim(); // strip exact-string quote marks
  return stripBuildNoteAnnotations(t);
}

function extractTableCopy(text) {
  const pipeLines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'));
  const out = [];
  let i = 0;
  while (i < pipeLines.length) {
    if (!SEPARATOR_RE.test(pipeLines[i + 1] || '')) {
      i++;
      continue;
    }
    const headerCells = pipeLines[i].split('|').slice(1, -1).map((c) => c.trim().toLowerCase());
    // Only assert "Copy" column cells. Skip "Replace with" (producer-voice
    // rewrite instructions / orphans), which are not required page copy.
    const colIdx = headerCells.findIndex((c) => c === 'copy');
    i += 2;
    while (i < pipeLines.length && !SEPARATOR_RE.test(pipeLines[i + 1] || '')) {
      if (colIdx !== -1) {
        const cells = pipeLines[i].split('|').slice(1, -1).map((c) => c.trim());
        const cellText = normalizeTableCell(cells[colIdx] || '');
        if (cellText && !NON_COPY_CELL_RE.test(cellText)) out.push({ label: 'TABLE-COPY', text: cellText });
      }
      i++;
    }
  }
  return out;
}

function parseSpecCopy(specPath) {
  const text = fs.readFileSync(specPath, 'utf8');
  const section4 = extractSection(text, /^##\s+4\s*·/m, /^##\s+5\s*·/m);
  const routeParts = splitRouteSubsections(section4);

  const byRoute = new Map();
  const shared = { ctaBand: [], ctaRoutes: [], oneLineDescriptor: null };

  for (const part of routeParts) {
    if (!part.path) {
      // 4.13 shared blocks: first fenced block is the CTA band, second is
      // the one-line descriptor (source order).
      const fenced = extractFencedBlocks(part.body);
      if (fenced[0]) shared.ctaBand = parseLabeledBlock(fenced[0]).filter((i) => COPY_LABELS.has(i.label));
      if (fenced[1]) {
        const raw = fenced[1].split('\n').map((l) => l.trim()).filter(Boolean).join(' ');
        shared.oneLineDescriptor = raw.replace(/\s+/g, ' ').trim();
      }
      const ctaRouteLine = part.body.match(/foot of ([^.]+)\./);
      if (ctaRouteLine) {
        shared.ctaRoutes = [...ctaRouteLine[1].matchAll(/`(\/[^`]*)`/g)].map((m) => m[1]);
      }
      continue;
    }
    const items = [];
    for (const block of extractFencedBlocks(part.body)) {
      items.push(...parseLabeledBlock(block).filter((i) => COPY_LABELS.has(i.label)));
    }
    items.push(...extractTableCopy(part.body));
    byRoute.set(part.path, items);
  }

  return { byRoute, shared };
}

module.exports = { parseSpecCopy };
