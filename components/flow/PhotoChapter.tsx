import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Full-width photographic chapter. Moss fades 180px at each edge so the
 * photo joins the page ground without a hard line. Decorative: these are
 * the same unlabeled pallet photos that used to sit in side columns.
 */
export function PhotoChapter({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <figure aria-hidden={alt === "" ? true : undefined} className={cn("photo-chapter", className)}>
      <Image src={src} alt={alt} fill quality={60} sizes="100vw" className="object-cover" />
      <span aria-hidden="true" className="photo-chapter-fade photo-chapter-fade-top" />
      <span aria-hidden="true" className="photo-chapter-fade photo-chapter-fade-bottom" />
    </figure>
  );
}
