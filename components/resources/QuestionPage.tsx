import hub from "@/content/resources/hub.json";
import { Feature3 } from "@/components/feature3";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { QuestionAsset } from "@/components/resources/QuestionAssets";
import { ArticleBody, ArticleHeader, ArticleSection, DirectAnswer, ReadingPanel, ResourceCta, Sources } from "@/components/resources/ResourceArticle";
import { plainText } from "@/components/resources/RichText";
import {
  QUESTIONS_PATH,
  getQuestion,
  questionCrumbs,
  questionIndex,
  questionPath,
  questions,
  type QuestionItem,
} from "@/lib/questions";

export function QuestionArticle({ item }: { item: QuestionItem }) {
  const path = questionPath(item.slug);
  const toc = [
    { id: "asset", label: item.asset.heading },
    { id: "sources", label: "Sources" },
  ];
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: questionCrumbs.resources, path: "/resources/" },
          { name: questionCrumbs.questions, path: QUESTIONS_PATH },
          { name: item.question, path },
        ]}
      />
      <ArticleJsonLd
        headline={item.question}
        description={plainText(item.directAnswer)}
        path={path}
        published={item.published}
        updated={item.updated}
      />
      <ArticleHeader
        eyebrow={item.eyebrow}
        title={item.question}
        updated={item.updated}
        libraryLabel={questionCrumbs.resources}
        crumbs={[{ name: questionCrumbs.questions, href: QUESTIONS_PATH }]}
      />
      <ReadingPanel>
        <DirectAnswer text={item.directAnswer} />
        <ArticleBody toc={toc}>
          <ArticleSection section={{ id: "asset", heading: item.asset.heading, paragraphs: [item.asset.lead] }}>
            <QuestionAsset item={item} />
          </ArticleSection>
          <Sources items={item.sources} closing={questionIndex.sourcesClosing} />
        </ArticleBody>
      </ReadingPanel>
      <RelatedQuestions slugs={item.related} />
      <ResourceCta heading={hub.cta.heading} body={hub.cta.body} source={`q-${item.slug}`} />
    </main>
  );
}

export function RelatedQuestions({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map((slug) => getQuestion(slug))
    .filter((item): item is QuestionItem => Boolean(item))
    .slice(0, 4);
  if (items.length === 0) return null;
  return (
    <Feature3
      variant="ruled"
      columns={2}
      hairline
      eyebrow={questionIndex.relatedEyebrow}
      heading={questionIndex.relatedHeading}
      features={items.map((item) => ({
        title: item.question,
        href: questionPath(item.slug),
        description: item.summary,
      }))}
    />
  );
}

export function QuestionIndexList({
  eyebrow = questionIndex.relatedEyebrow,
  heading = questionIndex.listHeading,
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
      features={questions.map((item) => ({
        eyebrow: item.eyebrow,
        title: item.question,
        href: questionPath(item.slug),
        description: item.summary,
      }))}
    />
  );
}
