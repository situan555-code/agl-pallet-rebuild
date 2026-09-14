import Link from "next/link";
import Image from "next/image";
import site from "@/content/site.json";
import { Button } from "@/components/Button";
import { FacebookIcon, LinkedInIcon, PhoneIcon, EnvelopeIcon } from "@/components/icons";

export function Footer() {
  const { footer } = site;

  return (
    <footer className="bg-brand-green px-6 py-20 nav:py-24 text-white">
      <div className="mx-auto grid max-w-[1440px] gap-16 nav:grid-cols-4">
        <div>
          <Image
            src={site.logo.src}
            width={site.logo.width}
            height={site.logo.height}
            alt={site.logo.alt}
            className="mb-4"
          />
          <p className="text-body text-white/80">{footer.blurb}</p>
          <div className="mt-6">
            <Button href={site.ctaNav.href} label={site.ctaNav.label} variant="pill-light" />
          </div>
        </div>

        <div>
          <h4 className="mb-6 text-display-4">{footer.navHeading}</h4>
          <ul className="space-y-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false} className="text-link transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-display-4">{footer.servicesHeading}</h4>
          <ul className="space-y-3">
            {footer.servicesNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false} className="text-link transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-display-4">{footer.contactHeading}</h4>
          <ul className="space-y-3">
            <li>
              <a
                href={`tel:${footer.contact.phone.replace(/-/g, "")}`}
                className="flex items-center gap-2 text-link transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
              >
                <PhoneIcon className="h-4 w-4" />
                {footer.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${footer.contact.email}`} className="flex items-center gap-2 text-link transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm">
                <EnvelopeIcon className="h-4 w-4" />
                {footer.contact.email}
              </a>
            </li>
          </ul>

          <h4 className="mb-4 mt-8 text-display-4">{footer.socialHeading}</h4>
          <div className="flex gap-4">
            <a href={footer.social.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href={footer.social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-16 max-w-[1440px] text-body text-white/70">
        {footer.copyright.text}
      </p>
    </footer>
  );
}
