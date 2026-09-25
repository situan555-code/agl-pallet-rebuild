import Image from "next/image";

/** R0.4: poster only. Native video returns in R3.1. `src` kept so callers stay unchanged. */
export function HeroVideo({ poster }: { src: string; poster: string }) {
  return (
    <div className="absolute inset-0 bg-brand-green">
      <Image
        src={poster}
        alt=""
        fill
        priority
        quality={60}
        sizes="(min-width: 1024px) 960px, calc(100vw - 3rem)"
        className="object-cover object-center"
      />
    </div>
  );
}
