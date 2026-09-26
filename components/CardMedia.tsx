import Image from "next/image";
import { cn } from "@/lib/utils";
import { CARD_PLACEHOLDER } from "@/lib/product-images";

export function CardMedia({
  src = CARD_PLACEHOLDER,
  numeral,
  className,
}: {
  src?: string;
  numeral?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-4/3 overflow-hidden bg-smoke", className)}>
      <Image
        src={src}
        alt=""
        fill
        quality={60}
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 360px"
        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
      />
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
