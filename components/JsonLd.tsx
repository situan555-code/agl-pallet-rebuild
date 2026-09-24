import site from "@/content/site.json";

/**
 * Organization JSON-LD, mounted sitewide in app/layout.tsx. Deliberately not
 * LocalBusiness: {{TBD-ADDRESS}} is unresolved (SPEC_V1.md §3), so no
 * streetAddress, and no aggregateRating. sameAs is omitted until real social
 * URLs exist ({{TBD-SOCIAL-URLS}}). See DECISIONS.md Wave 0.
 */

// Escape "<" so content can never close the <script> element early.
function serialize(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function JsonLdScript({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />;
}

export function OrganizationJsonLd() {
  const { organization, footer } = site;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: organization.legalName,
        url: organization.url,
        telephone: footer.contact.phone,
        email: footer.contact.email,
      }}
    />
  );
}

/**
 * LocalBusiness JSON-LD stays deferred until {{TBD-ADDRESS}} resolves
 * (SPEC_V1.md §3). Do not emit streetAddress / aggregateRating.
 */
export function LocalBusinessJsonLd() {
  return null;
}

// Resource guides are published under the organization: authors.json holds
// unconfirmed {{TBD-*}} tokens that must not render, so no Person author.
function orgRef() {
  const { organization } = site;
  return { "@type": "Organization", name: organization.legalName, url: organization.url };
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
  const { url } = site.organization;
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
        author: orgRef(),
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
  const { url } = site.organization;
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
  const { url } = site.organization;
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
  const { url } = site.organization;
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
