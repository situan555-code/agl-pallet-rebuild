import Image from "next/image";
import { cn } from "@/lib/utils";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

export function CardMedia({
  numeral,
  alt = "",
  className,
  imageClassName,
  src,
}: {
  numeral?: string;
  alt?: string;
  className?: string;
  /** Extra classes on the next/image (e.g. object-bottom for a lower crop). */
  imageClassName?: string;
  src?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {src ? (
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            quality={60}
            sizes="(min-width: 980px) 40vw, calc(100vw - 48px)"
            className={cn("object-cover", imageClassName)}
          />
        </div>
      ) : (
        <PhotoPlaceholder alt={alt} />
      )}
      {numeral ? (
        <span aria-hidden="true" className="absolute left-5 top-5 font-display text-display-numeral text-moss">
          {numeral}
        </span>
      ) : null}
    </div>
  );
}
