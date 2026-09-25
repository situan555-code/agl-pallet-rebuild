"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SearchDialog = dynamic(() => import("@/components/SearchDialog").then((m) => m.SearchDialog), {
  ssr: false,
});

export function SearchTrigger({ className }: { className?: string }) {
  const [requested, setRequested] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setRequested(true);
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label="Search"
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
      >
        Search
        <kbd className="ml-2 hidden rounded-input border border-gray/40 px-1 text-[10px] text-gray nav:inline">⌘K</kbd>
      </button>
      {requested ? <SearchDialog open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
