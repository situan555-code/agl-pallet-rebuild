// Shared browser-context extraction for structure.js / content.js.
// Soft hyphens / ZWSP stripped so Divi "More\u00adReliable" matches "More Reliable".

function extractLandmarks() {
  const SEL = 'h1,h2,h3,nav,main,footer';
  const nodes = Array.from(document.querySelectorAll(SEL));
  const imgs = Array.from(document.querySelectorAll('img'));
  const allEls = Array.from(document.querySelectorAll('*'));
  const indexOf = (el) => allEls.indexOf(el);
  const norm = (s) =>
    (s || '')
      .replace(/[\u00ad\u200b\u200c\u200d\ufeff]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const marked = nodes.map((el) => {
    const type = el.tagName.toLowerCase();
    return {
      type,
      text: /^h[1-3]$/.test(type) ? norm(el.textContent || '') : '',
      idx: indexOf(el),
    };
  });

  return marked.map((lm, i) => {
    const nextIdx = i + 1 < marked.length ? marked[i + 1].idx : Infinity;
    let imageCount = 0;
    for (const img of imgs) {
      const ii = indexOf(img);
      if (ii >= lm.idx && ii < nextIdx) imageCount++;
    }
    return { type: lm.type, text: lm.text, imageCount };
  });
}

function extractTextBlocks() {
  const norm = (s) =>
    (s || '')
      .replace(/[\u00ad\u200b\u200c\u200d\ufeff]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  if (!document.body) return [];
  const raw = document.body.innerText || '';
  // Keep duplicates — live /about/ and /industries-served/ really repeat card copy.
  return raw.split('\n').map(norm).filter(Boolean);
}

module.exports = { extractLandmarks, extractTextBlocks };
