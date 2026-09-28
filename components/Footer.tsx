import site from "@/content/site.json";
import { Footer2 } from "@/components/footer2";

export function Footer() {
  const { footer } = site;

  return (
    <Footer2
      logo={{
        src: site.logo.src,
        lightSrc: "/assets/agl_pallet_logo-dark.svg",
        width: site.logo.width,
        height: site.logo.height,
        alt: site.logo.alt,
      }}
      description={footer.blurb}
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
