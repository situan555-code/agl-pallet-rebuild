// Shared layout for Resource Library guides. Server-rendered throughout so
// every answer, table, and Q&A passage is in the HTML. Order is fixed by the
// blueprint: H1, 40–60 word direct answer, H2 sections, visible Q&A,
// sources, next steps, related guides, quote CTA.
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import hub from "@/content/resources/hub.json";
import { cn } from "@/lib/utils";
import { Cta4 } from "@/components/cta4";
import { Feature3 } from "@/components/feature3";
import { BreadcrumbJsonLd, FaqPageJsonLd, TechArticleJsonLd } from "@/components/JsonLd";
import { Byline } from "@/components/resources/Byline";
import { Changelog, hasChangelog } from "@/components/resources/Changelog";
import { RichText, plainText } from "@/components/resources/RichText";
import weighedData from "@/content/resources/data/agl-weighed.json";
import bandsData from "@/content/resources/data/agl-indicative-bands.json";
import {
  firstSentence,
  getHubPillar,
  quoteHref,
  type ResourcePillar,
  type ResourceQuestion,
  type ResourceSection,
  type ResourceSource,
  type ResourceTable,
} from "@/lib/resources";

const DATA_TABLES: Record<string, ResourceTable> = {
  "agl-weighed": weighedData,
  "agl-indicative-bands": bandsData,
};

/** A backing file with no measured or quoted cells stays hidden. */
function publishedTable(table: ResourceTable | undefined): ResourceTable | undefined {
  if (!table) return undefined;
  const hasValue = table.rows.some((row) =>
    row.some((cell) => {
      const value = cell.trim();
      return value !== "" && value !== "—" && value !== "-" && value.toLowerCase() !== "pending";
    })
  );
  return hasValue ? table : undefined;
}

function resolveTable(section: Partial<ResourceSection>): ResourceTable | undefined {
  if (section.dataRef) return publishedTable(DATA_TABLES[section.dataRef]);
  return section.table;
}

const MONEY_LINKS = [
  { label: "Stock pallets and products", href: "/products/" },
  { label: "Custom and engineered pallets", href: "/custom-engineered/" },
  { label: "Request a quote", href: "/request-a-quote/" },
];

export function ArticleHeader({
  eyebrow,
  title,
  updated,
  crumbs = [],
  libraryLabel = hub.hero.heading,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  /** Intermediate breadcrumb links between the library and this page. */
  crumbs?: { name: string; href: string }[];
  /** Visible label for the /resources/ crumb. Guides keep the library title. */
  libraryLabel?: string;
}) {
  return (
    <section className="bg-brand-green px-6 pb-14 pt-36 text-white nav:pb-16">
      <div className="mx-auto max-w-[1440px]">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-link text-white/75">
            <li>
              <Link href="/" prefetch={false} className="hover:text-white hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/resources/" prefetch={false} className="hover:text-white hover:underline">
                {libraryLabel}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {crumbs.map((c) => (
              <Fragment key={c.href}>
                <li>
                  <Link href={c.href} prefetch={false} className="hover:text-white hover:underline">
                    {c.name}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
              </Fragment>
            ))}
            <li>
              <span aria-current="page" className="text-white">
                {title}
              </span>
            </li>
          </ol>
        </nav>
        <p className="mt-10 text-eyebrow font-semibold uppercase tracking-wide">
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-[900px] text-display-1">{title}</h1>
        <Byline updated={updated} />
      </div>
    </section>
  );
}

export function DirectAnswer({ text }: { text: string }) {
  return (
    <section aria-labelledby="short-answer" className="px-6 pt-14 nav:pt-20">
      <div className="mx-auto grid max-w-[1440px] gap-4 nav:grid-cols-12 nav:gap-16">
        <p id="short-answer" className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink nav:col-span-3">
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          Short answer
        </p>
        <p className="max-w-[62ch] border-l-[3px] border-brand-green pl-6 text-[20px] leading-[1.6] text-ink nav:col-span-8 nav:col-start-5">
          <RichText text={text} />
        </p>
      </div>
    </section>
  );
}

