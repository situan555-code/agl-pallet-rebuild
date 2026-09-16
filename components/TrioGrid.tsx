import Link from "next/link";
import { Button } from "@/components/Button";

type TrioCard = {
  eyebrow?: string;
  heading: string;
  body: string;
  href?: string;
  cta?: { label: string; href: string };
};

function BoxedCard({ card }: { card: TrioCard }) {
  const content = (
    <>
      {card.eyebrow && (
        <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">
          {card.eyebrow}
        </p>
      )}
      <h3 className={`text-step-lg text-brand-green ${card.eyebrow ? "mt-3" : ""}`}>
        {card.heading}
      </h3>
      <p className="mt-3 text-body text-ink">{card.body}</p>
      {card.cta && (
        <div className="mt-5">
          <Button href={card.cta.href} label={card.cta.label} variant="ghost-dark" />
        </div>
      )}
    </>
  );

  const cardClass =
    "block h-full rounded-2xl border border-brand-green/15 bg-white p-8 shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

  return card.href ? (
    <Link href={card.href} prefetch={false} className={cardClass}>
      {content}
    </Link>
  ) : (
    <div className={cardClass}>{content}</div>
  );
}

function ProofCard({ card }: { card: TrioCard }) {
  return (
    <article className="h-full rounded-sm border-t-[3px] border-brand-green bg-white p-10">
      {card.eyebrow && (
        <p className="font-display text-display-numeral uppercase text-brand-green">{card.eyebrow}</p>
      )}
      <h3 className={`text-step-lg text-brand-green ${card.eyebrow ? "mt-6" : ""}`}>
        {card.heading}
      </h3>
      <p className="mt-3 text-body text-ink/55">{card.body}</p>
      {card.cta && (
        <div className="mt-5">
          <Button href={card.cta.href} label={card.cta.label} variant="ghost-dark" />
        </div>
      )}
    </article>
  );
}

export function TrioGrid({
  cards,
  variant = "boxed",
}: {
  cards: TrioCard[];
  variant?: "boxed" | "proof";
}) {
  if (variant === "proof") {
    return (
      <div className="grid grid-cols-1 gap-8 min-[721px]:grid-cols-2 nav:grid-cols-3">
        {cards.map((card) => (
          <ProofCard key={card.heading} card={card} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 min-[721px]:grid-cols-2 nav:grid-cols-3">
      {cards.map((card) => (
        <BoxedCard key={card.heading} card={card} />
      ))}
    </div>
  );
}
