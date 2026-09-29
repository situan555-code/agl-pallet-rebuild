/**
 * DEMO-ONLY stand-ins for the eight cream Photo cards on the home page.
 * Mill photography. Replace before go-live.
 * Order matches the cards in content/pages/home.json.
 * Freight and partner carriers share the outdoor stack still (no trucks).
 */
export const DEMO_HOME_PHOTOS = {
  capabilities: [
    "/assets/demo-mill-four-way.jpg",
    "/assets/demo-mill-custom-long.jpg",
    "/assets/demo-mill-outdoor-stacks.jpg",
  ],
  differentiators: [
    "/assets/demo-mill-ht-stamped.jpg",
    "/assets/demo-mill-lumber-stacks.jpg",
    "/assets/demo-mill-forklift-aisle.jpg",
  ],
  partners: [
    "/assets/demo-mill-covered-stacks.jpg",
    "/assets/demo-mill-outdoor-stacks.jpg",
  ],
} as const;
