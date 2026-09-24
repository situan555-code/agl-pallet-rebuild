import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionArticle } from "@/components/resources/QuestionPage";
import { plainText } from "@/components/resources/RichText";
import { getQuestion, questionPath, questions } from "@/lib/questions";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return questions.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getQuestion(params.slug);
  if (!item) return {};
  return pageMeta(`${item.question} — AGL Pallet`, plainText(item.directAnswer), questionPath(item.slug));
}

export default function QuestionRoute({ params }: { params: { slug: string } }) {
  const item = getQuestion(params.slug);
  if (!item) notFound();
  return <QuestionArticle item={item} />;
}
