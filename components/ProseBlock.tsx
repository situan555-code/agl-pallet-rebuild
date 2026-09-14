import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";

export function ProseBlock({
  eyebrow,
  heading,
  paragraphs,
  cta,
  ctaVariant = "ghost-dark",
}: {
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  cta?: { label: string; href: string };
  ctaVariant?: "ghost-light" | "ghost-dark";
}) {
  return (
    <div>
      <SectionHeading eyebrow={eyebrow} heading={heading} />
      <div className="prose-measure mt-6 space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-body">
            {p}
          </p>
        ))}
      </div>
      {cta && (
        <div className="mt-6">
          <Button href={cta.href} label={cta.label} variant={ctaVariant} />
        </div>
      )}
    </div>
  );
}
