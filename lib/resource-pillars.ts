import gma from "@/content/resources/pillars/gma-pallets-and-grades.json";
import ispm from "@/content/resources/pillars/heat-treated-pallets-ispm-15.json";
import { getHubPillar, type ResourcePillar } from "@/lib/resources";

// Full guides, keyed by hub slug. A hub pillar missing here renders the
// Wave 0 soft stub. Title and direct answer live in hub.json so the hub
// teaser and the guide never disagree.
const GUIDES: Record<string, Omit<ResourcePillar, "title" | "directAnswer">> = {
  [gma.slug]: gma,
  [ispm.slug]: ispm,
};

// Slugs served by their own route folder under app/resources/.
export const DEDICATED_ROUTES = ["glossary"];

export function getGuide(slug: string): ResourcePillar | undefined {
  const guide = GUIDES[slug];
  const hubPillar = getHubPillar(slug);
  if (!guide || !hubPillar) return undefined;
  return { ...guide, title: hubPillar.title, directAnswer: hubPillar.directAnswer };
}
