import site from "@/content/site.json";
import { articlePeopleJsonLd } from "@/lib/authors";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Organization JSON-LD, mounted sitewide in app/layout.tsx.
 * No street address and no LocalBusiness type. sameAs lists only profiles
 * that exist today (content/site.json). See DECISIONS.md §2.
 */

// Escape "<" so content can never close the <script> element early.
function serialize(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function JsonLdScript({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />;
}

export function OrganizationJsonLd() {
  const { organization, footer, logo } = site;
  const url = getSiteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization.legalName,
    url,
    logo: `${url}${logo.src}`,
    telephone: footer.contact.phone,
    email: footer.contact.email,
    areaServed: "US",
  };
  if (organization.sameAs.length > 0) data.sameAs = organization.sameAs;
  return <JsonLdScript data={data} />;
}

function orgRef() {
  const { organization } = site;
  return { "@type": "Organization", name: organization.legalName, url: getSiteUrl() };
}

export function TechArticleJsonLd({
  headline,
  description,
  path,
  published,
  updated,
}: {
  headline: string;
  description: string;
  path: string;
  published: string;
  updated: string;
}) {
  const url = getSiteUrl();
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline,
        description,
        url: `${url}${path}`,
        mainEntityOfPage: `${url}${path}`,
        datePublished: published,
        dateModified: updated,
        inLanguage: "en-US",
        ...articlePeopleJsonLd(),
        publisher: orgRef(),
      }}
    />
  );
}

// Only mount alongside Q&A that is visible on the same page.
export function FaqPageJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

export function DefinedTermSetJsonLd({
  name,
  path,
  terms,
}: {
  name: string;
  path: string;
  terms: { id: string; term: string; definition: string }[];
}) {
  const url = getSiteUrl();
  const setId = `${url}${path}`;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "@id": setId,
        name,
        url: setId,
        hasDefinedTerm: terms.map((t) => ({
          "@type": "DefinedTerm",
          "@id": `${setId}#${t.id}`,
          name: t.term,
          description: t.definition,
          url: `${setId}#${t.id}`,
          inDefinedTermSet: setId,
        })),
      }}
    />
  );
}

// Only for calculators that actually compute a result on the page.
export function WebApplicationJsonLd({ name, description, path }: { name: string; description: string; path: string }) {
  const url = getSiteUrl();
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        description,
        url: `${url}${path}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: orgRef(),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const url = getSiteUrl();
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${url}${item.path}`,
        })),
      }}
    />
  );
}
