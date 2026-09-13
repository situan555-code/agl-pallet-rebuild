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
    <nav className="w-full bg-brand-green nav:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          prefetch={false}
          onClick={onNavigate}
          className="block border-t border-white/20 px-6 py-4 text-nav-link font-semibold text-white"
        >
          {item.label}
        </Link>
      ))}
      <Link
        href={ctaHref}
        prefetch={false}
        onClick={onNavigate}
        className="block border-t border-white/20 px-6 py-4 text-nav-link font-semibold text-white"
      >
        {ctaLabel}
      </Link>
    </nav>
  );
}