export function DataTable({ table }: { table: ResourceTable }) {
  return (
    <figure className="mt-6">
      <div role="region" aria-label={table.caption} tabIndex={0} className="overflow-x-auto focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-brand-green">
        <table className="w-full min-w-[520px] border-collapse text-left text-[15px] leading-snug">
          <caption className="mb-3 caption-top text-left text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">
            {table.caption}
          </caption>
          <thead>
            <tr>
              {table.columns.map((c) => (
                <th key={c} scope="col" className="border-b-2 border-brand-green py-3 pr-6 align-bottom font-semibold text-brand-green">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) =>
                  c === 0 ? (
                    <th key={c} scope="row" className="border-b border-brand-green/15 py-3 pr-6 align-top font-semibold text-ink">
                      <RichText text={cell} />
                    </th>
                  ) : (
                    <td key={c} className="border-b border-brand-green/15 py-3 pr-6 align-top text-ink/85">
                      <RichText text={cell} />
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && (
        <figcaption className="mt-3 text-[14px] leading-relaxed text-ink/70">
          <RichText text={table.note} />
        </figcaption>
      )}
    </figure>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className="text-body text-ink/85">
          <RichText text={p} />
        </p>
      ))}
    </>
  );
}

export function ArticleSection({ section, children }: { section: Pick<ResourceSection, "id" | "heading"> & Partial<ResourceSection>; children?: ReactNode }) {
  const ListTag = section.ordered ? "ol" : "ul";
  const table = resolveTable(section);
  return (
    <section id={section.id} aria-labelledby={`${section.id}-h`} className="scroll-mt-28 border-t border-brand-green/15 pt-10">
      <h2 id={`${section.id}-h`} className="text-display-row text-brand-green">
        {section.heading}
      </h2>
      <div className="prose-measure mt-6 space-y-4">
        {section.paragraphs && <Paragraphs items={section.paragraphs} />}
        {section.list && (
          <ListTag className={cn("space-y-2 pl-5 text-body text-ink/85", section.ordered ? "list-decimal" : "list-disc")}>
            {section.list.map((item, i) => (
              <li key={i} className="pl-1">
                <RichText text={item} />
              </li>
            ))}
          </ListTag>
        )}
      </div>
      {table && <DataTable table={table} />}
      {section.after && (
        <div className="prose-measure mt-6 space-y-4">
          <Paragraphs items={section.after} />
        </div>
      )}
      {children}
    </section>
  );
}

