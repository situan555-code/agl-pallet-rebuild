import { containerClass } from "@/components/Container";
import { CardMedia } from "@/components/CardMedia";
import { InteractiveCard } from "@/components/InteractiveCard";
import { resolveCardPhoto } from "@/lib/product-images";
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
  items: { id: string; title: string; description: string; href: string; image?: string }[];
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <InteractiveCard key={item.id} id={item.id} href={item.href}>
              <CardMedia src={resolveCardPhoto(item.image, index)} alt={item.title} />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[22px] font-semibold leading-snug text-current">{item.title}</h3>
                <p className="mt-5 text-body text-current/75">{item.description}</p>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </section>
  );
}
