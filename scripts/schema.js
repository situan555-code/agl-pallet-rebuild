#!/usr/bin/env node
// §6.2 — JSON-LD schema check for every sitemap URL.
//
// Starts `next start` (run after `next build`) and fails on validation errors.
// Rules are the schema.org shape we publish, plus a match against the rendered
// page so a stale headline, date, term, or PPI field cannot pass.
// No HowTo. FAQPage only when that page shows the questions.
// Does not call validator.schema.org (the gate has to run offline).
//
// §6.3 — prints a markdown status table for every sitemap URL.
const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.SCHEMA_PORT || 4011);
const HOST = "127.0.0.1";
const ORIGIN = "https://aglpallet.com";
const VERCEL_HOST = "nx7k-lab-m4.vercel.app";
const SITE_HOST = "aglpallet.com";
const PPI_CSV_PATH = "/resources/pallet-prices/ppi-csv/";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ALLOWED = {
  Organization: ["@context", "@type", "@id", "name", "url", "logo", "telephone", "email", "areaServed", "sameAs"],
  TechArticle: ["@context", "@type", "headline", "description", "url", "mainEntityOfPage", "datePublished", "dateModified", "inLanguage", "author", "reviewedBy", "publisher"],
  Article: ["@context", "@type", "headline", "description", "url", "mainEntityOfPage", "datePublished", "dateModified", "inLanguage", "author", "reviewedBy", "publisher"],
  BreadcrumbList: ["@context", "@type", "itemListElement"],
  ListItem: ["@type", "position", "name", "item"],
  FAQPage: ["@context", "@type", "mainEntity"],
  Question: ["@type", "name", "acceptedAnswer"],
  Answer: ["@type", "text"],
  DefinedTermSet: ["@context", "@type", "@id", "name", "url", "hasDefinedTerm"],
  DefinedTerm: ["@type", "@id", "name", "description", "url", "inDefinedTermSet"],
  WebApplication: ["@context", "@type", "name", "description", "url", "applicationCategory", "operatingSystem", "isAccessibleForFree", "offers", "publisher"],
  Offer: ["@type", "price", "priceCurrency"],
  Dataset: ["@context", "@type", "name", "description", "url", "creator", "temporalCoverage", "variableMeasured", "distribution", "isAccessibleForFree"],
  PropertyValue: ["@type", "name", "propertyID", "unitText"],
  DataDownload: ["@type", "encodingFormat", "contentUrl"],
  Person: ["@type", "name", "jobTitle"],
};

const BANNED_TYPES = new Set(["HowTo", "LocalBusiness"]);

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function decode(text) {
  return String(text)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function norm(text) {
  return decode(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    // Inline tags become spaces, so "label</a>." would otherwise read "label ."
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

function visibleText(html) {
  return norm(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
}

function attr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i");
  const match = tag.match(re);
  if (!match) return null;
  return decode(match[2] ?? match[3] ?? "");
}

function metaContent(html, key, attrName = "name") {
  for (const tag of html.matchAll(/<meta\b[^>]*>/gi)) {
    const id = attr(tag[0], attrName);
    if (id && id.toLowerCase() === key.toLowerCase()) return attr(tag[0], "content");
  }
  return null;
}

function canonicalHref(html) {
  for (const tag of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = (attr(tag[0], "rel") || "").toLowerCase().split(/\s+/);
    if (rel.includes("canonical")) return attr(tag[0], "href");
  }
  return null;
}

function firstH1(html) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? norm(match[1]) : null;
}

function titleText(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? norm(match[1]) : null;
}

function shortAnswerWords(html) {
  const at = html.indexOf('id="short-answer"');
  if (at === -1) return null;
  const close = html.indexOf("</p>", at);
  if (close === -1) return null;
  const next = html.slice(close).match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  if (!next) return null;
  const text = norm(next[1]);
  if (!text) return 0;
  return text.split(" ").length;
}

function breadcrumbNav(html) {
  const match = html.match(/<nav\b[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/i);
  if (!match) return null;
  const names = [];
  const hrefs = [];
  for (const tag of match[1].matchAll(/<(a|span)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const text = norm(tag[3]);
    if (!text || text === "/") continue;
    names.push(text);
    if (tag[1].toLowerCase() === "a") hrefs.push({ name: text, href: attr(`<a ${tag[2]}>`, "href") });
  }
  return { names, hrefs };
}

function jsonLdBlocks(html) {
  const blocks = [];
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(re)) blocks.push(match[1].trim());
  return blocks;
}

function rootsOf(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data["@graph"])) return data["@graph"];
  return [data];
}

function typesOf(node) {
  if (!node || typeof node !== "object") return [];
  const value = node["@type"];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function walk(node, fn) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item) => walk(item, fn));
    return;
  }
  fn(node);
  for (const value of Object.values(node)) walk(value, fn);
}

