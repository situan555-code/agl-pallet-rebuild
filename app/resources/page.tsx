import hub from "@/content/resources/hub.json";
import { Hero3 } from "@/components/hero3";
import { Feature3 } from "@/components/feature3";
import { Feature1 } from "@/components/feature1";
import { Cta4 } from "@/components/cta4";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { DownloadIndexList, StampDecoderHubLink } from "@/components/resources/DownloadPages";
import { QuestionIndexList } from "@/components/resources/QuestionPage";
import { firstSentence } from "@/lib/resources";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(hub.meta.title, hub.meta.description, "/resources/");

export default function ResourcesHub() {
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: hub.hero.heading, path: "/resources/" },
        ]}
      />
      <Hero3
        eyebrow={hub.hero.eyebrow}
        heading={hub.hero.heading}
        description={hub.hero.directAnswer}
        cta={{ label: hub.cta.label, href: hub.cta.href }}
      />

      <Feature3
        variant="ruled"
        columns={2}
        eyebrow={hub.pillarsEyebrow}
        heading={hub.pillarsHeading}
        features={hub.pillars.map((p) => ({
          eyebrow: p.status,
          title: p.title,
          href: p.href,
          description: firstSentence(p.directAnswer),
        }))}
      />

      <QuestionIndexList eyebrow={hub.questionsEyebrow} heading={hub.questionsHeading} />

      <DownloadIndexList />
      <StampDecoderHubLink />

      <Feature1 hairline heading={hub.authorsNote.heading} paragraphs={[hub.authorsNote.body]} />

      <Cta4 heading={hub.cta.heading} description={hub.cta.body} button={{ label: hub.cta.label, href: hub.cta.href }} />
    </main>
  );
}
