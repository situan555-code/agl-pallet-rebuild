"use client";

// Mobile menu trigger. The Sheet itself (components/MobileNavSheet.tsx) is
// imported on first tap so Radix Dialog + Accordion are not part of the
// first-paint bundle on every page (LCP gate). The trigger is a plain SSR
// button; focus returns to it when the sheet closes (Radix Dialog default).
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HamburgerIcon } from "@/components/icons";

type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; overviewLabel?: string; children?: NavChild[] };

const MobileNavSheet = dynamic(() => import("@/components/MobileNavSheet"), { ssr: false });

export function MobileNav(props: {
  navItems: NavItem[];
  logo: { src: string; width: number; height: number; alt: string };
  ctaHref: string;
  ctaLabel: string;
}) {
  const [requested, setRequested] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="rounded-sm text-white nav:hidden focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
      >
        <HamburgerIcon className="h-7 w-7" />
      </button>
      {requested && <MobileNavSheet open={open} onOpenChange={setOpen} {...props} />}
    </>
  );
}
