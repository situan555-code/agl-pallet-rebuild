"use client";

// Mobile navigation sheet. Pattern from @shadcnblocks/navbar1's mobile menu:
// a Sheet with an Accordion for items that have children. Composed from
// components/ui (Radix Dialog + Accordion) so focus trap, Escape, scroll
// lock, and aria wiring come from Radix. Demo auth buttons removed; the only
// CTA is site.json's Request a Quote. Loaded on first tap by MobileNav.tsx
// so Radix Dialog/Accordion stay out of the first-paint bundle.
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { NavItem } from "@/components/MobileNav";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const rowClass =
  "block w-full px-6 py-4 text-left text-nav-link font-semibold text-bone transition-colors hover:bg-bone/10 focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ice";

export default function MobileNavSheet({
  open,
  onOpenChange,
  navItems,
  logo,
  ctaHref,
  ctaLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: NavItem[];
  logo: { src: string; width: number; height: number; alt: string };
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="w-full max-w-sm gap-0 overflow-y-auto data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right border-l-0 bg-moss p-0 text-bone sm:max-w-sm *:data-[slot=sheet-close]:right-5 *:data-[slot=sheet-close]:top-5 *:data-[slot=sheet-close]:h-9 *:data-[slot=sheet-close]:w-9 *:data-[slot=sheet-close]:text-bone hover:*:data-[slot=sheet-close]:bg-bone/10"
      >
        <SheetHeader className="px-6 py-5">
          <SheetTitle className="text-bone">
            <Image src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile">
          <Accordion type="single" collapsible className="border-t border-bone/20">
            {navItems.map((item) =>
              item.children?.length ? (
                <AccordionItem key={item.href} value={item.href} className="border-b border-bone/20">
                  <AccordionTrigger className="group/mnav items-center font-sans normal-case rounded-none px-6 py-4 text-nav-link font-semibold text-bone hover:bg-bone/10 hover:no-underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ice **:data-[slot=accordion-trigger-icon]:hidden!">
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/mnav:rotate-180"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 [&_a]:no-underline">
                    <ul>
                      {[{ label: item.label, href: item.href }, ...item.children].map((child) => (
                        <li key={child.href}>
                          <SheetClose asChild>
                            <Link href={child.href} prefetch={false} className={cn(rowClass, "pl-10 text-bone/85")}>
                              {child.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div key={item.href} className="border-b border-bone/20">
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
            <Button href={ctaHref} label={ctaLabel} variant="primary" />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
