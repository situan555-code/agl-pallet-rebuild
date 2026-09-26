"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/Button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { NavItem } from "@/components/MobileNav";
import { groupResourceChildren } from "@/lib/nav-groups";

function isMenuTrigger(event: { target: EventTarget | null }) {
  return event.target instanceof Element && Boolean(event.target.closest("[data-nav-menu-trigger]"));
}

export default function HeaderSheet({
  open,
  onOpenChange,
  onCloseAutoFocus,
  nav,
  ctaHref,
  ctaLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus?: () => void;
  nav: NavItem[];
  logo: { src: string; width: number; height: number; alt: string };
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        showCloseButton={false}
        aria-describedby={undefined}
        overlayClassName="top-[4.5rem]! bg-moss/40"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onCloseAutoFocus?.();
        }}
        onPointerDownOutside={(event) => {
          if (isMenuTrigger(event)) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (isMenuTrigger(event)) event.preventDefault();
        }}
        className="inset-x-4 top-[4.75rem] bottom-auto left-4 right-4 h-auto max-h-[calc(100dvh-5.75rem)] w-auto max-w-none gap-0 overflow-hidden rounded-section border border-smoke bg-moss/85 p-0 text-bone shadow-lg backdrop-blur-[16px] sm:max-w-none md:inset-x-6 md:left-6 md:right-6 data-[side=top]:inset-x-4 data-[side=top]:top-[4.75rem] data-[side=top]:h-auto data-[side=top]:border-smoke md:data-[side=top]:inset-x-6"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            <Accordion type="single" collapsible className="mt-2">
              {nav.map((item) =>
                item.children?.length ? (
                  <AccordionItem key={item.href} value={item.href} className="border-smoke">
                    <AccordionTrigger className="items-center py-4 font-sans text-nav-link font-semibold normal-case tracking-normal text-bone hover:no-underline **:data-[slot=accordion-trigger-icon]:text-ice">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="[&_a]:no-underline">
                      {item.href === "/resources/" ? (
                        groupResourceChildren(item.children).map((group) =>
                          group.items.length ? (
                            <div key={group.name} className="mb-3">
                              <p className="px-3 text-eyebrow font-semibold uppercase tracking-wide text-ice">
                                {group.name}
                              </p>
                              <ul className="grid gap-1">
                                {group.items.map((child) => (
                                  <li key={child.href}>
                                    <SheetClose asChild>
                                      <Link
                                        href={child.href}
                                        prefetch={false}
                                        className="block rounded-input p-3 text-sm font-medium text-bone hover:bg-smoke"
                                      >
                                        {child.label}
                                      </Link>
                                    </SheetClose>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null
                        )
                      ) : (
                        <ul className="grid gap-1">
                          <li>
                            <SheetClose asChild>
                              <Link
                                href={item.href}
                                prefetch={false}
                                className="block rounded-input p-3 text-sm font-semibold text-bone hover:bg-smoke"
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
                                  className="block rounded-input p-3 text-sm font-medium text-bone hover:bg-smoke"
                                >
                                  {child.label}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="border-b border-smoke py-4 text-nav-link font-semibold text-bone"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                )
              )}
            </Accordion>
          </div>
          <div className="border-t border-smoke p-4">
            <SheetClose asChild>
              <Button href={ctaHref} label={ctaLabel} variant="primary" />
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
