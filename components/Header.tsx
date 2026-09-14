"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/content/site.json";
import { HamburgerIcon, CloseIcon } from "@/components/icons";
import { MobileNav } from "@/components/MobileNav";

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-brand-green" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
        <Link href="/" prefetch={false} className="shrink-0">
          <Image
            src={site.logo.src}
            width={site.logo.width}
            height={site.logo.height}
            alt={site.logo.alt}
          />
        </Link>

        <nav className="hidden nav:flex nav:items-center nav:gap-8">
          {nav.map((item) =>
            item.children?.length ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  prefetch={false}
                  className="text-nav-link font-semibold text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-sm"
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                  onFocus={() => setOpenDropdown(item.label)}
                >
                  {item.label}
                </Link>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full z-50 min-w-[220px] pt-2">
                    <ul className="rounded-lg bg-brand-green py-2 shadow-lg ring-1 ring-white/10">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            prefetch={false}
                            className="block px-4 py-2 text-nav-link font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="text-nav-link font-semibold text-white transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-sm"
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href={site.ctaNav.href}
            prefetch={false}
            className="rounded-full bg-white px-6 py-2 text-nav-link font-semibold text-brand-green transition-colors hover:bg-surface active:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {site.ctaNav.label}
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-sm text-white nav:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon className="h-7 w-7" /> : <HamburgerIcon className="h-7 w-7" />}
        </button>
      </div>

      <MobileNav
        navItems={nav}
        ctaHref={site.ctaNav.href}
        ctaLabel={site.ctaNav.label}
        isOpen={menuOpen}
        onNavigate={() => setMenuOpen(false)}
      />
    </header>
  );
}
