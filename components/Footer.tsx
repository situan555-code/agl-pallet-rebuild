import site from "@/content/site.json";
import { Footer2 } from "@/components/footer2";

function socialLinks(urls: string[]) {
  return urls.flatMap((href) => {
    const host = href.toLowerCase();
    if (host.includes("linkedin.com")) return [{ href, label: "LinkedIn" }];
    if (host.includes("facebook.com")) return [{ href, label: "Facebook" }];
    return [];
  });
}

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
      social={socialLinks(site.organization.sameAs)}
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