function absUrl(value) {
  return typeof value === "string" && value.startsWith(`${ORIGIN}/`) || value === ORIGIN;
}

function pathnameOf(value) {
  const url = new URL(value);
  let pathname = url.pathname || "/";
  if (pathname.length > 1 && !pathname.endsWith("/") && !pathname.includes(".")) pathname += "/";
  return pathname;
}

function monthLabel(ym) {
  const [year, month] = ym.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

function request(urlPath, host, redirectsLeft = 0) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      { hostname: HOST, port: PORT, path: urlPath, headers: { host, accept: "*/*" } },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const location = res.headers.location;
          if (redirectsLeft > 0 && res.statusCode >= 300 && res.statusCode < 400 && location) {
            const next = new URL(location, `http://${HOST}:${PORT}`);
            resolve(request(`${next.pathname}${next.search}`, host, redirectsLeft - 1));
            return;
          }
          const body = Buffer.concat(chunks);
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body,
            text: body.toString("utf8"),
          });
        });
      }
    );
    req.setTimeout(60_000, () => req.destroy(new Error(`timeout ${urlPath}`)));
    req.on("error", reject);
  });
}

function robotsHeader(headers) {
  const value = headers["x-robots-tag"];
  if (!value) return "(none)";
  return Array.isArray(value) ? value.join(", ") : value;
}

function isHtmlResponse(res) {
  const type = String(res.headers["content-type"] || "");
  return type.includes("text/html") || res.text.startsWith("<!DOCTYPE") || res.text.startsWith("<html");
}

function cell(value) {
  return String(value ?? "—").replace(/\|/g, "/").replace(/\s+/g, " ").trim() || "—";
}

function internalRefs(html) {
  const refs = [];
  const tags = html.matchAll(/<(a|form)\b[^>]*>/gi);
  for (const tag of tags) {
    const raw = tag[1].toLowerCase() === "form" ? attr(tag[0], "action") : attr(tag[0], "href");
    if (!raw) continue;
    refs.push(raw);
  }
  return refs;
}

function classifyRef(raw) {
  const href = raw.trim();
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("sms:")) return null;
  if (href.startsWith("#")) return { kind: "hash", path: null, hash: href.slice(1), original: href };
  if (href.startsWith("javascript:")) return { kind: "bad", original: href };
  let url;
  try {
    url = new URL(href, `${ORIGIN}/`);
  } catch {
    return { kind: "bad", original: href };
  }
  const host = url.hostname.toLowerCase();
  const internalHost = host === "aglpallet.com" || host === "www.aglpallet.com" || host.endsWith(".vercel.app");
  const rootRelative = href.startsWith("/") && !href.startsWith("//");
  if (!rootRelative && !internalHost) return null;
  const absolute = !rootRelative;
  let pathname = url.pathname || "/";
  if (pathname.length > 1 && !pathname.endsWith("/") && !pathname.includes(".")) pathname += "/";
  return {
    kind: absolute ? "absolute" : "relative",
    path: `${pathname}${url.search}`,
    hash: url.hash ? url.hash.slice(1) : "",
    original: href,
  };
}

