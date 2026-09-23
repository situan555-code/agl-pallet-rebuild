// Adapted from @shadcnblocks/footer2 (free). Layout kept: brand column
// spanning two tracks of a six-track grid, link sections beside it, and a
// hairline-separated bottom bar. Demo logo, sections, social icons, and
// legal links removed — AGL data comes from content/site.json. No social
// block ({{TBD-SOCIAL-URLS}} is unresolved; SPEC says omit entirely).
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface Footer2Props {
  logo: { src: string; width: number; height: number; alt: string };
  description: string;
  address: string;
  contact: { phone: string; email: string };
  cta: FooterLink;
  sections: FooterSection[];
  copyright: string;
  className?: string;
}

const linkClass =
  "rounded-sm text-link text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const Footer2 = ({ logo, description, address, contact, cta, sections, copyright, className }: Footer2Props) => {
  return (
    <footer className={cn("bg-brand-green px-6 pb-10 pt-20 text-white nav:pt-24", className)}>
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3 nav:grid-cols-6">
          <div className="md:col-span-3 nav:col-span-2">
            <Link href="/" prefetch={false} className="inline-block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <Image src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} />
            </Link>
            <p className="mt-6 max-w-sm text-body text-white/80">{description}</p>
            <p className="mt-4 text-body text-white/80">{address}</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`tel:${contact.phone.replace(/-/g, "")}`} className={cn(linkClass, "inline-flex items-center gap-2")}>
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={cn(linkClass, "inline-flex items-center gap-2")}>
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  {contact.email}
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <Button href={cta.href} label={cta.label} variant="pill-light" />
            </div>
          </div>
          {sections.map((section, i) => (
            <div key={section.title} className={cn(i === 0 && "nav:col-start-4")}>
              <h2 className="mb-6 text-display-4 text-white">{section.title}</h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} prefetch={false} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-white/20 pt-8">
          <p className="text-body text-white/70">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer2 };
