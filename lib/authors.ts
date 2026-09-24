import authors from "@/content/resources/authors.json";
import { isPlaceholder } from "@/lib/placeholders";

type PersonFields = {
  name: string;
  role: string;
  credential?: string;
};

export type RealArticlePeople = {
  author: { name: string; role: string };
  reviewer: { name: string; credential: string };
  lastReviewed: string;
};

function personReady(person: PersonFields, credentialKey: "role" | "credential"): boolean {
  const credential = credentialKey === "role" ? person.role : person.credential ?? "";
  return !isPlaceholder(person.name) && !isPlaceholder(credential);
}

/**
 * Real names only. Placeholder tokens in authors.json stay in the file and
 * never become a byline or JSON-LD field.
 */
export function realArticlePeople(): RealArticlePeople | null {
  const { author, reviewer, lastReviewed } = authors;
  if (!personReady(author, "role")) return null;
  if (!personReady(reviewer, "credential")) return null;
  if (isPlaceholder(lastReviewed)) return null;
  return {
    author: { name: author.name.trim(), role: author.role.trim() },
    reviewer: { name: reviewer.name.trim(), credential: (reviewer.credential ?? "").trim() },
    lastReviewed: lastReviewed.trim(),
  };
}

export function articlePeopleJsonLd(): {
  author?: { "@type": "Person"; name: string; jobTitle: string };
  reviewedBy?: { "@type": "Person"; name: string; jobTitle: string };
} {
  const people = realArticlePeople();
  if (!people) return {};
  return {
    author: { "@type": "Person", name: people.author.name, jobTitle: people.author.role },
    reviewedBy: { "@type": "Person", name: people.reviewer.name, jobTitle: people.reviewer.credential },
  };
}
