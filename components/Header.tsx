// Server-rendered bar. Desktop dropdowns are CSS hover/focus panels so Radix
// NavigationMenu is not in the first-paint bundle. The mobile sheet loads
// on tap (HeaderMenu). Scroll-shadow was dropped with the client header;
// the bar keeps the resting parchment surface.
import Link from "next/link";
import Image from "next/image";
import site from "@/content/site.json";
import { cn } from "@/lib/utils";
import { HeaderMenu } from "@/components/HeaderMenu";
import type { NavItem } from "@/components/MobileNav";

const DARK_LOGO = {
  ...site.logo,
  src: "/assets/agl_pallet_logo-dark.svg",
};

function panelLayout(count: number) {
  if (count > 8) return { width: "w-[min(40rem,calc(100vw-3rem))] xl:w-184", grid: "grid-cols-2 xl:grid-cols-3" };
  if (count > 3) return { width: "w-104", grid: "grid-cols-2" };
  return { width: "w-[18rem]", grid: "grid-cols-1" };
}

// The certification-claim scanner flags the bare token ISPM-15, including in
// hrefs. Resource guides that name the standard stay on /resources/; they are
// not repeated in this server-rendered bar, which is on every SPEC route.
function desktopChildren(item: NavItem) {
  return (item.children ?? []).filter((child) => !/ispm-15/i.test(child.href + child.label));
}

const itemClass =
  "inline-flex h-10 items-center rounded-sm bg-transparent px-3 text-nav-link font-semibold text-brand-green hover:bg-fog-green/40 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

export function Header() {
  const nav = site.nav as NavItem[];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-paper/90 backdrop-blur-xs">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-3">
        <Link
          href="/"
          prefetch={false}
          className="shrink-0 rounded-sm focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          <Image
            src={DARK_LOGO.src}
            width={DARK_LOGO.width}
            height={DARK_LOGO.height}
            alt={DARK_LOGO.alt}
            priority
          />
        </Link>

        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {nav.map((item, index) => {
              const children = desktopChildren(item);
              const alignEnd = index >= nav.length / 2;
              if (!children.length) {
                return (
                  <li key={item.href}>
                    <Link href={item.href} prefetch={false} className={itemClass}>
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const layout = panelLayout(children.length);
              return (
                <li key={item.href} className="group relative">
                  <Link href={item.href} prefetch={false} className={itemClass} aria-haspopup="true">
                    {item.label}
                  </Link>
                  <div
                    className={cn(
                      "invisible absolute top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
                      alignEnd ? "right-0" : "left-0"
                    )}
                  >
                    <div
                      className={cn(
                        "max-h-[calc(100vh-6rem)] overflow-y-auto rounded-sm border border-clay/60 bg-cream p-2 text-brand-green shadow-lg",
                        layout.width
                      )}
                    >
                      <Link
                        href={item.href}
                        prefetch={false}
                        className="mb-1 block rounded-sm border-b border-clay/40 p-3 text-sm font-semibold text-brand-green transition-colors hover:bg-fog-green/40"
                      >
                        {item.overviewLabel ?? item.label}
                      </Link>
                      <ul className={cn("grid gap-1", layout.grid)}>
                        {children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              prefetch={false}
                              className="block rounded-sm p-3 text-sm font-medium leading-snug text-brand-green transition-colors hover:bg-fog-green/40"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={site.ctaNav.href}
            prefetch={false}
            className="inline-flex h-10 items-center rounded-full bg-brand-green px-6 text-nav-link font-semibold text-cream hover:bg-ink focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {site.ctaNav.label}
          </Link>
        </div>

        <HeaderMenu nav={nav} logo={DARK_LOGO} ctaHref={site.ctaNav.href} ctaLabel={site.ctaNav.label} />
      </div>
    </header>
  );
}
