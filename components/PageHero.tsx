import { Button } from "@/components/Button";

export function PageHero({
  eyebrow,
  heading,
  body,
  cta,
}: {
  eyebrow: string;
  heading: string;
  body?: string | string[];
  cta?: { label: string; href: string };
}) {
  const paragraphs = body ? (Array.isArray(body) ? body : [body]) : [];
  return (
    <section className="scroll-mt-24 bg-brand-green px-6 pb-16 pt-36 text-center text-white">
      <div className="mx-auto max-w-[800px]">
        <p className="text-eyebrow font-semibold uppercase tracking-wide">
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          {eyebrow}
        </p>
        <h1 className="mt-4 text-display-1">{heading}</h1>
        {paragraphs.map((p, i) => (
          <p key={i} className="mx-auto mt-6 max-w-2xl text-body">
            {p}
          </p>
        ))}
        {cta && (
          <div className="mt-8 flex justify-center">
            <Button href={cta.href} label={cta.label} variant="pill-light" />
          </div>
        )}
      </div>
    </section>
  );
}
