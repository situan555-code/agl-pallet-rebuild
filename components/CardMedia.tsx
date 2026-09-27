import Image from "next/image";
import { cn } from "@/lib/utils";
import { CARD_PLACEHOLDER } from "@/lib/product-images";

export function CardMedia({
  src = CARD_PLACEHOLDER,
  alt = "",
  numeral,
  className,
}: {
  src?: string;
  alt?: string;
  numeral?: string;
  className?: string;
}) {
  const placeholder = !src || src === CARD_PLACEHOLDER;
  return (
    <div className={cn("relative aspect-4/3 overflow-hidden bg-smoke", className)}>
      {placeholder ? (
        <div className="absolute inset-0 bg-moss" aria-hidden>
          <div className="absolute inset-0 bg-green" />
          <div className="absolute inset-y-[18%] left-0 right-0 h-[6%] bg-smoke" />
          <div className="absolute inset-y-[46%] left-0 right-0 h-[6%] bg-smoke" />
          <div className="absolute inset-y-[74%] left-0 right-0 h-[6%] bg-smoke" />
          <div className="absolute bottom-0 left-[22%] top-0 w-[3%] bg-smoke" />
          <div className="absolute bottom-0 right-[22%] top-0 w-[3%] bg-smoke" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          quality={60}
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 360px"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      )}
      {numeral ? (
        <span
          aria-hidden="true"
          className="absolute left-5 top-5 font-display text-display-numeral text-ice"
        >
          {numeral}
        </span>
      ) : null}
    </div>
  );
}
