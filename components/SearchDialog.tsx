"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildSearchIndex, searchIndex } from "@/lib/search-index";
import { cn } from "@/lib/utils";

const INDEX = buildSearchIndex();

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.trim() ? searchIndex(query, INDEX) : INDEX.slice(0, 8)), [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-80">
      <button
        type="button"
        className="absolute inset-0 bg-moss/70"
        aria-label="Close search"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-card border border-smoke bg-green text-bone shadow-lg"
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides and glossary"
          className="w-full border-b border-smoke bg-transparent px-4 py-3 text-body text-bone outline-none placeholder:text-gray"
        />
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-4 text-sm text-gray">No matches</li>
          ) : (
            results.map((item) => (
              <li key={`${item.kind}-${item.href}-${item.title}`}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full flex-col rounded-input px-3 py-2 text-left hover:bg-smoke/70 focus-visible:bg-smoke/70"
                  )}
                  onClick={() => {
                    onOpenChange(false);
                    router.push(item.href);
                  }}
                >
                  <span className="text-eyebrow font-semibold uppercase tracking-wide text-ice">{item.kind}</span>
                  <span className="text-sm font-semibold">{item.title}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
