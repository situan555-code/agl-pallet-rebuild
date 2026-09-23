"use client";

// Mobile navigation. Pattern from @shadcnblocks/navbar1's mobile menu: a
// Sheet with an Accordion for items that have children. Composed from
// components/ui (Radix Dialog + Accordion) so focus trap, Escape, scroll
// lock, and aria wiring come from Radix. Demo auth buttons removed; the only
// CTA is site.json's Request a Quote.
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { HamburgerIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

const rowClass =
  "block w-full px-6 py-4 text-left text-nav-link font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white";

export function MobileNav({
  navItems,
  logo,
  ctaHref,
  ctaLabel,
}: {
  navItems: NavItem[];
  logo: { src: string; width: number; height: number; alt: string };
  ctaHref: string;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="rounded-sm text-white nav:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label="Open menu"
        >
          <HamburgerIcon className="h-7 w-7" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="w-full max-w-sm gap-0 overflow-y-auto data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right border-l-0 bg-brand-green p-0 text-white sm:max-w-sm [&>[data-slot=sheet-close]]:right-5 [&>[data-slot=sheet-close]]:top-5 [&>[data-slot=sheet-close]]:h-9 [&>[data-slot=sheet-close]]:w-9 [&>[data-slot=sheet-close]]:text-white [&>[data-slot=sheet-close]]:hover:bg-white/10"
      >
        <SheetHeader className="px-6 py-5">
          <SheetTitle className="text-white">
            <Image src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile">
          <Accordion type="single" collapsible className="border-t border-white/20">
            {navItems.map((item) =>
              item.children?.length ? (
                <AccordionItem key={item.href} value={item.href} className="border-b border-white/20">
                  <AccordionTrigger className="group/mnav items-center rounded-none px-6 py-4 text-nav-link font-semibold text-white hover:bg-white/10 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white [&_[data-slot=accordion-trigger-icon]]:hidden">
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/mnav:rotate-180"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <ul>
                      {[{ label: item.label, href: item.href }, ...item.children].map((child) => (
                        <li key={child.href}>
                          <SheetClose asChild>
                            <Link href={child.href} prefetch={false} className={cn(rowClass, "pl-10 text-white/85")}>
                              {child.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div key={item.href} className="border-b border-white/20">
                  <SheetClose asChild>
                    <Link href={item.href} prefetch={false} className={rowClass}>
                      {item.label}
                    </Link>
                  </SheetClose>
                </div>
              )
            )}
          </Accordion>
        </nav>
        <div className="px-6 py-8">
          <SheetClose asChild>
            <Link
              href={ctaHref}
              prefetch={false}
              className="block rounded-full bg-white px-6 py-3 text-center text-nav-link font-semibold text-brand-green transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {ctaLabel}
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
