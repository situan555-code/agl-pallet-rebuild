"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { CardMedia } from "@/components/CardMedia";

type InsetRevealGroupValue = {
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
};

const InsetRevealGroupContext = createContext<InsetRevealGroupValue | null>(null);

export function InsetRevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    const fromHash = window.location.hash.replace(/^#/, "");
    if (fromHash) setOpenKey(fromHash);
  }, []);

  return (
    <InsetRevealGroupContext.Provider value={{ openKey, setOpenKey }}>
      <div className={className}>{children}</div>
    </InsetRevealGroupContext.Provider>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  const classes =
    "inline-flex items-center rounded-input text-body font-semibold text-ice underline-offset-[6px] hover:underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice";
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    return (
      <Link href={href} prefetch={false} className={classes}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {label}
    </a>
  );
}

export function InsetReveal({
  id,
  numeral,
  heading,
  headingAs: Heading = "h2",
  body,
  href,
  actionLabel,
  image,
}: {
  id?: string;
  numeral?: string;
  heading: string;
  headingAs?: "h2" | "h3";
  body?: string;
  href: string;
  actionLabel: string;
  image?: string;
}) {
  const group = useContext(InsetRevealGroupContext);
  const [localOpen, setLocalOpen] = useState(false);
  const reactId = useId();
  const key = id ?? reactId;
  const panelId = `${reactId}-well`;
  const open = group ? group.openKey === key : localOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (group) group.setOpenKey(next ? key : null);
      else setLocalOpen(next);
    },
    [group, key]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <article
      id={id}
      data-inset-reveal={open ? "open" : "closed"}
      className={cn(
        "group flex h-full flex-col text-bone",
        open
          ? "rounded-section bg-moss"
          : "hover-lift overflow-hidden rounded-card border border-smoke bg-green hover:border-ice"
      )}
    >
      <CardMedia src={image} numeral={numeral} className={open ? "rounded-t-[28px]" : undefined} />
      <div className={cn("flex flex-1 flex-col", open ? "p-3" : "p-6 nav:p-8")}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className="flex w-full items-start gap-3 rounded-input text-left focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
        >
          <Heading className="min-w-0 flex-1 text-[22px] font-semibold leading-snug text-pretty text-bone">
            {heading}
          </Heading>
          <ChevronDown
            aria-hidden
            className={cn(
              "mt-1 size-5 shrink-0 text-ice motion-safe:transition-transform motion-safe:duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        <div
          id={panelId}
          role="region"
          className={cn(
            open && "mt-4 rounded-[18px] border-l-2 border-ice bg-green px-6 py-6 nav:px-8"
          )}
        >
          {body ? (
            <p className="mt-5 max-w-[70ch] text-body text-bone/85 first:mt-0">{body}</p>
          ) : null}
          <div className={cn(open ? "mt-6" : "mt-8")}>
            {open ? (
              <Button href={href} label={actionLabel} variant="primary" />
            ) : (
              <ActionLink href={href} label={actionLabel} />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
