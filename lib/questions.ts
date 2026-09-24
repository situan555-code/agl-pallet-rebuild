import data from "@/content/resources/questions.json";
import { plainText } from "@/components/resources/RichText";
import { getHubPillar, type ResourceSource, type ResourceTable } from "@/lib/resources";

export const QUESTIONS_PATH = "/resources/questions/";

export interface QuestionCallout {
  label: string;
  text: string;
}

export interface QuestionPanel {
  id: string;
  title: string;
  support?: string;
  capacity?: string;
  forklift?: string;
  jack?: string;
  how?: string;
}

export interface QuestionAsset {
  id: string;
  heading: string;
  lead: string;
  note?: string;
  table?: ResourceTable;
  callouts?: QuestionCallout[];
  panels?: QuestionPanel[];
  exampleMark?: { facility: string; treatment: string };
  labels?: { forklift: string; jack: string; how: string };
}

export interface QuestionItem {
  slug: string;
  question: string;
  eyebrow: string;
  summary: string;
  parentSlug: string;
  directAnswer: string;
  published: string;
  updated: string;
  asset: QuestionAsset;
  sources: ResourceSource[];
  related: string[];
}

const ASSET_IDS = new Set([
  "ht-stamp",
  "domestic-decision",
  "grade-criteria",
  "weight-preset",
  "support-diagram",
  "height-diagram",
  "trailer-53",
  "container-40",
  "empty-truckload",
  "boxes-preset",
  "entry-diagram",
  "ownership-table",
  "iso-disagree",
]);

const TABLE_ASSETS = new Set(["domestic-decision", "grade-criteria", "ownership-table", "iso-disagree"]);

export function questionPath(slug: string) {
  return `${QUESTIONS_PATH}${slug}/`;
}

export function directAnswerWordCount(text: string) {
  return plainText(text).trim().split(/\s+/).filter(Boolean).length;
}

function validate(items: QuestionItem[]) {
  const slugs = new Set(items.map((item) => item.slug));
  for (const item of items) {
    const count = directAnswerWordCount(item.directAnswer);
    if (count < 40 || count > 60) {
      throw new Error(`${item.slug} direct answer is ${count} words; need 40–60`);
    }
    const parentHref = `/resources/${item.parentSlug}/`;
    if (!item.directAnswer.includes(parentHref)) {
      throw new Error(`${item.slug} direct answer does not link to ${parentHref}`);
    }
    if (!getHubPillar(item.parentSlug)) {
      throw new Error(`${item.slug} parent ${item.parentSlug} is not a hub guide`);
    }
    if (item.related.length < 1 || item.related.length > 4) {
      throw new Error(`${item.slug} has ${item.related.length} related links; max is 4`);
    }
    for (const rel of item.related) {
      if (!slugs.has(rel) || rel === item.slug) {
        throw new Error(`${item.slug} related slug ${rel} is invalid`);
      }
    }
    if (!ASSET_IDS.has(item.asset.id)) {
      throw new Error(`${item.slug} unknown asset ${item.asset.id}`);
    }
    if (TABLE_ASSETS.has(item.asset.id) && !item.asset.table) {
      throw new Error(`${item.slug} is missing its table`);
    }
  }
}

export const questionCrumbs = data.crumbs;
export const questionIndex = data.index;
export const questions = data.items as QuestionItem[];

validate(questions);

export function getQuestion(slug: string) {
  return questions.find((item) => item.slug === slug);
}
