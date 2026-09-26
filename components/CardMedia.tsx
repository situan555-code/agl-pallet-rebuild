import { DeferredCardImage } from "@/components/DeferredCardImage";
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
      <DeferredCardImage src={src} />
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
