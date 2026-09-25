"use client";

// Trigger only. The sheet chunk loads on the first tap, not at first paint.
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "@/components/inline-icons";
import type { NavItem } from "@/components/MobileNav";

const HeaderSheet = dynamic(() => import("@/components/HeaderSheet"), { ssr: false });

export function HeaderMenu({
  nav,
  logo,
  ctaHref,
  ctaLabel,
}: {
  nav: NavItem[];
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
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray/40 bg-green text-bone hover:bg-smoke focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice xl:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
      >
        <MenuIcon className="h-4 w-4" />
      </button>
      {requested && (
        <HeaderSheet
          open={open}
          onOpenChange={setOpen}
          nav={nav}
          logo={logo}
          ctaHref={ctaHref}
          ctaLabel={ctaLabel}
        />
      )}
    </>
  );
}
