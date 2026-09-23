import site from "@/content/site.json";
import { Footer2 } from "@/components/footer2";

export function Footer() {
  const { footer } = site;

  return (
    <Footer2
      logo={site.logo}
      description={footer.blurb}
      address={footer.address}
      contact={footer.contact}
      cta={site.ctaNav}
      sections={[
        { title: footer.productsHeading, links: footer.productsNav },
        { title: footer.companyHeading, links: footer.companyNav },
        { title: footer.partnersHeading, links: footer.partnersNav },
      ]}
      copyright={footer.copyright.text}
    />
  );
}
