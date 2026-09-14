import Link from "next/link";

export function MobileNav({
  navItems,
  ctaHref,
  ctaLabel,
  isOpen,
  onNavigate,
}: {
  navItems: { label: string; href: string }[];
  ctaHref: string;
  ctaLabel: string;
  isOpen: boolean;
  onNavigate: () => void;
}) {
  if (!isOpen) return null;

  return (
    <nav className="fixed inset-x-0 top-[82px] bottom-0 z-40 overflow-y-auto bg-brand-green nav:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          prefetch={false}
          onClick={onNavigate}
          className="block border-t border-white/20 px-6 py-4 text-nav-link font-semibold text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          {item.label}
        </Link>
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
