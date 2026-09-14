import site from "@/content/site.json";

const SITE_URL = "https://aglpallet.com";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "AGL Pallet",
    url: SITE_URL,
    telephone: site.footer.contact.phone,
    email: site.footer.contact.email,
    description: site.footer.blurb,
    image: `${SITE_URL}/assets/agl_social_share.jpg`,
    sameAs: [site.footer.social.facebook, site.footer.social.linkedin],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