export function Questions({ heading, items }: { heading: string; items: ResourceQuestion[] }) {
  return (
    <section id="questions" aria-labelledby="questions-h" className="scroll-mt-28 border-t border-brand-green/15 pt-10">
      <h2 id="questions-h" className="text-display-row text-brand-green">
        {heading}
      </h2>
      <div className="mt-6 divide-y divide-brand-green/15">
        {items.map((q) => (
          <article key={q.id} id={q.id} className="scroll-mt-28 py-6 first:pt-0">
            <h3 className="text-step-lg text-brand-green">{q.question}</h3>
            <div className="prose-measure mt-3 space-y-3">
              <Paragraphs items={q.answer} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Sources({ items, closing }: { items: ResourceSource[]; closing?: string }) {
  return (
    <section id="sources" aria-labelledby="sources-h" className="scroll-mt-28 border-t border-brand-green/15 pt-10">
      <h2 id="sources-h" className="text-display-row text-brand-green">
        Sources and further reading
      </h2>
      <ul className="prose-measure mt-6 space-y-3 text-body text-ink/85">
        {items.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              rel="noopener"
              className="font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:decoration-brand-green"
            >
              {s.label}
            </a>
            {s.note && <span className="text-ink/70"> — {s.note}</span>}
          </li>
        ))}
      </ul>
      <p className="prose-measure mt-6 text-[14px] leading-relaxed text-ink/70">
        {closing ??
          "Standards bodies own their published text. This guide summarizes and links to them; buy or download the current edition from the publisher before relying on a specific clause."}
      </p>
    </section>
  );
}

export function NextSteps() {
  return (
    <section aria-labelledby="next-steps-h" className="border-t border-brand-green/15 pt-10">
      <h2 id="next-steps-h" className="text-display-row text-brand-green">
        Next steps
      </h2>
      <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-body">
        {MONEY_LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              prefetch={false}
              className="font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:decoration-brand-green"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="nav:sticky nav:top-28">
      <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">On this page</p>
      <ol className="mt-4 space-y-2 border-l border-brand-green/20 pl-4 text-link">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-ink/80 hover:text-brand-green hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function RelatedGuides({ slugs }: { slugs: string[] }) {
  const pillars = slugs.map(getHubPillar).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (pillars.length === 0) return null;
  return (
    <Feature3
      variant="ruled"
      columns={3}
      hairline
      eyebrow="Keep reading"
      heading="Related guides"
      features={pillars.map((p) => ({ title: p.title, href: p.href, description: firstSentence(p.directAnswer) }))}
    />
  );
}

/**
 * Two-column article body: sticky contents rail on wide screens, content
 * column on the right. `toc` lists anchors in page order.
 */
export function ArticleBody({ toc, children }: { toc: { id: string; label: string }[]; children: ReactNode }) {
  return (
    <div className="px-6 pb-20 pt-14 nav:pb-28 nav:pt-16">
      <div className="mx-auto grid max-w-[1440px] gap-10 nav:grid-cols-12 nav:gap-16">
        <aside className="min-w-0 nav:col-span-3">
          <Toc items={toc} />
        </aside>
        <div className="min-w-0 space-y-14 nav:col-span-8 nav:col-start-5">{children}</div>
      </div>
    </div>
  );
}

export function ResourceCta({ heading, body, source }: { heading: string; body: string; source: string }) {
  return <Cta4 heading={heading} description={body} button={{ label: hub.cta.label, href: quoteHref(source) }} />;
}

/**
 * Full guide from a pillar JSON. `extra` (calculators, charts) renders after
 * the section whose id is `extraAfter`, or after all H2 sections if unset.
 */
export function ResourceArticle({
  pillar,
  extra,
  extraToc = [],
  extraAfter,
  schema,
}: {
  pillar: ResourcePillar;
  extra?: ReactNode;
  extraToc?: { id: string; label: string }[];
  extraAfter?: string;
  schema?: ReactNode;
}) {
  const path = `/resources/${pillar.slug}/`;
  const split = extraAfter ? pillar.sections.findIndex((s) => s.id === extraAfter) + 1 : pillar.sections.length;
  const before = split > 0 ? pillar.sections.slice(0, split) : pillar.sections;
  const after = pillar.sections.slice(before.length);
  const toc = [
    ...before.map((s) => ({ id: s.id, label: s.heading })),
    ...extraToc,
    ...after.map((s) => ({ id: s.id, label: s.heading })),
    ...(pillar.questions ? [{ id: "questions", label: pillar.questions.heading }] : []),
    { id: "sources", label: "Sources" },
    ...(hasChangelog(pillar.slug) ? [{ id: "changelog", label: "Changelog" }] : []),
  ];
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: hub.hero.heading, path: "/resources/" },
          { name: pillar.title, path },
        ]}
      />
      <TechArticleJsonLd
        headline={pillar.title}
        description={pillar.metaDescription}
        path={path}
        published={pillar.published}
        updated={pillar.updated}
      />
      {pillar.questions && (
        <FaqPageJsonLd
          items={pillar.questions.items.map((q) => ({
            question: q.question,
            answer: q.answer.map(plainText).join(" "),
          }))}
        />
      )}
      {schema}
      <ArticleHeader eyebrow={pillar.eyebrow} title={pillar.title} updated={pillar.updated} />
      <DirectAnswer text={pillar.directAnswer} />
      <ArticleBody toc={toc}>
        {before.map((s) => (
          <ArticleSection key={s.id} section={s} />
        ))}
        {extra}
        {after.map((s) => (
          <ArticleSection key={s.id} section={s} />
        ))}
        {pillar.questions && <Questions heading={pillar.questions.heading} items={pillar.questions.items} />}
        <Sources items={pillar.sources} />
        <NextSteps />
        <Changelog slug={pillar.slug} />
      </ArticleBody>
      <RelatedGuides slugs={pillar.related} />
      <ResourceCta heading={pillar.cta.heading} body={pillar.cta.body} source={pillar.slug} />
    </main>
  );
}
