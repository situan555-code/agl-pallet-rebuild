import type { Metadata } from "next";
import glossary from "@/content/resources/glossary.json";
import hub from "@/content/resources/hub.json";
import { BreadcrumbJsonLd, DefinedTermSetJsonLd, TechArticleJsonLd } from "@/components/JsonLd";
import { Changelog } from "@/components/resources/Changelog";
import { ArticleHeader, DirectAnswer, NextSteps, ReadingPanel, RelatedGuides, ResourceCta } from "@/components/resources/ResourceArticle";
import { GlossaryTerms } from "@/components/resources/GlossaryTerms";
import { getHubPillar } from "@/lib/resources";
import { pageMeta } from "@/lib/seo";

const PATH = "/resources/glossary/";
const pillar = getHubPillar(glossary.slug)!;

export const metadata: Metadata = pageMeta(glossary.metaTitle, glossary.metaDescription, PATH);

const terms = [...glossary.terms].sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));

export default function GlossaryPage() {
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: hub.hero.heading, path: "/resources/" },
          { name: pillar.title, path: PATH },
        ]}
      />
      <TechArticleJsonLd
        headline={pillar.title}
        description={glossary.metaDescription}
        path={PATH}
        published={glossary.published}
        updated={glossary.updated}
      />
      <DefinedTermSetJsonLd name={pillar.title} path={PATH} terms={terms} />
      <ArticleHeader eyebrow={glossary.eyebrow} title={pillar.title} updated={glossary.updated} />
      <ReadingPanel>
        <DirectAnswer text={pillar.directAnswer} />
        <div className="mt-10 border-t border-brand-green/15 pt-10">
          <p className="prose-measure text-body text-moss/85">
            {glossary.intro} {terms.length} terms.
          </p>

          <GlossaryTerms
            terms={terms.map((t) => ({
              id: t.id,
              term: t.term,
              definition: t.definition,
              link: "link" in t ? t.link : undefined,
            }))}
          />

          <div className="mt-6 nav:grid nav:grid-cols-12 nav:gap-16">
            <div className="nav:col-span-8 nav:col-start-5">
              <NextSteps />
              <div className="mt-14">
                <Changelog slug={glossary.slug} />
              </div>
            </div>
          </div>
        </div>
      </ReadingPanel>

      <RelatedGuides slugs={["gma-pallets-and-grades", "heat-treated-pallets-ispm-15", "types-of-pallets"]} />
      <ResourceCta heading={hub.cta.heading} body={hub.cta.body} source={glossary.slug} />
    </main>
  );
}
