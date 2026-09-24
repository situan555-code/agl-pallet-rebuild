import hub from "@/content/resources/hub.json";
import { Hero3 } from "@/components/hero3";
import { Feature1 } from "@/components/feature1";
import { Cta4 } from "@/components/cta4";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ResourceArticle } from "@/components/resources/ResourceArticle";
import { DEDICATED_ROUTES, getGuide } from "@/lib/resource-pillars";
import { getHubPillar } from "@/lib/resources";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// One SSG template for every hub pillar without its own route folder. A
// pillar with a guide JSON renders the full article; any other pillar
// falls back to the Wave 0 soft stub so the sitemap never points at a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return hub.pillars.filter((p) => !DEDICATED_ROUTES.includes(p.slug)).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (guide) return pageMeta(guide.metaTitle, guide.metaDescription, `/resources/${guide.slug}/`);
  const pillar = getHubPillar(params.slug);
  if (!pillar) return {};
  return pageMeta(`${pillar.title} — AGL Pallet`, pillar.directAnswer, pillar.href);
}

export default function ResourcePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (guide) return <ResourceArticle pillar={guide} />;

  const pillar = getHubPillar(params.slug);
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
