import { cn } from "@/lib/utils";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

export function CardMedia({
  numeral,
  alt = "",
  className,
}: {
  numeral?: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <PhotoPlaceholder alt={alt} />
      {numeral ? (
        <span aria-hidden="true" className="absolute left-5 top-5 font-display text-display-numeral text-moss">
          {numeral}
        </span>
      ) : null}
    </div>
  );
}
