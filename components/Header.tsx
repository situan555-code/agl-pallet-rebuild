"use client";

// Shared header. Pattern from free @shadcnblocks/navbar5 (logo · Nav dropdown
// grid · links · primary CTA · mobile Sheet) composed from components/ui.
// Demo Sign-in removed. Nav + CTA from content/site.json. Parchment surface
// with AGL-green type so it sits cleanly over home hero115 and other pages.
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "lucide-react";
import site from "@/content/site.json";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavItem } from "@/components/MobileNav";

const DARK_LOGO = {
  ...site.logo,
  src: "/assets/agl_pallet_logo-dark.svg",
};

// Desktop panel width/columns scale with child count so the 12-guide
// Resources panel stays readable without overflowing the viewport.
function panelLayout(count: number) {
  if (count > 8) return { width: "w-[min(40rem,calc(100vw-3rem))] xl:w-[46rem]", grid: "grid-cols-2 xl:grid-cols-3" };
  if (count > 3) return { width: "w-[26rem]", grid: "grid-cols-2" };
  return { width: "w-[18rem]", grid: "grid-cols-1" };
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Controlled so the menu closes on route change, and so a mouse click on a
  // trigger that hover already opened doesn't toggle it shut (Radix default).
  const [menuValue, setMenuValue] = useState("");
  const pointerType = useRef<string>("");
  const pathname = usePathname();
  const nav = site.nav as NavItem[];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenuValue("");
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-clay/50 bg-paper/95 shadow-[0_1px_0_rgba(31,42,31,0.06)] backdrop-blur-md"
          : "border-transparent bg-paper/90 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-3">
        <Link
          href="/"
          prefetch={false}
          className="shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          <Image
            src={DARK_LOGO.src}
            width={DARK_LOGO.width}
            height={DARK_LOGO.height}
            alt={DARK_LOGO.alt}
            priority
          />
        </Link>

        <NavigationMenu
          className="hidden lg:block"
          viewport={false}
          aria-label="Main"
          value={menuValue}
          onValueChange={setMenuValue}
          delayDuration={80}
        >
          <NavigationMenuList className="gap-1">
            {nav.map((item, index) => {
              if (!item.children?.length) {
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild active={isActive(item.href)}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "h-10 rounded-sm bg-transparent px-3 text-nav-link font-semibold text-brand-green hover:bg-fog-green/40 hover:text-brand-green focus:bg-fog-green/40 data-[active]:underline data-[active]:underline-offset-8"
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              }
              const layout = panelLayout(item.children.length);
              // Items in the right half open leftward so panels stay on screen.
              const alignEnd = index >= nav.length / 2;
              return (
                <NavigationMenuItem key={item.href} value={item.href}>
                  <NavigationMenuTrigger
                    onPointerDown={(e) => {
                      pointerType.current = e.pointerType;
                    }}
                    onClick={(e) => {
                      // Mouse users already opened it by hovering; keep it open.
                      // Keyboard (detail 0) and touch still toggle.
                      if (e.detail > 0 && pointerType.current === "mouse" && menuValue === item.href) {
                        e.preventDefault();
                      }
                    }}
                    className="h-10 rounded-sm bg-transparent px-3 text-nav-link font-semibold text-brand-green hover:bg-fog-green/40 hover:text-brand-green focus:bg-fog-green/40 data-[state=open]:bg-fog-green/40 data-[state=open]:hover:bg-fog-green/40 data-[state=open]:focus:bg-fog-green/40"
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  {/* pt-2 is a transparent hover bridge: no dead gap between
                      trigger and panel for the pointer to fall through. */}
                  <NavigationMenuContent className={cn("pt-2", alignEnd ? "left-auto right-0" : "left-0")}>
                    <div
                      className={cn(
                        "max-h-[calc(100vh-6rem)] overflow-y-auto rounded-sm border border-clay/60 bg-cream p-2 text-brand-green shadow-lg",
                        layout.width
                      )}
                    >
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          prefetch={false}
                          className="mb-1 block rounded-sm border-b border-clay/40 p-3 text-sm font-semibold text-brand-green transition-colors hover:bg-fog-green/40 focus:bg-fog-green/40"
                        >
                          {item.overviewLabel ?? item.label}
                        </Link>
                      </NavigationMenuLink>
                      <ul className={cn("grid gap-1", layout.grid)}>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                prefetch={false}
                                className="block rounded-sm p-3 text-sm font-medium leading-snug text-brand-green transition-colors hover:bg-fog-green/40 focus:bg-fog-green/40"
                              >
                                {child.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            asChild
            className="h-10 rounded-full bg-brand-green px-6 text-nav-link font-semibold text-cream hover:bg-ink"
          >
            <Link href={site.ctaNav.href} prefetch={false}>
              {site.ctaNav.label}
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="outline"
              size="icon"
              aria-label="Open menu"
              className="border-clay/60 bg-cream text-brand-green hover:bg-fog-green/40"
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="top"
            aria-describedby={undefined}
            className="max-h-screen overflow-auto border-b border-clay/50 bg-paper text-ink"
          >
            <SheetHeader>
              <SheetTitle>
                <Link href="/" prefetch={false} className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <Image
                    src={DARK_LOGO.src}
                    width={DARK_LOGO.width}
                    height={DARK_LOGO.height}
                    alt={DARK_LOGO.alt}
                  />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col p-4">
              {/* Same order as desktop: dropdown items expand in place, flat
                  links sit between them as plain rows. */}
              <Accordion type="single" collapsible className="mt-2">
                {nav.map((item) =>
                  item.children?.length ? (
                    <AccordionItem key={item.href} value={item.href} className="border-clay/40">
                      <AccordionTrigger className="items-center py-4 font-sans text-nav-link font-semibold normal-case tracking-normal text-brand-green hover:no-underline [&_[data-slot=accordion-trigger-icon]]:text-brand-green">
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
                  <Button
                    asChild
                    className="h-11 rounded-full bg-brand-green text-nav-link font-semibold text-cream hover:bg-ink"
                  >
                    <Link href={site.ctaNav.href} prefetch={false}>
                      {site.ctaNav.label}
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
