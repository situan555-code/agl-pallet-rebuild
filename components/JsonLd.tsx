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
