import type { ReactNode } from "react";
import Link from "next/link";
import hub from "@/content/resources/hub.json";
import calculators from "@/content/resources/calculators.json";
import { BreadcrumbJsonLd, WebApplicationJsonLd } from "@/components/JsonLd";
import {
  ArticleBody,
  ArticleHeader,
  ArticleSection,
  DirectAnswer,
  NextSteps,
  ReadingPanel,
  RelatedGuides,
  ResourceCta,
  Sources,
} from "@/components/resources/ResourceArticle";
import { NoteList } from "@/components/resources/Calculator";
import { Changelog, hasChangelog } from "@/components/resources/Changelog";
import { getHubPillar, type ResourceSource } from "@/lib/resources";

const HUB = getHubPillar(calculators.hubSlug)!;
const UPDATED = "2026-09-24";

export function calculatorPath(slug: string) {
  return `${HUB.href}${slug}/`;
}

export interface CalculatorContent {
  slug: string;
  title: string;
  eyebrow: string;
  metaDescription: string;
  directAnswer: string;
  method: string[];
  limits: string[];
  sources: ResourceSource[];
  related: string[];
}

/** Layout for a calculator child page under /resources/pallet-calculators/. */
export function CalculatorPage({ content, children }: { content: CalculatorContent; children: ReactNode }) {
  const path = calculatorPath(content.slug);
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: hub.hero.heading, path: "/resources/" },
          { name: HUB.title, path: HUB.href },
          { name: content.title, path },
        ]}
      />
      <WebApplicationJsonLd name={content.title} description={content.metaDescription} path={path} />
      <ArticleHeader eyebrow={content.eyebrow} title={content.title} updated={UPDATED} crumbs={[{ name: HUB.title, href: HUB.href }]} />
      <ReadingPanel>
        <DirectAnswer text={content.directAnswer} />
        <ArticleBody
          toc={[
            { id: "calculator", label: "Calculator" },
            { id: "method", label: "Method" },
            { id: "sources", label: "Sources" },
            ...(hasChangelog(content.slug) ? [{ id: "changelog", label: "Changelog" }] : []),
          ]}
        >
          <ArticleSection section={{ id: "calculator", heading: "Calculator" }}>{children}</ArticleSection>
          <ArticleSection section={{ id: "method", heading: "Method and limits", list: content.method, ordered: true }}>
            <NoteList heading="What this calculator does not do" items={content.limits} />
          </ArticleSection>
          <Sources items={content.sources} />
          <section aria-labelledby="more-tools-h" className="border-t border-brand-green/15 pt-10">
            <h2 id="more-tools-h" className="text-display-row text-brand-green">
              More calculators
            </h2>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-body">
              {calculators.tools
                .filter((t) => t.slug !== content.slug)
                .map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={t.href}
                      prefetch={false}
                      className="font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:decoration-brand-green"
                    >
                      {t.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
          <NextSteps />
          <Changelog slug={content.slug} />
        </ArticleBody>
      </ReadingPanel>
      <RelatedGuides slugs={content.related} />
      <ResourceCta heading={hub.cta.heading} body={hub.cta.body} source={content.slug} />
    </main>
  );
}

/** Ruled list of every calculator, for the calculators hub. */
export function ToolList() {
  return (
    <ArticleSection section={{ id: "tools", heading: "The calculators" }}>
      <ul className="mt-6 divide-y divide-brand-green/15 border-y border-brand-green/15">
        {calculators.tools.map((t) => (
          <li key={t.slug} className="py-5">
            <Link
              href={t.href}
              prefetch={false}
              className="text-[20px] font-semibold leading-snug text-brand-green underline decoration-brand-green/30 underline-offset-4 hover:decoration-brand-green"
            >
              {t.title}
            </Link>
            <p className="prose-measure mt-2 text-body text-ink/85">{t.summary}</p>
          </li>
        ))}
      </ul>
    </ArticleSection>
  );
}
