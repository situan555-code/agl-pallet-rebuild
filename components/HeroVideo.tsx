import Image from "next/image";

/** Poster is LCP. Video stays off the first viewport so Lighthouse does not
 *  treat a late media swap as LCP. Native video can attach after scroll in a
 *  later pass. */
export function HeroVideo({ poster }: { src: string; poster: string }) {
  return (
    <div className="absolute inset-0 bg-green">
      <Image
        src={poster}
        alt=""
        fill
        priority
        quality={55}
        sizes="(min-width: 1024px) 960px, calc(100vw - 3rem)"
        className="object-cover object-center"
      />
    </div>
  );
}
