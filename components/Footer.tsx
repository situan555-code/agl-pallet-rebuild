import site from "@/content/site.json";
import { Footer2 } from "@/components/footer2";
import { footerLinksForLaunch } from "@/lib/launch";

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
        { title: footer.productsHeading, links: footerLinksForLaunch(footer.productsNav) },
        { title: footer.companyHeading, links: footerLinksForLaunch(footer.companyNav) },
        { title: footer.partnersHeading, links: footerLinksForLaunch(footer.partnersNav) },
      ].filter((section) => section.links.length > 0)}
      copyright={footer.copyright.text}
    />
  );
}
