import Link from "next/link";

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

export function MobileNav({
  navItems,
  ctaHref,
  ctaLabel,
  isOpen,
  onNavigate,
}: {
  navItems: NavItem[];
  ctaHref: string;
  ctaLabel: string;
  isOpen: boolean;
  onNavigate: () => void;
}) {
  if (!isOpen) return null;

  return (
    <nav className="fixed inset-x-0 top-[82px] bottom-0 z-40 overflow-y-auto bg-brand-green nav:hidden">
      {navItems.map((item) => (
        <div key={item.href} className="border-t border-white/20">
          <Link
            href={item.href}
            prefetch={false}
            onClick={onNavigate}
            className="block px-6 py-4 text-nav-link font-semibold text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {item.label}
          </Link>
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              prefetch={false}
              onClick={onNavigate}
              className="block border-t border-white/10 px-10 py-3 text-nav-link font-semibold text-white/85 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {child.label}
            </Link>
          ))}
        </div>
      ))}
      <Link
        href={ctaHref}
        prefetch={false}
        onClick={onNavigate}
        className="block border-t border-white/20 px-6 py-4 text-nav-link font-semibold text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        {ctaLabel}
      </Link>
    </nav>
  );
}
