import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { getBlurDataURL } from "@/lib/blur";

export type OpenerVariant = "light-image" | "light-text" | "inset-dark";

export function PageOpener({
  variant,
  eyebrow,
  heading,
  description,
  cta,
  image,
  breadcrumb,
}: {
  variant: OpenerVariant;
  eyebrow?: string;
  heading: string;
  description?: string | string[];
  cta?: { label: string; href: string };
  image?: { src: string; alt: string };
  breadcrumb?: { name: string; href?: string }[];
}) {
  const paragraphs = description ? (Array.isArray(description) ? description : [description]) : [];
  const dark = variant === "inset-dark";
  const blur = image ? getBlurDataURL(image.src) : undefined;

  return (
    <section
      className={cn(
        "scroll-mt-24 px-6 pb-16 pt-36",
        variant === "light-image" && "surface-light bg-bone text-moss",
        variant === "light-text" && "surface-light bg-bone text-moss",
        variant === "inset-dark" && "bg-moss px-4 pt-28"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-[1440px]",
          dark && "rounded-section bg-green px-6 py-16 text-bone nav:px-10"
        )}
      >
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className={cn("flex flex-wrap items-center gap-2 text-link", dark ? "text-bone/75" : "text-moss/70")}>
              {breadcrumb.map((item, i) => (
                <li key={`${item.name}-${i}`} className="contents">
                  {i > 0 && <span aria-hidden>/</span>}
                  {item.href && i < breadcrumb.length - 1 ? (
                    <Link href={item.href} prefetch={false} className="hover:underline">
                      {item.name}
                    </Link>
                  ) : (
                    <span aria-current={i === breadcrumb.length - 1 ? "page" : undefined}>{item.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className={cn(image && variant === "light-image" && "grid gap-10 nav:grid-cols-12")}>
          <div className={cn(image && "nav:col-span-6")}>
            {eyebrow && (
              <p className="text-eyebrow font-semibold uppercase tracking-wide">
                <span aria-hidden className="mr-2 font-bold">
                  /
                </span>
                {eyebrow}
              </p>
            )}
            <h1 className={cn("mt-4 max-w-[760px] text-display-1", dark && "display")}>{heading}</h1>
            <div className="prose-measure mt-6 space-y-4">
              {paragraphs.map((p) => (
                <p key={p} className="text-body">
                  {p}
                </p>
              ))}
            </div>
            {cta ? (
              <div className="mt-8">
                <Button href={cta.href} label={cta.label} variant="secondary" />
              </div>
            ) : null}
          </div>
          {image && variant === "light-image" ? (
            <div className="relative aspect-4/5 overflow-hidden rounded-card nav:col-span-5 nav:col-start-8">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                placeholder={blur ? "blur" : undefined}
                blurDataURL={blur}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
