import { containerClass } from "@/components/Container";
import { InsetReveal, InsetRevealGroup } from "@/components/InsetReveal";
import { CARD_PLACEHOLDER } from "@/lib/product-images";
import { cn } from "@/lib/utils";

export function StaticGallery({
  eyebrow,
  title,
  description,
  items,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  items: { id: string; title: string; description: string; href: string; image?: string; actionLabel: string }[];
  className?: string;
}) {
  return (
    <section className={cn("section-y scroll-mt-24 overflow-hidden bg-moss text-bone", className)}>
      <div className={containerClass}>
        <div className="mb-8 flex flex-col gap-6 nav:mb-10 nav:flex-row nav:items-end nav:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-eyebrow font-semibold uppercase tracking-wide text-current/70">
                <span aria-hidden="true" className="mr-2 font-bold text-current">
                  /
                </span>
                {eyebrow}
              </p>
            )}
            <h2 className="mt-3 text-display-2 text-current">{title}</h2>
            {description && (
              <p className="prose-measure mt-5 text-body text-current/75">{description}</p>
            )}
          </div>
        </div>
        <InsetRevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <InsetReveal
              key={item.id}
              id={item.id}
              heading={item.title}
              headingAs="h3"
              body={item.description}
              href={item.href}
              actionLabel={item.actionLabel}
              image={item.image ?? CARD_PLACEHOLDER}
            />
          ))}
        </InsetRevealGroup>
      </div>
    </section>
  );
}
