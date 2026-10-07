// design-sync shim for next/image: a plain <img> with next/image's layout
// semantics (fill -> absolutely positioned, object-fit left to className).
// Loads eagerly by default: a lazy, display:none image (the hidden logo
// variant) never loads, so its decode() never settles.
import { forwardRef, type CSSProperties, type ImgHTMLAttributes } from "react";
import { assetUrl } from "./asset-origin";

type StaticImport = { src: string; width?: number; height?: number };

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string | StaticImport;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  priority?: boolean;
  preload?: boolean;
  quality?: number | `${number}`;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  overrideSrc?: string;
  loader?: unknown;
};

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { src, fill, priority, preload, quality, placeholder, blurDataURL, unoptimized, overrideSrc, loader, style, width, height, loading, decoding, ...rest },
  ref,
) {
  const s = typeof src === "string" ? src : src.src;
  const w = width ?? (typeof src === "object" ? src.width : undefined);
  const h = height ?? (typeof src === "object" ? src.height : undefined);
  const fillStyle: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
    : undefined;
  return (
    <img
      ref={ref}
      src={assetUrl(s)}
      width={fill ? undefined : w}
      height={fill ? undefined : h}
      loading={loading ?? "eager"}
      decoding={decoding ?? "async"}
      style={{ color: "transparent", ...fillStyle, ...style }}
      {...rest}
    />
  );
});

export default Image;
