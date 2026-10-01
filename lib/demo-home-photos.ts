/**
 * AGL site photography for the eight cream Photo cards on the home page.
 * Order matches the cards in content/pages/home.json.
 * The same AGL photo may be reused across cards.
 */
export const DEMO_HOME_PHOTOS = {
  capabilities: [
    "/assets/home_about_photo.jpg",
    "/assets/home_header_image.jpg",
    "/assets/product_page-engineered_pallet_solutions_sidepic-1.jpg",
  ],
  differentiators: [
    "/assets/agl_home_video_poster.jpg",
    "/assets/home_header_image.jpg",
    "/assets/about_page-single_point_sidepic.jpg",
  ],
  partners: [
    "/assets/about_page-single_point_sidepic.jpg",
    "/assets/product_page-engineered_pallet_solutions_sidepic-1.jpg",
  ],
} as const;
