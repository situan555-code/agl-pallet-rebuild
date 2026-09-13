import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";

export function IndustryCardGrid({
  eyebrow,
  heading,
  cards,
  theme,
}: {
  eyebrow: string;
  heading: string;
  cards: { icon?: string; heading: string; body: string; cta?: { label: string; href: string } }[];
  theme: "light" | "dark";
}) {
  return (
    <section
      className={`px-6 py-[85px] nav:py-[130px] ${theme === "dark" ? "bg-brand-green text-white" : "bg-white"}`}
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading eyebrow={eyebrow} heading={heading} align="center" theme={theme} />
        <div className="mt-12 nav:mt-16 grid gap-10 nav:gap-14 nav:grid-cols-3">
          {cards.map((card) => (
            <FadeIn
              key={card.heading}
              className={`nav:rounded-2xl nav:border nav:p-10 ${
                theme === "dark" ? "nav:border-white/15" : "nav:border-brand-green/15"
              }`}
            >
              {card.icon && <Image src={card.icon} alt="" width={72} height={72} />}
              <h3
                className={`mt-4 nav:mt-6 text-step-sm ${theme === "dark" ? "text-white" : "text-brand-green"}`}
              >
                {card.heading}
              </h3>
              <p className={`mt-2 nav:mt-4 text-body ${theme === "dark" ? "text-white/80" : "text-ink"}`}>
                {card.body}
              </p>
              {card.cta && (
                <div className="mt-6">
                  <Button
                    href={card.cta.href}
                    label={card.cta.label}
                    variant={theme === "dark" ? "pill-light" : "pill-dark"}
                  />
                </div>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
