/** Existing product-line photos in public/assets. Shared by home + products. */
export const PRODUCT_IMAGES: Record<string, string> = {
  "stock-pallets": "/assets/product_page-stock_pallets_sidepic.jpg",
  "custom-engineered": "/assets/product_page-engineered_pallet_solutions_sidepic-1.jpg",
  crates: "/assets/product_page-stock_pallets_sidepic-1.jpg",
  dunnage: "/assets/product_page-stock_pallets_sidepic-1-1.jpg",
  "shipping-blocks": "/assets/about_page-single_point_sidepic.jpg",
  stakes: "/assets/why_agl_exist_sidepic.jpg",
};

export const CARD_PLACEHOLDER = "/assets/card-placeholder-field.png";

/** Hard-light documentary stills. Natural color; not a moss grade. */
export const CARD_PHOTOS = [
  "/assets/card-01-deck-boards.webp",
  "/assets/card-02-trailer-pallets.webp",
  "/assets/card-03-steel-banding.webp",
  "/assets/card-04-outdoor-stack.webp",
  "/assets/card-05-tape-stamp.webp",
  "/assets/card-06-forklift-tines.webp",
] as const;

export function cardPhoto(index: number): string {
  const n = CARD_PHOTOS.length;
  return CARD_PHOTOS[((index % n) + n) % n];
}

/** Keep a real photograph. Slats and the shared placeholder get a still. */
export function resolveCardPhoto(src: string | undefined, index: number): string {
  if (src && src !== CARD_PLACEHOLDER) return src;
  return cardPhoto(index);
}
