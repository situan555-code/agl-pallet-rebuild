import Link from "next/link";
import type { Metadata } from "next";
import glossary from "@/content/resources/glossary.json";
import hub from "@/content/resources/hub.json";
import { BreadcrumbJsonLd, DefinedTermSetJsonLd, TechArticleJsonLd } from "@/components/JsonLd";
import { Changelog } from "@/components/resources/Changelog";
import { ArticleHeader, DirectAnswer, NextSteps, RelatedGuides, ResourceCta } from "@/components/resources/ResourceArticle";
import { getHubPillar } from "@/lib/resources";
import { pageMeta } from "@/lib/seo";

const PATH = "/resources/glossary/";
const pillar = getHubPillar(glossary.slug)!;

export const metadata: Metadata = pageMeta(glossary.metaTitle, glossary.metaDescription, PATH);

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const terms = [...glossary.terms].sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
const byLetter = ALPHABET.map((letter) => ({
  letter,
  terms: terms.filter((t) => t.term[0].toUpperCase() === letter),
}));

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
      <DirectAnswer text={pillar.directAnswer} />

      <div className="px-6 pb-20 pt-14 nav:pb-28 nav:pt-16">
        <div className="mx-auto max-w-[1440px]">
          <p className="prose-measure text-body text-ink/85">
            {glossary.intro} {terms.length} terms.
          </p>

          <nav aria-label="Glossary A to Z" className="sticky top-[75px] z-10 -mx-6 mt-10 border-y border-brand-green/15 bg-paper px-6 py-3">
            <ul className="flex flex-wrap gap-x-1 gap-y-1">
              {byLetter.map(({ letter, terms: list }) => (
                <li key={letter}>
                  {list.length > 0 ? (
                    <a
                      href={`#letter-${letter}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-sm font-display text-[18px] text-brand-green hover:bg-brand-green hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green"
                    >
                      {letter}
                    </a>
                  ) : (
                    <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center font-display text-[18px] text-ink/40">
                      {letter}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6">
            {byLetter
              .filter((g) => g.terms.length > 0)
              .map(({ letter, terms: list }) => (
                <section key={letter} id={`letter-${letter}`} aria-labelledby={`letter-${letter}-h`} className="scroll-mt-40 border-t border-brand-green/15 py-10 nav:grid nav:grid-cols-12 nav:gap-16">
                  <h2 id={`letter-${letter}-h`} className="font-display text-display-numeral text-brand-green nav:col-span-3">
                    {letter}
                  </h2>
                  <dl className="mt-6 space-y-8 nav:col-span-8 nav:col-start-5 nav:mt-0">
                    {list.map((t) => (
                      <div key={t.id} id={t.id} className="scroll-mt-40">
                        <dt className="text-[20px] font-semibold leading-snug text-brand-green">{t.term}</dt>
                        <dd className="prose-measure mt-2 text-body text-ink/85">
                          {t.definition}
                          {"link" in t && t.link && (
                            <>
                              {" "}
                              <Link
                                href={t.link}
                                prefetch={false}
                                className="font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:decoration-brand-green"
                              >
                                Read the guide<span className="sr-only">: {getHubPillar(t.link.split("/")[2])?.title}</span>
                              </Link>
                            </>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
          </div>

          <div className="mt-6 nav:grid nav:grid-cols-12 nav:gap-16">
            <div className="nav:col-span-8 nav:col-start-5">
              <NextSteps />
              <div className="mt-14">
                <Changelog slug={glossary.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedGuides slugs={["gma-pallets-and-grades", "heat-treated-pallets-ispm-15", "types-of-pallets"]} />
      <ResourceCta heading={hub.cta.heading} body={hub.cta.body} source={glossary.slug} />
    </main>
  );
}
