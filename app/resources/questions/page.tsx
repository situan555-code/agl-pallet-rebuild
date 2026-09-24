import type { Metadata } from "next";
import hub from "@/content/resources/hub.json";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { QuestionIndexList } from "@/components/resources/QuestionPage";
import { ArticleHeader, ResourceCta } from "@/components/resources/ResourceArticle";
import { RichText } from "@/components/resources/RichText";
import { QUESTIONS_PATH, questionCrumbs, questionIndex } from "@/lib/questions";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(questionIndex.metaTitle, questionIndex.metaDescription, QUESTIONS_PATH);

export default function QuestionsIndexPage() {
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: questionCrumbs.resources, path: "/resources/" },
          { name: questionCrumbs.questions, path: QUESTIONS_PATH },
        ]}
      />
      <ArticleHeader
        eyebrow={questionIndex.eyebrow}
        title={questionIndex.heading}
        updated={questionIndex.updated}
        libraryLabel={questionCrumbs.resources}
      />
      <section className="px-6 pt-14 nav:pt-20">
        <p className="prose-measure mx-auto max-w-[1440px] text-body text-ink/85">
          <RichText text={questionIndex.intro} />
        </p>
      </section>
      <QuestionIndexList />
      <ResourceCta heading={hub.cta.heading} body={hub.cta.body} source="questions" />
    </main>
  );
}
