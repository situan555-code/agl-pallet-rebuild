import { realArticlePeople } from "@/lib/authors";
import { formatDate } from "@/lib/resources";

/** Brokerage-desk line while authors.json is still placeholders. */
export function Byline({ updated }: { updated: string }) {
  const people = realArticlePeople();
  if (!people) {
    return (
      <p className="mt-6 text-link text-bone/75">
        Published by the AGL Pallet brokerage desk · Updated <time dateTime={updated}>{formatDate(updated)}</time>
      </p>
    );
  }
  return (
    <p className="mt-6 text-link text-bone/75">
      Written by {people.author.name}, {people.author.role}
      {" · "}
      Reviewed by {people.reviewer.name}, {people.reviewer.credential}
      {" · "}
      Last reviewed <time dateTime={people.lastReviewed}>{formatDate(people.lastReviewed)}</time>
    </p>
  );
}
