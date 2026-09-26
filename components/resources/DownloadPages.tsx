import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import sizes from "@/content/resources/pillars/pallet-sizes.json";
import ispm from "@/content/resources/pillars/heat-treated-pallets-ispm-15.json";
import hub from "@/content/resources/hub.json";
import { Feature3 } from "@/components/feature3";
import { containerClass } from "@/components/Container";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ArticleBody, ArticleHeader, ArticleSection, ReadingPanel, ResourceCta, Sources } from "@/components/resources/ResourceArticle";
import { RichText } from "@/components/resources/RichText";
import {
  DOWNLOADS_PATH,
  STAMP_DECODER_PATH,
  downloadPath,
  downloadPdfPath,
  downloads,
  downloadsIndex,
  requireDownload,
  sheetSections,
  sheetSources,
} from "@/lib/download-source";
import { stampDecoderCopy } from "@/lib/stamp-decoder";

const textLinkClass =
  "font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:decoration-brand-green focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

export function DownloadIndexList({
  eyebrow = downloadsIndex.hubEyebrow,
  heading = downloadsIndex.hubHeading,
}: {
  eyebrow?: string;
  heading?: string;
}) {
  return (
    <Feature3
      variant="ruled"
      columns={2}
      eyebrow={eyebrow}
      heading={heading}
      features={downloads.map((item) => ({
        eyebrow: item.eyebrow,
        title: item.title,
        href: downloadPath(item.slug),
        description: item.summary,
      }))}
    />
  );
}

export function StampDecoderHubLink() {
  return (
    <Feature3
      variant="ruled"
      columns={2}
      hairline
      eyebrow={downloadsIndex.decoderEyebrow}
      heading={downloadsIndex.decoderHeading}
      features={[
        {
          eyebrow: stampDecoderCopy.eyebrow,
          title: stampDecoderCopy.heading,
          href: STAMP_DECODER_PATH,
          description: stampDecoderCopy.summary,
        },
      ]}
    />
  );
}

export function DownloadsIndexPage() {
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources/" },
          { name: downloadsIndex.heading, path: DOWNLOADS_PATH },
        ]}
      />
      <ArticleHeader
        eyebrow={downloadsIndex.eyebrow}
        title={downloadsIndex.heading}
        updated={downloadsIndex.updated}
        libraryLabel="Resources"
      />
      <section className="pt-14 nav:pt-20">
        <p className={cn(containerClass, "prose-measure text-body text-ink/85")}>
          <RichText text={downloadsIndex.intro} />
        </p>
      </section>
      <DownloadIndexList />
      <StampDecoderHubLink />
      <ResourceCta heading={hub.cta.heading} body={hub.cta.body} source="downloads" />
    </main>
  );
}

export function DownloadArticle({ slug }: { slug: string }) {
  const item = requireDownload(slug);
  const sections = sheetSections(slug);
  const sources = sheetSources(slug);
  const cta = slug === "pallet-size-chart" ? sizes.cta : ispm.cta;
  const path = downloadPath(slug);
  const toc = [
    ...sections.map((section) => ({ id: section.id, label: section.heading })),
    { id: "sources", label: "Sources" },
  ];
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources/" },
          { name: downloadsIndex.heading, path: DOWNLOADS_PATH },
          { name: item.title, path },
        ]}
      />
      <ArticleHeader
        eyebrow={item.eyebrow}
        title={item.title}
        updated={item.updated}
        libraryLabel="Resources"
        crumbs={[{ name: downloadsIndex.heading, href: DOWNLOADS_PATH }]}
      />
      <ReadingPanel>
        <div className="prose-measure space-y-4 text-body text-moss/85">
          <p>{item.figuresNote}</p>
          {item.exampleNote && <p>{item.exampleNote}</p>}
          <p>
            <Button href={downloadPdfPath(slug)} label={downloadsIndex.pdfLabel} variant="secondary" />
          </p>
          <p>
            <Link href={item.guideHref} prefetch={false} className={textLinkClass}>
              {downloadsIndex.guideLabel}: {item.guideLabel}
            </Link>
          </p>
        </div>
        <ArticleBody toc={toc}>
          {sections.map((section) => (
            <ArticleSection key={section.id} section={section} />
          ))}
          <Sources items={sources} closing={downloadsIndex.sourcesClosing} />
          {item.related.length > 0 && (
            <section aria-labelledby="download-related-h" className="border-t border-brand-green/15 pt-10">
              <h2 id="download-related-h" className="text-display-row text-current">
                Related
              </h2>
              <ul className="mt-6 space-y-3 text-body">
                {item.related.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} prefetch={false} className={textLinkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </ArticleBody>
      </ReadingPanel>
      <ResourceCta heading={cta.heading} body={cta.body} source={`dl-${slug}`} />
    </main>
  );
}
