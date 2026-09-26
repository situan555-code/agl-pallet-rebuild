"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getHubPillar } from "@/lib/resources";

type Term = {
  id: string;
  term: string;
  definition: string;
  link?: string;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function GlossaryTerms({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () => terms.filter((t) => !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)),
    [terms, q]
  );
  const byLetter = ALPHABET.map((letter) => ({
    letter,
    terms: filtered.filter((t) => t.term[0].toUpperCase() === letter),
  }));
  const present = new Set(terms.filter((t) => t.term[0]).map((t) => t.term[0].toUpperCase()));

  return (
    <>
      <label className="mt-8 block max-w-md">
        <span className="sr-only">Filter glossary</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter terms"
          className="w-full rounded-input border border-gray bg-bone px-3 py-2 text-[16px] text-moss"
        />
      </label>

      <nav aria-label="Glossary A to Z" className="sticky top-[75px] z-10 -mx-6 mt-10 border-y border-smoke bg-moss px-6 py-3 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
        <ul className="flex flex-wrap gap-x-1 gap-y-1">
          {byLetter.map(({ letter, terms: list }) => (
            <li key={letter}>
              {present.has(letter) ? (
                list.length > 0 ? (
                  <a
                    href={`#letter-${letter}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-input text-sm font-semibold text-ice hover:bg-green"
                  >
                    {letter}
                  </a>
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center text-sm text-gray">{letter}</span>
                )
              ) : (
                <span aria-disabled className="inline-flex h-8 w-8 items-center justify-center text-sm text-smoke">
                  {letter}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
        {byLetter
          .filter((g) => g.terms.length > 0)
          .map(({ letter, terms: list }) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              aria-labelledby={`letter-${letter}-h`}
              className="scroll-mt-40 border-t border-smoke py-10 nav:grid nav:grid-cols-12 nav:gap-16"
            >
              <h2 id={`letter-${letter}-h`} className="text-display-numeral text-ice nav:col-span-3">
                {letter}
              </h2>
              <dl className="mt-6 space-y-8 nav:col-span-8 nav:col-start-5 nav:mt-0">
                {list.map((t) => (
                  <div key={t.id} id={t.id} className="scroll-mt-40">
                    <dt className="text-[20px] font-semibold leading-snug text-bone">{t.term}</dt>
                    <dd className="prose-measure mt-2 text-body text-bone/85">
                      {t.definition}
                      {t.link ? (
                        <>
                          {" "}
                          <Link
                            href={t.link}
                            prefetch={false}
                            className="font-semibold text-ice underline underline-offset-4"
                          >
                            Read the guide
                            <span className="sr-only">: {getHubPillar(t.link.split("/")[2])?.title}</span>
                          </Link>
                        </>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
      </div>
    </>
  );
}
