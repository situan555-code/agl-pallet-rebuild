"use client";

// Shared header. Pattern from @shadcnblocks/navbar1 (logo left, Radix
// NavigationMenu with dropdowns for items that have children, Sheet on
// mobile) composed from components/ui primitives. Demo menu, icons, and the
// Login / Sign up buttons are gone; nav, logo, and CTA come from
// content/site.json. Keeps the original behavior: transparent over the green
// hero, solid brand green once scrolled past ~90% of the viewport.
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/content/site.json";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MobileNav, type NavItem } from "@/components/MobileNav";

const topLevelClass =
  "inline-flex h-10 items-center rounded-sm bg-transparent px-3 text-nav-link font-semibold text-white transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-0 data-[state=open]:bg-white/10";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const nav = site.nav as NavItem[];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-brand-green shadow-[0_1px_0_rgba(255,255,255,0.08)]" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          prefetch={false}
          className="shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Image src={site.logo.src} width={site.logo.width} height={site.logo.height} alt={site.logo.alt} />
        </Link>

        <div className="hidden items-center gap-4 nav:flex">
          <NavigationMenu viewport={false} aria-label="Main">
            <NavigationMenuList className="gap-1">
              {nav.map((item) =>
                item.children?.length ? (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger className={topLevelClass}>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute left-0 top-full mt-2 w-auto min-w-[240px] !rounded-sm !bg-brand-green p-2 !text-white shadow-lg !ring-1 !ring-white/10">
                      <ul className="flex flex-col">
                        {[{ label: item.label, href: item.href }, ...item.children].map((child, i) => (
                          <li key={child.href} className={cn(i === 1 && "mt-1 border-t border-white/15 pt-1")}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                prefetch={false}
                                className="block rounded-sm px-3 py-2.5 text-nav-link font-semibold text-white hover:bg-white/10 focus:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                              >
                                {child.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild active={isActive(item.href)}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className={cn(topLevelClass, "data-[active]:underline data-[active]:underline-offset-8")}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
          <Link
            href={site.ctaNav.href}
            prefetch={false}
            className="rounded-full bg-white px-6 py-2.5 text-nav-link font-semibold text-brand-green transition-colors hover:bg-surface active:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {site.ctaNav.label}
          </Link>
        </div>

        <MobileNav navItems={nav} logo={site.logo} ctaHref={site.ctaNav.href} ctaLabel={site.ctaNav.label} />
      </div>
    </header>
  );
}