async function main() {
  if (!fs.existsSync(path.join(ROOT, ".next", "BUILD_ID"))) {
    console.error("schema: .next build is missing. Run next build first.");
    process.exit(1);
  }

  const hub = readJson("content/resources/hub.json");
  const site = readJson("content/site.json");
  const glossary = readJson("content/resources/glossary.json");
  const calculators = readJson("content/resources/calculators.json");
  const questions = readJson("content/resources/questions.json");
  const ppi = readJson("content/resources/data/ppi.json");

  const guidePaths = new Set(hub.pillars.map((pillar) => pillar.href));
  const webAppPaths = new Set(
    calculators.tools.map((tool) => tool.href).filter((href) => !href.includes("#"))
  );
  webAppPaths.add("/resources/pallets-per-truckload/");
  webAppPaths.add("/resources/heat-treated-pallets-ispm-15/stamp-decoder/");
  const pricesPath = hub.pillars.find((pillar) => pillar.slug === "pallet-prices").href;
  const glossaryPath = hub.pillars.find((pillar) => pillar.slug === "glossary").href;
  const skipped = ["what-does-mb-mean-on-a-pallet", "are-plastic-pallets-better-than-wood"];

  const child = spawn("npx", ["next", "start", "-p", String(PORT), "-H", HOST], {
    cwd: ROOT,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let serverLog = "";
  child.stdout.on("data", (chunk) => {
    serverLog += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    serverLog += chunk.toString();
  });
  const stop = () => {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      try {
        child.kill("SIGTERM");
      } catch {
        /* already gone */
      }
    }
  };
  process.on("exit", stop);

  const errors = [];
  const fail = (url, message) => errors.push({ url, message });

  try {
    const started = Date.now();
    while (true) {
      try {
        const probe = await request("/", SITE_HOST, 0);
        if (probe.status) break;
      } catch {
        if (Date.now() - started > 60_000) throw new Error("next start did not become ready");
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    const sitemap = await request("/sitemap.xml", SITE_HOST, 0);
    if (sitemap.status !== 200) fail("/sitemap.xml", `status ${sitemap.status}`);
    const locs = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1].trim()));
    if (locs.length === 0) fail("/sitemap.xml", "no URLs");
    for (const loc of locs) {
      if (!loc.startsWith(`${ORIGIN}/`) && loc !== ORIGIN) fail(loc, "sitemap URL is not on https://aglpallet.com");
      if (loc.includes("vercel.app")) fail(loc, "sitemap URL uses the demo host");
      if (loc.includes("sell-recycle")) fail(loc, "sell/recycle must stay out of the sitemap");
      for (const slug of skipped) {
        if (loc.includes(slug)) fail(loc, `skipped question ${slug} is in the sitemap`);
      }
    }

    const robots = await request("/robots.txt", SITE_HOST, 0);
    if (robots.status !== 200) fail("/robots.txt", `status ${robots.status}`);
    if (/Disallow:\s*\//i.test(robots.text)) fail("/robots.txt", "Disallow: / is not allowed");
    if (!robots.text.includes(`${ORIGIN}/sitemap.xml`)) fail("/robots.txt", "sitemap line is not SITE_URL");

    for (const extra of ["/llms.txt", "/llms.txt/", "/resources/sell-recycle-pallets/"]) {
      const res = await request(extra, SITE_HOST, 0);
      if (res.status !== 404) fail(extra, `expected 404, got ${res.status}`);
    }

    const cache = new Map();
    const rows = [];

    for (const loc of locs) {
      const pagePath = pathnameOf(loc);
      const prod = await request(pagePath, SITE_HOST, 0);
      const preview = await request(pagePath, VERCEL_HOST, 0);
      cache.set(pagePath, prod);
      const html = isHtmlResponse(prod);
      const prodRobots = robotsHeader(prod.headers);
      const previewRobots = robotsHeader(preview.headers);
      if (prod.status !== 200) fail(pagePath, `status ${prod.status}`);
      if (preview.status !== 200) fail(pagePath, `vercel host status ${preview.status}`);
      if (prodRobots.toLowerCase().includes("noindex")) fail(pagePath, `aglpallet.com sent X-Robots-Tag: ${prodRobots}`);
      if (!previewRobots.toLowerCase().includes("noindex")) {
        fail(pagePath, `*.vercel.app missing noindex (got ${previewRobots})`);
      }

      const linkIssues = [];
      let types = [];

      if (!html) {
        const type = String(prod.headers["content-type"] || "");
        if (!type.includes("application/pdf")) fail(pagePath, `expected a PDF, got ${type || "no content-type"}`);
        if (prod.text.includes("HowTo") || prod.text.includes("application/ld+json")) {
          fail(pagePath, "PDF response contains JSON-LD or HowTo");
        }
        rows.push({
          url: loc,
          status: prod.status,
          title: "—",
          h1: "—",
          words: "—",
          canonical: "—",
          robots: `${prodRobots} / ${previewRobots}`,
          types: "—",
          links: "—",
        });
        continue;
      }

      if (prod.text.includes("{{") || prod.text.includes("TBD")) fail(pagePath, "rendered HTML contains {{ or TBD");
      if (/vercel\.app/i.test(prod.text)) fail(pagePath, "rendered HTML contains a vercel.app URL");

      const previewMeta = metaContent(preview.text, "robots");
      if (!previewMeta || !previewMeta.toLowerCase().includes("noindex")) {
        fail(pagePath, `*.vercel.app missing robots meta noindex (got ${previewMeta || "none"})`);
      }
      const prodMeta = metaContent(prod.text, "robots");
      if (prodMeta && prodMeta.toLowerCase().includes("noindex")) {
        fail(pagePath, `aglpallet.com robots meta is ${prodMeta}`);
      }

      const canonical = canonicalHref(prod.text);
      const expectedCanonical = `${ORIGIN}${pagePath === "/" ? "/" : pagePath}`;
      if (canonical !== expectedCanonical) fail(pagePath, `canonical ${canonical || "missing"} != ${expectedCanonical}`);

      const blocks = jsonLdBlocks(prod.text);
      const nodes = [];
      for (const block of blocks) {
        let data;
        try {
          data = JSON.parse(block);
        } catch (err) {
          fail(pagePath, `JSON-LD did not parse: ${err.message}`);
          continue;
        }
        if (JSON.stringify(data).includes("vercel.app")) fail(pagePath, "JSON-LD contains a vercel.app URL");
        if (JSON.stringify(data).includes("{{") || JSON.stringify(data).includes("TBD")) {
          fail(pagePath, "JSON-LD contains {{ or TBD");
        }
        for (const root of rootsOf(data)) {
          if (!root || root["@context"] !== "https://schema.org") fail(pagePath, "JSON-LD @context is not https://schema.org");
          nodes.push(root);
        }
      }

      walk(nodes, (node) => {
        for (const type of typesOf(node)) {
          types.push(type);
          if (BANNED_TYPES.has(type)) fail(pagePath, `banned type ${type}`);
          const allowed = ALLOWED[type];
          if (!allowed) {
            fail(pagePath, `unexpected type ${type}`);
            continue;
          }
          for (const key of Object.keys(node)) {
            if (!allowed.includes(key)) fail(pagePath, `${type} has unexpected property ${key}`);
          }
        }
      });

      const byType = (type) => nodes.filter((node) => typesOf(node).includes(type));
      const text = visibleText(prod.text);
      const h1 = firstH1(prod.text);
      const description = metaContent(prod.text, "description");
      const updated = (prod.text.match(/<time\b[^>]*\bdatetime="([^"]+)"/i) || [])[1] || null;

      if (byType("Organization").length !== 1) fail(pagePath, `expected 1 Organization, found ${byType("Organization").length}`);
      for (const org of byType("Organization")) {
        if (org.name !== site.organization.legalName) fail(pagePath, "Organization name drifted from site.json");
        if (org.url !== ORIGIN) fail(pagePath, `Organization url ${org.url}`);
        if (org.telephone !== site.footer.contact.phone) fail(pagePath, "Organization telephone drifted");
        if (org.email !== site.footer.contact.email) fail(pagePath, "Organization email drifted");
        if (org.areaServed !== "US") fail(pagePath, "Organization areaServed must be US");
        if (org.address || org.streetAddress) fail(pagePath, "Organization must not include an address");
        if (!text.includes(org.name) || !text.includes(org.telephone) || !text.includes(org.email)) {
          fail(pagePath, "Organization name, phone, or email is not on the page");
        }
        const logoPath = site.logo.src;
        if (org.logo !== `${ORIGIN}${logoPath}`) fail(pagePath, "Organization logo is not SITE_URL + logo src");
        if (!prod.text.includes(logoPath) && !prod.text.includes(encodeURIComponent(logoPath))) {
          fail(pagePath, "Organization logo is not in the rendered HTML");
        }
        const same = org.sameAs || [];
        const expectedSame = site.organization.sameAs;
        if (JSON.stringify(same) !== JSON.stringify(expectedSame)) fail(pagePath, "Organization sameAs drifted from site.json");
      }

      if (guidePaths.has(pagePath)) {
        const articles = byType("TechArticle");
        if (articles.length !== 1) fail(pagePath, `guide missing TechArticle (${articles.length})`);
        if (byType("BreadcrumbList").length !== 1) fail(pagePath, "guide missing BreadcrumbList");
      }

      for (const article of [...byType("TechArticle"), ...byType("Article")]) {
        if (!article.headline || !article.datePublished || !article.dateModified) {
          fail(pagePath, `${article["@type"]} missing headline, datePublished, or dateModified`);
        }
        if (article.headline !== h1) fail(pagePath, `${article["@type"]} headline does not match the H1`);
        if (!description || article.description !== description) {
          fail(pagePath, `${article["@type"]} description does not match the meta description`);
        }
        if (article.url !== expectedCanonical || article.mainEntityOfPage !== expectedCanonical) {
          fail(pagePath, `${article["@type"]} url does not match the canonical`);
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(article.datePublished) || !/^\d{4}-\d{2}-\d{2}$/.test(article.dateModified)) {
          fail(pagePath, `${article["@type"]} dates are not YYYY-MM-DD`);
        }
        if (article.dateModified !== updated) fail(pagePath, `${article["@type"]} dateModified does not match the visible Updated time`);
        if (article.inLanguage !== "en-US") fail(pagePath, `${article["@type"]} inLanguage drifted`);
        const publisher = article.publisher;
        if (!publisher || publisher["@type"] !== "Organization" || publisher.name !== site.organization.legalName) {
          fail(pagePath, `${article["@type"]} publisher drifted`);
        }
        for (const person of [article.author, article.reviewedBy].filter(Boolean)) {
          if (!person.name || /TBD|\{\{/.test(JSON.stringify(person))) fail(pagePath, "article person field is a placeholder");
        }
      }

      const trail = breadcrumbNav(prod.text);
      for (const crumb of byType("BreadcrumbList")) {
        if (!trail) fail(pagePath, "BreadcrumbList is not visible on the page");
        const items = (crumb.itemListElement || []).slice().sort((a, b) => a.position - b.position);
        items.forEach((item, index) => {
          if (item["@type"] !== "ListItem") fail(pagePath, "breadcrumb item type drifted");
          if (item.position !== index + 1) fail(pagePath, "breadcrumb positions are not 1..n");
          if (!item.name || typeof item.item !== "string" || !item.item.startsWith(ORIGIN)) {
            fail(pagePath, "breadcrumb item needs a name and an aglpallet.com URL");
          }
        });
        if (trail && items.map((item) => item.name).join(" | ") !== trail.names.join(" | ")) {
          fail(pagePath, `breadcrumb names [${items.map((item) => item.name).join(" / ")}] != visible [${trail.names.join(" / ")}]`);
        }
        if (trail) {
          items.forEach((item) => {
            const link = trail.hrefs.find((entry) => entry.name === item.name);
            if (!link) return;
            const hrefPath = classifyRef(link.href || "");
            if (!hrefPath || hrefPath.kind === "absolute") fail(pagePath, `breadcrumb link for ${item.name} is not root-relative`);
            if (hrefPath && pathnameOf(item.item) !== hrefPath.path.split("?")[0]) {
              fail(pagePath, `breadcrumb URL for ${item.name} does not match the visible href`);
            }
          });
        }
        const last = items[items.length - 1];
        if (last && pathnameOf(last.item) !== pagePath) fail(pagePath, "last breadcrumb URL is not this page");
      }

      for (const faq of byType("FAQPage")) {
        const questionsHtml = prod.text.match(/<section\b[^>]*\bid="questions"[\s\S]*?<\/section>/i);
        if (!questionsHtml) fail(pagePath, "FAQPage without a visible questions section");
        const qText = questionsHtml ? visibleText(questionsHtml[0]) : "";
        const entities = faq.mainEntity || [];
        if (entities.length === 0) fail(pagePath, "FAQPage has no questions");
        for (const question of entities) {
          if (question["@type"] !== "Question" || !question.name) fail(pagePath, "FAQ question shape drifted");
          const answer = question.acceptedAnswer;
          if (!answer || answer["@type"] !== "Answer" || !answer.text) fail(pagePath, "FAQ answer shape drifted");
          if (!qText.includes(norm(question.name)) || !qText.includes(norm(answer.text))) {
            fail(pagePath, `FAQ JSON-LD does not match the visible Q&A: ${question.name}`);
          }
        }
      }
      if (prod.text.includes('id="questions"') && byType("FAQPage").length === 0 && guidePaths.has(pagePath)) {
        fail(pagePath, "visible questions section has no FAQPage");
      }

      if (pagePath === glossaryPath) {
        const sets = byType("DefinedTermSet");
        if (sets.length !== 1) fail(pagePath, "glossary missing DefinedTermSet");
        for (const set of sets) {
          const setUrl = `${ORIGIN}${glossaryPath}`;
          if (set.name !== h1 || set.url !== setUrl || set["@id"] !== setUrl) fail(pagePath, "DefinedTermSet name or URL drifted");
          const terms = set.hasDefinedTerm || [];
          if (terms.length !== glossary.terms.length) fail(pagePath, `DefinedTerm count ${terms.length} != glossary.json ${glossary.terms.length}`);
          for (const term of terms) {
            const id = typeof term["@id"] === "string" ? term["@id"].split("#")[1] : "";
            if (!id || term["@id"] !== `${setUrl}#${id}` || term.url !== term["@id"]) {
              fail(pagePath, `DefinedTerm ${term.name || id} is not anchored at #${id}`);
            }
            if (term.inDefinedTermSet !== setUrl) fail(pagePath, `DefinedTerm ${id} left the set`);
            if (!prod.text.includes(`id="${id}"`)) fail(pagePath, `glossary page has no #${id}`);
            const block = prod.text.match(new RegExp(`<div\\b[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)</div>`, "i"));
            const dt = block ? (block[1].match(/<dt\b[^>]*>([\s\S]*?)<\/dt>/i) || [])[1] : "";
            const dd = block ? (block[1].match(/<dd\b[^>]*>([\s\S]*?)<\/dd>/i) || [])[1] : "";
            if (norm(dt || "") !== term.name) fail(pagePath, `DefinedTerm name does not match #${id}`);
            if (!norm(dd || "").includes(norm(term.description || ""))) {
              fail(pagePath, `DefinedTerm description does not match #${id}`);
            }
          }
        }
      }

      if (webAppPaths.has(pagePath)) {
        const apps = byType("WebApplication");
        if (apps.length !== 1) fail(pagePath, `calculator missing WebApplication (${apps.length})`);
        for (const app of apps) {
          if (app.url !== expectedCanonical) fail(pagePath, "WebApplication url does not match the canonical");
          if (!text.includes(app.name)) fail(pagePath, "WebApplication name is not visible");
          const descriptionMatches = app.description === description || text.includes(app.description);
          if (!descriptionMatches) fail(pagePath, "WebApplication description is not the meta description or visible text");
          if (app.applicationCategory !== "BusinessApplication" || app.operatingSystem !== "Any" || app.isAccessibleForFree !== true) {
            fail(pagePath, "WebApplication category drifted");
          }
          const offer = app.offers;
          if (!offer || offer.price !== "0" || offer.priceCurrency !== "USD") fail(pagePath, "WebApplication offer drifted");
          if (!app.publisher || app.publisher.name !== site.organization.legalName) fail(pagePath, "WebApplication publisher drifted");
        }
      }

      if (pagePath === pricesPath) {
        const datasets = byType("Dataset");
        if (datasets.length !== 1) fail(pagePath, "prices guide missing Dataset");
        const csvRes = await request(PPI_CSV_PATH, SITE_HOST, 5);
        cache.set(PPI_CSV_PATH, csvRes);
        const csvType = String(csvRes.headers["content-type"] || "");
        const csvDisp = String(csvRes.headers["content-disposition"] || "");
        if (csvRes.status !== 200 || !csvType.includes("text/csv")) {
          fail(pagePath, `PPI CSV ${csvRes.status} ${csvType || "no content-type"}`);
        }
        if (!csvDisp.includes("ppi.csv")) fail(pagePath, "PPI CSV is missing filename ppi.csv");
        const csvRows = csvRes.text.replace(/\r\n/g, "\n").trim().split("\n").map((line) => line.split(","));
        const series = ppi.series;
        const months = [...new Set(series.flatMap((item) => item.observations.map(([month]) => month)))].sort();
        const coverage = `${months[0]}/${months[months.length - 1]}`;
        for (const dataset of datasets) {
          if (!text.includes(dataset.name) || !text.includes(dataset.description)) {
            fail(pagePath, "Dataset name or description is not visible");
          }
          if (dataset.url !== expectedCanonical) fail(pagePath, "Dataset url does not match the canonical");
          if (dataset.temporalCoverage !== coverage) fail(pagePath, `Dataset temporalCoverage ${dataset.temporalCoverage} != ${coverage}`);
          if (!text.includes(monthLabel(months[0])) || !text.includes(monthLabel(months[months.length - 1]))) {
            fail(pagePath, "Dataset date range is not visible on the chart");
          }
          if (!dataset.creator || dataset.creator.name !== series[0].publisher || !text.includes(dataset.creator.name)) {
            fail(pagePath, "Dataset creator does not match the visible publisher");
          }
          const measured = dataset.variableMeasured || [];
          if (measured.length !== series.length) fail(pagePath, "variableMeasured count drifted");
          series.forEach((item, index) => {
            const variable = measured[index];
            if (!variable || variable.name !== item.shortName || variable.propertyID !== item.id || variable.unitText !== item.base) {
              fail(pagePath, `variableMeasured[${index}] does not match ppi.json`);
            } else if (!text.includes(variable.name) || !text.includes(variable.propertyID) || !text.includes(variable.unitText)) {
              fail(pagePath, `variableMeasured ${variable.propertyID} is not visible`);
            }
          });
          const download = dataset.distribution;
          if (!download || download["@type"] !== "DataDownload" || download.encodingFormat !== "text/csv") {
            fail(pagePath, "Dataset distribution is not a text/csv DataDownload");
          } else if (download.contentUrl !== `${ORIGIN}${PPI_CSV_PATH}`) {
            fail(pagePath, `Dataset contentUrl ${download.contentUrl}`);
          } else if (!prod.text.includes(`href="${PPI_CSV_PATH}"`)) {
            fail(pagePath, "CSV distribution is not linked from the page");
          }
          const header = csvRows[0] || [];
          const expectedHeader = ["month", ...series.map((item) => item.id)];
          if (header.join(",") !== expectedHeader.join(",")) fail(pagePath, "PPI CSV header does not match ppi.json");
          if (csvRows.length !== months.length + 1) fail(pagePath, "PPI CSV row count does not match ppi.json");
          const byMonth = new Map(csvRows.slice(1).map((row) => [row[0], row]));
          series.forEach((item, index) => {
            for (const [month, value] of item.observations) {
              const row = byMonth.get(month);
              if (!row || row[index + 1] !== String(value)) {
                fail(pagePath, `PPI CSV ${item.id} ${month} does not match ppi.json`);
              }
            }
          });
        }
      }

      for (const ref of internalRefs(prod.text)) {
        const classified = classifyRef(ref);
        if (!classified) continue;
        if (classified.kind === "bad" || classified.kind === "absolute") {
          linkIssues.push(`absolute ${classified.original}`);
          continue;
        }
        if (classified.kind === "hash") {
          if (classified.hash && !prod.text.includes(`id="${classified.hash}"`)) linkIssues.push(`broken #${classified.hash}`);
          continue;
        }
        const targetPath = classified.path.split("?")[0];
        let target = cache.get(targetPath);
        if (!target) {
          target = await request(classified.path, SITE_HOST, 5);
          cache.set(targetPath, target);
        }
        if (target.status !== 200) {
          linkIssues.push(`broken ${classified.original} (${target.status})`);
          continue;
        }
        if (classified.hash && isHtmlResponse(target) && !target.text.includes(`id="${classified.hash}"`)) {
          linkIssues.push(`broken ${classified.original} (missing #${classified.hash})`);
        }
      }

      const uniqueLinks = [...new Set(linkIssues)];
      if (uniqueLinks.length > 0) {
        for (const issue of uniqueLinks) fail(pagePath, issue);
      }

      rows.push({
        url: loc,
        status: prod.status,
        title: titleText(prod.text) || "—",
        h1: h1 || "—",
        words: shortAnswerWords(prod.text) === null ? "—" : String(shortAnswerWords(prod.text)),
        canonical: canonical || "—",
        robots: `${prodRobots} / ${previewRobots}`,
        types: [...new Set(types)].join(", ") || "—",
        links: uniqueLinks.length ? uniqueLinks.join("; ") : "none",
      });
    }

    for (const guidePath of guidePaths) {
      if (!locs.some((loc) => pathnameOf(loc) === guidePath)) fail(guidePath, "guide missing from sitemap");
    }

    const header = [
      "| URL | Status | Title | H1 | Short-answer words | Canonical | X-Robots-Tag (aglpallet.com / *.vercel.app) | JSON-LD types | Internal link issues |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ];
    const table = rows.map(
      (row) =>
        `| ${cell(row.url)} | ${cell(row.status)} | ${cell(row.title)} | ${cell(row.h1)} | ${cell(row.words)} | ${cell(row.canonical)} | ${cell(row.robots)} | ${cell(row.types)} | ${cell(row.links)} |`
    );
    const report = [
      `Checked ${locs.length} sitemap URL(s). Schema errors: ${errors.length}.`,
      "",
      ...header,
      ...table,
      "",
    ].join("\n");
    console.log(report);
    if (errors.length > 0) {
      console.error(`schema: ${errors.length} validation error(s)`);
      for (const error of errors) console.error(`  FAIL ${error.url}: ${error.message}`);
      stop();
      process.exit(1);
    }
    console.log("schema: JSON-LD matches the rendered pages");
    stop();
    process.exit(0);
  } catch (err) {
    console.error(err);
    console.error(serverLog.slice(-4000));
    stop();
    process.exit(1);
  }
}

main();
