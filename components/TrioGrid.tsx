import Link from "next/link";
import { Button } from "@/components/Button";

type TrioCard = {
  eyebrow?: string;
  heading: string;
  body: string;
  href?: string;
  cta?: { label: string; href: string };
};

export function TrioGrid({ cards }: { cards: TrioCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 min-[721px]:grid-cols-2 nav:grid-cols-3">
      {cards.map((card) => {
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
          <Link key={card.heading} href={card.href} prefetch={false} className={cardClass}>
            {content}
          </Link>
        ) : (
          <div key={card.heading} className={cardClass}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
