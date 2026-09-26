// Floating inset pill nav. Desktop dropdowns stay CSS-only so Radix is not
// in the first-paint bundle. Mobile sheet and search load on demand.
import Link from "next/link";
import Image from "next/image";
import site from "@/content/site.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { HeaderMenu } from "@/components/HeaderMenu";
import { NavFrame } from "@/components/NavFrame";
import { SearchTrigger } from "@/components/SearchTrigger";
import type { NavItem } from "@/components/MobileNav";
import { groupResourceChildren, TRUCKLOAD_HREF } from "@/lib/nav-groups";

const LIGHT_LOGO = site.logo;

function desktopChildren(item: NavItem) {
  return (item.children ?? []).filter((child) => !/ispm-15/i.test(child.href + child.label));
}

const itemClass =
  "inline-flex h-8 items-center whitespace-nowrap rounded-full px-2 text-[13px] font-semibold text-bone hover:bg-smoke focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice";

export function Header() {
  const nav = site.nav as NavItem[];

  return (
    <NavFrame>
      <Link
        href="/"
        prefetch={false}
        className="shrink-0 border-0 bg-transparent shadow-none ring-0 outline-none hover:bg-transparent hover:ring-0 focus:outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ice"
      >
        <Image
          src={LIGHT_LOGO.src}
          width={65}
          height={29}
          alt={LIGHT_LOGO.alt}
          className="h-[29px] w-auto border-0 bg-transparent shadow-none ring-0 outline-none"
        />
      </Link>

      <nav className="hidden min-w-0 xl:block" aria-label="Main">
        <ul className="flex items-center gap-0.5">
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
            const isResources = item.href === "/resources/";
            const groups = isResources ? groupResourceChildren(children) : null;
            const featured = children.find((c) => c.href === TRUCKLOAD_HREF);
            return (
              <li key={item.href} className="group relative">
                <Link href={item.href} prefetch={false} className={itemClass} aria-haspopup="true">
                  {item.label}
                </Link>
                <div
                  className={cn(
                    "invisible absolute top-full z-50 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
                    alignEnd ? "right-0" : "left-0"
                  )}
                >
                  <div
                    className={cn(
                      "max-h-[calc(100vh-6rem)] overflow-y-auto rounded-card border border-smoke bg-green p-3 text-bone shadow-lg",
                      isResources ? "w-[min(44rem,calc(100vw-3rem))]" : "w-[18rem]"
                    )}
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="mb-2 block rounded-input border-b border-smoke p-3 text-sm font-semibold hover:bg-smoke/60"
                    >
                      {item.overviewLabel ?? item.label}
                    </Link>
                    {groups ? (
                      <div className="grid gap-4 md:grid-cols-3">
                        {groups.map((group) =>
                          group.items.length ? (
                            <div key={group.name}>
                              <p className="px-3 text-eyebrow font-semibold uppercase tracking-wide text-ice">
                                {group.name}
                              </p>
                              <ul className="mt-1">
                                {group.items.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      prefetch={false}
                                      className="block rounded-input p-2 text-sm font-medium leading-snug hover:bg-smoke/60"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null
                        )}
                      </div>
                    ) : (
                      <ul className="grid gap-1">
                        {children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              prefetch={false}
                              className="block rounded-input p-3 text-sm font-medium leading-snug hover:bg-smoke/60"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    {featured ? (
                      <Link
                        href={featured.href}
                        prefetch={false}
                        className="mt-3 block rounded-card border border-ice/30 bg-moss p-4 text-sm font-semibold hover:bg-smoke"
                      >
                        {featured.label}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden items-center gap-2 xl:flex">
        <SearchTrigger className="inline-flex h-9 items-center rounded-full border border-gray/40 px-3 text-nav-link font-semibold text-bone hover:bg-smoke" />
        <Button href={site.ctaNav.href} label={site.ctaNav.label} variant="primary" />
      </div>

      <div className="flex items-center gap-2 xl:hidden">
        <SearchTrigger className="inline-flex h-9 items-center rounded-full border border-gray/40 px-3 text-nav-link font-semibold text-bone" />
        <HeaderMenu nav={nav} logo={LIGHT_LOGO} ctaHref={site.ctaNav.href} ctaLabel={site.ctaNav.label} />
      </div>
    </NavFrame>
  );
}
