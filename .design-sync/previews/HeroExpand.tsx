import { HeroExpand } from "agl-pallet";

export const Home = () => (
  <div className="bg-moss pb-12 text-bone">
    <HeroExpand
      heading="Never one mill between you and your line."
      description="AGL Pallet sources new, custom, and engineered pallets from a network of family-run mills across the Midwest and Mid-Atlantic — and manages the freight on every order. Same-day quotes. No minimums. More than one qualified source on every spec we sell."
      video={{ src: "/assets/agl_home_video.mp4", poster: "/assets/agl_home_video_poster.jpg" }}
      buttons={[
        { label: "Request a quote", href: "/request-a-quote/" },
        { label: "Supply pallets to AGL", href: "/partners/suppliers/" },
        { label: "Haul for AGL", href: "/partners/carriers/" },
      ]}
    />
  </div>
);

export const SingleCtaOnLight = () => (
  <div className="surface-light bg-bone pb-12 text-moss">
    <HeroExpand
      heading="One number for the spec, the pallets, and the truck."
      description="We qualify the shops that supply them well, hold more than one source for every spec we quote, and book the freight so the pallets land when your line needs them."
      video={{ src: "/assets/agl_home_video.mp4", poster: "/assets/agl_home_video_poster.jpg" }}
      buttons={[{ label: "Request a quote", href: "/request-a-quote/" }]}
    />
  </div>
);
