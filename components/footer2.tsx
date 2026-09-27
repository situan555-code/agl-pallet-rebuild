import Link from "next/link";
import Image from "next/image";
import { MailIcon, PhoneIcon } from "@/components/inline-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { containerClass } from "@/components/Container";

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
  contact: { phone: string; email: string };
  cta: FooterLink;
  sections: FooterSection[];
  copyright: string;
  className?: string;
}

const linkClass =
  "rounded-input text-link text-current/85 transition-colors hover:text-current focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const Footer2 = ({ logo, description, contact, cta, sections, copyright, className }: Footer2Props) => {
  return (
    <footer className={cn("mt-[72px] border-t border-current/15 pb-10 pt-16 nav:mt-[112px]", className)}>
      <div className={cn(containerClass, "text-current")}>
        <div className="flex flex-col gap-12 nav:flex-row nav:items-start nav:justify-between nav:gap-16">
          <div className="max-w-md shrink-0">
            <Link
              href="/"
              prefetch={false}
              className="inline-block focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <Image src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} />
            </Link>
            <p className="mt-6 text-body text-current/80">{description}</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`tel:${contact.phone.replace(/-/g, "")}`} className={cn(linkClass, "inline-flex items-center gap-2")}>
                  <PhoneIcon className="h-4 w-4" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={cn(linkClass, "inline-flex items-center gap-2")}>
                  <MailIcon className="h-4 w-4" />
                  {contact.email}
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <Button href={cta.href} label={cta.label} variant="secondary" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 nav:min-w-[28rem]">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-6 text-display-4 text-current">{section.title}</h2>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href} className="last:pb-2">
                      <Link href={link.href} prefetch={false} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-current/15 pt-8">
          <p className="text-body text-current/70">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer2 };
