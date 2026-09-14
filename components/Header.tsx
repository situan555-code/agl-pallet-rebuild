"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/content/site.json";
import { HamburgerIcon, CloseIcon } from "@/components/icons";
import { MobileNav } from "@/components/MobileNav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the panel is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Escape-to-close.
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
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="text-nav-link font-semibold text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={site.ctaNav.href}
            prefetch={false}
            className="rounded-full bg-white px-6 py-2 text-nav-link font-semibold text-brand-green"
          >
            {site.ctaNav.label}
          </Link>
        </nav>

        <button
          type="button"
          className="text-white nav:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon className="h-7 w-7" /> : <HamburgerIcon className="h-7 w-7" />}
        </button>
      </div>

      <MobileNav
        navItems={site.nav}
        ctaHref={site.ctaNav.href}
        ctaLabel={site.ctaNav.label}
        isOpen={menuOpen}
        onNavigate={() => setMenuOpen(false)}
      />
    </header>
  );
}
