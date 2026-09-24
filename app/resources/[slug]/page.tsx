import hub from "@/content/resources/hub.json";
import { Hero3 } from "@/components/hero3";
import { Feature1 } from "@/components/feature1";
import { Cta4 } from "@/components/cta4";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Wave 0 soft stubs: one template for all twelve pillars so the sitemap
// never points at a 404. Each wave replaces its stubs with full guides.
export const dynamicParams = false;

export function generateStaticParams() {
  return hub.pillars.map((p) => ({ slug: p.slug }));
}

function getPillar(slug: string) {
  return hub.pillars.find((p) => p.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const pillar = getPillar(params.slug);
  if (!pillar) return {};
  return pageMeta(`${pillar.title} — AGL Pallet`, pillar.directAnswer, pillar.href);
}

export default function ResourceStub({ params }: { params: { slug: string } }) {
  const pillar = getPillar(params.slug);
  if (!pillar) notFound();
  const { stub, cta } = hub;
  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: hub.hero.heading, path: "/resources/" },
          { name: pillar.title, path: pillar.href },
        ]}
      />
      <Hero3 eyebrow={stub.eyebrow} heading={pillar.title} description={pillar.directAnswer} />

      <Feature1 eyebrow={pillar.status} heading={stub.noteHeading} paragraphs={[stub.noteBody]} cta={stub.backLink} />

      <Cta4 heading={cta.heading} description={cta.body} button={{ label: cta.label, href: cta.href }} />
    </main>
  );
}
