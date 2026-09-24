import type { MetadataRoute } from "next";
import hub from "@/content/resources/hub.json";
import calculators from "@/content/resources/calculators.json";
import { DOWNLOADS_PATH, STAMP_DECODER_PATH, downloadPath, downloadPdfPath, downloads } from "@/lib/download-source";
import { QUESTIONS_PATH, questionPath, questions } from "@/lib/questions";
import { getSiteUrl } from "@/lib/site-url";

// Every App Router page, with trailing slashes (next.config trailingSlash).
// Replaces the WordPress-era public/sitemap.xml, which still listed the
// 301'd /about/, /logistics-process/, and /industries-served/.
const PAGES = [
  "/",
  "/who-we-are/",
  "/partners/",
  "/partners/suppliers/",
  "/partners/carriers/",
  "/the-pledge/",
  "/custom-engineered/",
  "/products/",
  "/industries/",
  "/how-we-work/",
  "/contact/",
  "/request-a-quote/",
  "/faq/",
  "/case-studies/",
  "/services/",
  "/resources/",
];

// Bump when page content changes materially.
const LAST_MODIFIED = new Date("2026-09-24");

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = calculators.tools.map((t) => t.href).filter((href) => !href.includes("#"));
  const paths = [
    ...PAGES,
    ...hub.pillars.map((p) => p.href),
    ...tools,
    QUESTIONS_PATH,
    ...questions.map((item) => questionPath(item.slug)),
    DOWNLOADS_PATH,
    ...downloads.map((item) => downloadPath(item.slug)),
    ...downloads.map((item) => downloadPdfPath(item.slug)),
    STAMP_DECODER_PATH,
  ];
  return paths.map((path) => ({
    url: `${getSiteUrl()}${path}`,
    lastModified: LAST_MODIFIED,
  }));
}
