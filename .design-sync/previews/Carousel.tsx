import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "agl-pallet";

const IMG = "https://nx7k-lab-m4.vercel.app";
const items = [
  { title: "Stock Pallets", description: "48×40 GMA and recurring-volume specs from more than one qualified mill.", src: "/assets/stock/agl-filler-pallet-stack-02_0659.webp" },
  { title: "Custom & Engineered", description: "Any footprint, any deck pattern — built to your load, racking, and dock.", src: "/assets/stock/agl-pallet-blueprint-01_a87e.webp" },
  { title: "Crates", description: "Export and heavy-equipment crating sourced alongside the pallet order.", src: "/assets/stock/agl-crates-01_4b0f.webp" },
  { title: "Shipping Blocks", description: "Blocks and dunnage cut to spec for blocking and bracing.", src: "/assets/stock/agl-shipping-blocks-01_285c.webp" },
  { title: "Stakes", description: "Survey and landscape stakes from the same mill network.", src: "/assets/stock/agl-stakes-01_ff0a.webp" },
];

// Gallery4 pattern: card track, basis 85% → 1/2 → 31%.
export const ProductCards = () => (
  <div className="bg-moss px-16 py-12 text-bone">
    <Carousel opts={{ align: "start", loop: false }} className="w-full">
      <CarouselContent className="-ml-4">
        {items.map((item) => (
          <CarouselItem key={item.title} className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-[31%]">
            <div className="flex h-full flex-col overflow-hidden rounded-card border border-current/15 bg-smoke">
              <img src={IMG + item.src} alt={item.title} className="aspect-4/3 w-full object-cover" />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[22px] font-semibold leading-snug text-current">{item.title}</h3>
                <p className="mt-5 text-body text-current/75">{item.description}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

export const SingleSlideOnLight = () => (
  <div className="surface-light bg-bone px-16 py-12 text-moss">
    <Carousel opts={{ align: "start" }} className="mx-auto max-w-2xl">
      <CarouselContent>
        {[
          ["You hear it from us first", "Proactive updates, not status requests. If a load slips, the call comes from us with the fix already in motion."],
          ["More than one mill per spec", "Every spec we sell has multiple qualified shops behind it. No single point of failure."],
          ["We've run the floor", "AGL was started by people who bought pallets for production lines."],
        ].map(([title, body], i) => (
          <CarouselItem key={title}>
            <div className="rounded-card border border-current/15 p-10">
              <p className="text-eyebrow font-semibold uppercase tracking-wide text-current/70">0{i + 1}</p>
              <h3 className="mt-3 text-[22px] font-semibold leading-snug">{title}</h3>
              <p className="mt-4 text-body text-current/80">{body}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);
