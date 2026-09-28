import site from "@/content/site.json";
import { Footer2 } from "@/components/footer2";
import type { PageField } from "@/lib/page-field";

export function Footer({ field = "dark" }: { field?: PageField }) {
  const { footer } = site;

  return (
    <Footer2
      logo={{
        src: field === "light" ? "/assets/agl_pallet_logo-dark.svg" : site.logo.src,
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
