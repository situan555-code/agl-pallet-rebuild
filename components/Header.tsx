"use client";

// Shared header. Pattern from free @shadcnblocks/navbar5 (logo · Nav dropdown
// grid · links · primary CTA · mobile Sheet) composed from components/ui.
// Demo Sign-in removed. Nav + CTA from content/site.json. Parchment surface
// with AGL-green type so it sits cleanly over home hero115 and other pages.
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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

        <NavigationMenu className="hidden lg:block" viewport={false} aria-label="Main">
          <NavigationMenuList className="gap-1">
            {nav.map((item) =>
              item.children?.length ? (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger className="h-10 rounded-sm bg-transparent px-3 text-nav-link font-semibold text-brand-green hover:bg-fog-green/40 hover:text-brand-green focus:bg-fog-green/40 data-[state=open]:bg-fog-green/40">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-0 top-full mt-2 min-w-[280px] rounded-sm border border-clay/50 bg-cream p-2 text-ink shadow-lg md:min-w-[420px]">
                    <div
                      className={cn(
                        "grid gap-1",
                        item.children.length > 3 ? "grid-cols-2" : "grid-cols-1"
                      )}
                    >
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          prefetch={false}
                          className="rounded-sm p-3 font-semibold text-brand-green transition-colors hover:bg-fog-green/40"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                      {item.children.map((child) => (
                        <NavigationMenuLink asChild key={child.href}>
                          <Link
                            href={child.href}
                            prefetch={false}
                            className="rounded-sm p-3 transition-colors hover:bg-fog-green/40"
                          >
                            <p className="font-semibold text-brand-green">{child.label}</p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
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
              )
            )}
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
              <Accordion type="single" collapsible className="mb-2 mt-2">
                {nav
                  .filter((item) => item.children?.length)
                  .map((item) => (
                    <AccordionItem key={item.href} value={item.href} className="border-clay/40">
                      <AccordionTrigger className="text-nav-link font-semibold text-brand-green hover:no-underline">
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-1 md:grid-cols-2">
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              prefetch={false}
                              className="rounded-sm p-3 font-semibold text-brand-green transition-colors hover:bg-fog-green/40"
                            >
                              {item.label}
                            </Link>
                          </SheetClose>
                          {item.children!.map((child) => (
                            <SheetClose asChild key={child.href}>
                              <Link
                                href={child.href}
                                prefetch={false}
                                className="rounded-sm p-3 font-semibold text-brand-green transition-colors hover:bg-fog-green/40"
                              >
                                {child.label}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
              <div className="flex flex-col gap-4">
                {nav
                  .filter((item) => !item.children?.length)
                  .map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href} prefetch={false} className="font-semibold text-brand-green">
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
              </div>
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
