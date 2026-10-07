import { PhotoPlaceholder } from "agl-pallet";

export const Default = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="max-w-sm">
      <PhotoPlaceholder />
    </div>
  </div>
);

export const RoundedInArticle = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <div className="max-w-sm">
      <PhotoPlaceholder className="rounded-card" alt="Heat-treated pallets staged for an export load" />
      <p className="mt-3 text-[12px] text-current/70">Heat-treated pallets staged for an export load.</p>
    </div>
  </div>
);
