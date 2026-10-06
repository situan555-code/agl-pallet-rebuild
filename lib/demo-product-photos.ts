/**
 * Product-line cards. Stock pallets keep existing AGL site photography.
 * Custom & engineered uses an AGL technical pallet blueprint (no stock photo).
 * Crates, dunnage, shipping blocks, and stakes use AGL stock photography.
 * agl-crates-01 shows a crate with internal dunnage bracing; used for dunnage slot.
 * agl-crates-03 is the primary crates image (brighter than agl-crates-02).
 */
export const DEMO_PRODUCT_PHOTOS: Partial<Record<string, string>> = {
  "stock-pallets": "/assets/product_page-stock_pallets_sidepic-1.jpg",
  "custom-engineered": "/assets/stock/agl-pallet-blueprint-01_a87e.webp",
  crates: "/assets/stock/agl-crates-03_1540.webp",
  dunnage: "/assets/stock/agl-crates-01_4b0f.webp",
  "shipping-blocks": "/assets/stock/agl-shipping-blocks-01_285c.webp",
  stakes: "/assets/stock/agl-stakes-01_ff0a.webp",
};
