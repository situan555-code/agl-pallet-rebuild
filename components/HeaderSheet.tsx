"use client";

// Mobile sheet. Loaded on first tap so Radix Dialog + Accordion stay out of
// the first-paint bundle (mobile LCP gate).
import Link from "next/link";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/Button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { NavItem } from "@/components/MobileNav";

export default function HeaderSheet({
  open,
  onOpenChange,
  nav,
  logo,
  ctaHref,
  ctaLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nav: NavItem[];
  logo: { src: string; width: number; height: number; alt: string };
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        aria-describedby={undefined}
        className="max-h-screen overflow-auto border-b border-clay/50 bg-paper text-ink"
      >
        <SheetHeader>
          <SheetTitle>
            <Link href="/" prefetch={false} className="flex items-center gap-2" onClick={() => onOpenChange(false)}>
              <Image src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col p-4">
          <Accordion type="single" collapsible className="mt-2">
            {nav.map((item) =>
              item.children?.length ? (
                <AccordionItem key={item.href} value={item.href} className="border-clay/40">
                  <AccordionTrigger className="items-center py-4 font-sans text-nav-link font-semibold normal-case tracking-normal text-brand-green hover:no-underline **:data-[slot=accordion-trigger-icon]:text-brand-green">
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="[&_a]:no-underline">
                    <ul className="grid gap-1 sm:grid-cols-2">
                      <li className="sm:col-span-2">
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            prefetch={false}
                            className="block rounded-sm p-3 text-sm font-semibold text-brand-green transition-colors hover:bg-fog-green/40"
                          >
                            {item.overviewLabel ?? item.label}
                          </Link>
                        </SheetClose>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <SheetClose asChild>
                            <Link
                              href={child.href}
                              prefetch={false}
                              className="block rounded-sm p-3 text-sm font-medium text-brand-green transition-colors hover:bg-fog-green/40"
                            >
                              {child.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="border-b border-clay/40 py-4 text-nav-link font-semibold text-brand-green"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              )
            )}
          </Accordion>
          <div className="mt-6 flex flex-col gap-3">
            <SheetClose asChild>
              <Button href={ctaHref} label={ctaLabel} variant="primary" />
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
