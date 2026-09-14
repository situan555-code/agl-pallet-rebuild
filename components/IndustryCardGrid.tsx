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
      className={`section-y px-6 ${theme === "dark" ? "bg-brand-green text-white" : "bg-white"}`}
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading eyebrow={eyebrow} heading={heading} align="center" theme={theme} />
        <div className="mt-10 grid gap-6 nav:mt-16 nav:grid-cols-3 nav:gap-8">
          {cards.map((card) => (
            <FadeIn
              key={card.heading}
              className={`flex h-full flex-col rounded-xl border p-5 transition-shadow hover:shadow-md nav:rounded-2xl nav:p-10 ${
                theme === "dark"
                  ? "border-white/15 bg-white/5 shadow-sm"
                  : "border-brand-green/15 bg-white shadow-sm"
              }`}
            >
              {card.icon && (
                <Image
                  src={card.icon}
                  alt=""
                  width={96}
                  height={96}
                  className="h-[72px] w-[72px] shrink-0 nav:h-24 nav:w-24"
                />
              )}
              <h3
                className={`mt-3 text-step-sm nav:mt-6 ${theme === "dark" ? "text-white" : "text-brand-green"}`}
              >
                {card.heading}
              </h3>
              <p
                className={`mt-2 flex-1 text-body nav:mt-4 ${theme === "dark" ? "text-white/80" : "text-ink"}`}
              >
                {card.body}
              </p>
              {card.cta && (
                <div className="mt-5 nav:mt-6">
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
