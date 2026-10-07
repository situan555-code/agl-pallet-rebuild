import { CardMedia } from "agl-pallet";

export const Photo = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="max-w-sm overflow-hidden rounded-card">
      <CardMedia alt="Freight on every order" src="/assets/stock/agl-freight-execute-01_0e78.webp" />
    </div>
  </div>
);

export const WithNumeral = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="max-w-sm overflow-hidden rounded-card">
      <CardMedia numeral="01" alt="Send the spec" src="/assets/stock/agl-filler-pallet-stack-02_0659.webp" />
    </div>
  </div>
);

export const PlaceholderFallback = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <div className="max-w-sm overflow-hidden rounded-card">
      <CardMedia numeral="02" alt="" />
    </div>
  </div>
);
