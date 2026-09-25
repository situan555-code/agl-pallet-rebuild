// Unique assets for question pages. Calculator figures are computed from
// content/resources/calculators.json with the same functions as the tools.
// Diagram labels come from the question JSON. Nothing here is an AGL
// weighed mean, a price, or a pool fee.
import calculators from "@/content/resources/calculators.json";
import { Disclaimer, ResultSummary } from "@/components/resources/Calculator";
import { DataTable } from "@/components/resources/ResourceArticle";
import {
  bestFloorPattern,
  boxesPerPallet,
  emptyLoad,
  fmt,
  palletWeight,
  sgAtMoisture,
  truckload,
} from "@/lib/calculators";
import type { QuestionItem, QuestionPanel } from "@/lib/questions";

const { equipment, truckload: truckConfig, disclaimer } = calculators;

function expect(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function loadedFromFloor(floorCount: number, interiorH: number) {
  const d = truckConfig.defaults;
  const levels = Math.max(0, Math.min(d.maxLevels, Math.floor(interiorH / d.loadH)));
  const bySpace = floorCount * levels;
  const byWeight = Math.floor(d.payload / d.loadWeight);
  const count = Math.min(bySpace, byWeight);
  const limitedBy = byWeight < bySpace ? "weight" : levels < d.maxLevels ? "height" : "floor space";
  return { levels, count, limitedBy, totalWeight: count * d.loadWeight };
}

function fractionIn(n: number) {
  if (Math.abs(n - 0.625) < 1e-9) return "⅝ in";
  if (Math.abs(n - 1.5) < 1e-9) return "1½ in";
  if (Math.abs(n - 3.5) < 1e-9) return "3½ in";
  return `${fmt(n, 3)} in`;
}

function WheatMark() {
  return (
    <svg viewBox="0 0 48 72" className="h-16 w-10 text-brand-green" aria-hidden="true">
      <path d="M24 66 V18" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M24 52 C14 48 10 38 14 30 C18 38 22 44 24 48" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M24 52 C34 48 38 38 34 30 C30 38 26 44 24 48" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M24 40 C16 36 12 28 16 20 C20 28 22 32 24 36" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M24 40 C32 36 36 28 32 20 C28 28 26 32 24 36" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M24 18 C20 12 22 8 24 6 C26 8 28 12 24 18" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function StampDiagram({ item }: { item: QuestionItem }) {
  const mark = item.asset.exampleMark;
  const callouts = item.asset.callouts ?? [];
  if (!mark) throw new Error(`${item.slug} is missing exampleMark`);
  return (
    <figure className="mt-6">
      <div className="max-w-xl border-2 border-brand-green p-4 sm:p-6">
        <div className="grid grid-cols-[auto_1fr] items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <WheatMark />
            <p className="max-w-32 text-center text-[12px] font-semibold uppercase tracking-wide text-eyebrow-ink">IPPC symbol</p>
          </div>
          <div className="border-l border-brand-green/30 pl-4 sm:pl-6">
            <p className="font-display text-step-lg uppercase text-brand-green">{mark.facility}</p>
            <p className="mt-1 text-[13px] text-ink/70">Country code and producer number</p>
            <p className="mt-4 font-display text-step-lg uppercase text-brand-green">{mark.treatment}</p>
            <p className="mt-1 text-[13px] text-ink/70">Treatment code</p>
          </div>
        </div>
      </div>
      <figcaption className="mt-4">
        <ol className="prose-measure list-decimal space-y-2 pl-5 text-body text-ink/85">
          {callouts.map((c) => (
            <li key={c.label} className="pl-1">
              <span className="font-semibold text-ink">{c.label}. </span>
              {c.text}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

function SupportSketch({ id }: { id: string }) {
  if (id === "static") {
    return (
      <div className="flex h-28 items-end justify-center" aria-hidden="true">
        <div className="flex flex-col items-center">
          <div className="h-8 w-20 border-2 border-brand-green" />
          <div className="h-1 w-28 bg-brand-green" />
        </div>
      </div>
    );
  }
  if (id === "dynamic") {
    return (
      <div className="flex h-28 items-end justify-center" aria-hidden="true">
        <div className="flex flex-col items-center">
          <div className="h-8 w-20 border-2 border-brand-green" />
          <div className="mt-1 flex w-24 justify-between">
            <div className="h-1.5 w-10 bg-brand-green" />
            <div className="h-1.5 w-10 bg-brand-green" />
          </div>
          <div className="mt-3 h-6 w-2 bg-brand-green/50" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-28 items-end justify-center" aria-hidden="true">
      <div className="flex flex-col items-center">
        <div className="h-8 w-24 border-2 border-brand-green" />
        <div className="flex w-24 justify-between">
          <div className="h-8 w-2 bg-brand-green" />
          <div className="h-8 w-2 bg-brand-green" />
        </div>
      </div>
    </div>
  );
}

function SupportDiagram({ item }: { item: QuestionItem }) {
  const panels = item.asset.panels ?? [];
  return (
    <figure className="mt-6">
      <div className="grid gap-8 sm:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.id} className="border-t border-brand-green/20 pt-4">
            <SupportSketch id={panel.id} />
            <h3 className="mt-4 font-display text-step-lg uppercase text-brand-green">{panel.title}</h3>
            <p className="mt-2 text-body text-ink/85">{panel.support}</p>
            <p className="mt-2 text-[14px] font-semibold text-brand-green">{panel.capacity}</p>
          </div>
        ))}
      </div>
      {item.asset.note && <figcaption className="prose-measure mt-4 text-[14px] leading-relaxed text-ink/70">{item.asset.note}</figcaption>}
    </figure>
  );
}

function HeightDiagram({ item }: { item: QuestionItem }) {
  const lines = calculators.weightEstimator.lines;
  const stringer = lines.find((line) => line.id === "a");
  const top = lines.find((line) => line.id === "b");
  const bottom = lines.find((line) => line.id === "c");
  if (!stringer || !top || !bottom) throw new Error("weight estimator example lines a/b/c are missing");
  const scale = 28;
  const total = top.thickness + stringer.width + bottom.thickness;
  const bands = [
    { label: "Top deck", detail: fractionIn(top.thickness), height: top.thickness * scale },
    { label: "Stringer", detail: fractionIn(stringer.width), height: stringer.width * scale },
    { label: "Bottom deck", detail: fractionIn(bottom.thickness), height: bottom.thickness * scale },
  ];
  return (
    <figure className="mt-6">
      <div className="grid items-start gap-8 sm:grid-cols-2">
        <div className="flex items-center gap-4">
          <div className="w-16 shrink-0" aria-hidden="true">
            {bands.map((band) => (
              <div key={band.label} style={{ height: band.height }} className="border border-brand-green bg-brand-green/10" />
            ))}
          </div>
          <p className="text-body text-ink/85">
            Example total <span className="font-semibold text-brand-green">{fmt(total, 2)} in</span>
          </p>
        </div>
        <dl className="space-y-4">
          {bands.map((band) => (
            <div key={band.label}>
              <dt className="text-[14px] font-semibold text-brand-green">
                {band.label}: {band.detail}
              </dt>
              <dd className="text-[14px] text-ink/70">
                {band.label === "Stringer"
                  ? `Example stringer ${fractionIn(stringer.thickness)} × ${fractionIn(stringer.width)}, from the estimator's example list.`
                  : "Example deckboard thickness from that same list. One layer, not a stack of boards."}
              </dd>
            </div>
          ))}
          {(item.asset.callouts ?? []).map((callout) => (
            <div key={callout.label}>
              <dt className="text-[14px] font-semibold text-ink">{callout.label}</dt>
              <dd className="text-[14px] leading-relaxed text-ink/75">{callout.text}</dd>
            </div>
          ))}
        </dl>
      </div>
      {item.asset.note && <figcaption className="prose-measure mt-4 text-[14px] leading-relaxed text-ink/70">{item.asset.note}</figcaption>}
    </figure>
  );
}

function EntryMark({ solid }: { solid: boolean }) {
  return <span className={solid ? "block h-2.5 w-2.5 bg-brand-green" : "block h-2.5 w-2.5 border-2 border-brand-green"} />;
}

function EntrySketch({ panel }: { panel: QuestionPanel }) {
  const forkAll = Boolean(panel.forklift?.startsWith("All"));
  const jackAll = Boolean(panel.jack?.startsWith("All"));
  const edges = [
    { id: "left", className: "left-0 top-1/2 -translate-y-1/2", fork: true, jack: true },
    { id: "right", className: "right-0 top-1/2 -translate-y-1/2", fork: true, jack: true },
    { id: "top", className: "left-1/2 top-0 -translate-x-1/2", fork: forkAll, jack: jackAll },
    { id: "bottom", className: "bottom-0 left-1/2 -translate-x-1/2", fork: forkAll, jack: jackAll },
  ];
  return (
    <div className="relative mx-auto h-32 w-40" aria-hidden="true">
      <div className="absolute inset-x-5 inset-y-5 border-2 border-brand-green" />
      {edges.map((edge) => (
        <span key={edge.id} className={`absolute flex gap-1 ${edge.className}`}>
          {edge.fork && <EntryMark solid />}
          {edge.jack && <EntryMark solid={false} />}
        </span>
      ))}
    </div>
  );
}

function EntryDiagram({ item }: { item: QuestionItem }) {
  const labels = item.asset.labels;
  const panels = item.asset.panels ?? [];
  if (!labels) throw new Error(`${item.slug} is missing entry labels`);
  return (
    <figure className="mt-6">
      <p className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink/70">
        <span className="inline-flex items-center gap-2">
          <span className="block h-2.5 w-2.5 bg-brand-green" aria-hidden="true" />
          {labels.forklift}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="block h-2.5 w-2.5 border-2 border-brand-green" aria-hidden="true" />
          {labels.jack}
        </span>
      </p>
      <div className="mt-6 grid gap-8 sm:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.id} className="border-t border-brand-green/20 pt-4">
            <EntrySketch panel={panel} />
            <h3 className="mt-4 font-display text-step-lg uppercase text-brand-green">{panel.title}</h3>
            <dl className="mt-3 space-y-2 text-[14px] leading-snug text-ink/85">
              <div>
                <dt className="font-semibold text-brand-green">{labels.forklift}</dt>
                <dd>{panel.forklift}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-green">{labels.jack}</dt>
                <dd>{panel.jack}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-green">{labels.how}</dt>
                <dd>{panel.how}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
      {item.asset.note && <figcaption className="prose-measure mt-4 text-[14px] leading-relaxed text-ink/70">{item.asset.note}</figcaption>}
    </figure>
  );
}

function WeightPreset() {
  const content = calculators.weightEstimator;
  const species = content.species.find((item) => item.id === content.defaults.species);
  if (!species) throw new Error("weight estimator default species is missing");
  const mc = content.defaults.mc;
  const lines = content.lines.map((line) => ({
    label: line.label,
    qty: line.qty,
    thickness: line.thickness,
    width: line.width,
    length: line.length,
  }));
  const result = palletWeight(lines, species, mc);
  expect(fmt(result.weight, 1) === "38.4", `weight preset drifted to ${fmt(result.weight, 1)}`);
  const planning = truckConfig.defaults;
  return (
    <div className="mt-6">
      <ResultSummary
        label="Estimated pallet weight"
        value={`${fmt(result.weight, 1)} lb`}
        detail={
          <p>
            {fmt(result.volumeFt3, 2)} ft³ of wood at {fmt(result.density, 1)} lb/ft³ for {species.label.toLowerCase()} at {fmt(mc)}%
            moisture. An estimate, not a measured weight, and not an AGL weighed mean. Shared planning default: height {planning.palletH} in
            and weight {planning.palletWeight} lb. This estimate can differ from that default.
          </p>
        }
      />
      <DataTable
        table={{
          caption: "Example board list, by component",
          columns: ["Component", "Quantity", "Size (in)", "Weight (lb)"],
          rows: [
            ...result.rows.map((row) => [
              row.label,
              fmt(row.qty),
              `${fmt(row.thickness, 3)} × ${fmt(row.width, 2)} × ${fmt(row.length, 1)}`,
              fmt(row.weight, 1),
            ]),
            ["Total", "", "", fmt(result.weight, 1)],
          ],
          note: `Specific gravity used: ${fmt(sgAtMoisture(species, mc), 3)}. ${content.speciesNote} The board list is an example, not a GMA or customer specification.`,
        }}
      />
      <Disclaimer text={disclaimer} />
    </div>
  );
}

function Trailer53Preset() {
  const eq = equipment.find((item) => item.id === "van53");
  if (!eq) throw new Error("53 ft dry van preset is missing");
  const d = truckConfig.defaults;
  const straightRows = Math.floor(eq.length / d.palletL);
  const straightAcross = Math.floor(eq.width / d.palletW);
  const turnedRows = Math.floor(eq.length / d.palletW);
  const turnedAcross = Math.floor(eq.width / d.palletL);
  const straight = loadedFromFloor(straightRows * straightAcross, eq.height);
  const turned = loadedFromFloor(turnedRows * turnedAcross, eq.height);
  expect(straight.count === 26 && turned.count === 30, `53 ft preset drifted to ${straight.count}/${turned.count}`);
  return (
    <div className="mt-6">
      <div className="grid gap-8 sm:grid-cols-2">
        <ResultSummary
          label="Loaded straight"
          value={fmt(straight.count)}
          detail={<p>{straightRows} rows straight, {straightAcross} across. Limited by {straight.limitedBy}. Example total {fmt(straight.totalWeight)} lb.</p>}
        />
        <ResultSummary
          label="Loaded turned"
          value={fmt(turned.count)}
          detail={<p>{turnedRows} rows turned, {turnedAcross} across. Limited by {turned.limitedBy}. Example total {fmt(turned.totalWeight)} lb.</p>}
        />
      </div>
      <DataTable
        table={{
          caption: "53 ft dry van preset, single-stacked 48 × 40",
          columns: ["Loading", "Pattern", "Loaded count", "Limited by", "Example total weight (lb)"],
          rows: [
            ["Straight", `${straightRows} rows straight, ${straightAcross} across`, fmt(straight.count), straight.limitedBy, fmt(straight.totalWeight)],
            ["Turned", `${turnedRows} rows turned, ${turnedAcross} across`, fmt(turned.count), turned.limitedBy, fmt(turned.totalWeight)],
          ],
          note: `Example unit: ${d.loadH} in and ${fmt(d.loadWeight)} lb, one level, payload ${fmt(d.payload)} lb. Those are calculator defaults, not your load and not an AGL measurement. ${eq.note}`,
        }}
      />
      <Disclaimer text={disclaimer} />
    </div>
  );
}

function Container40Preset() {
  const eq = equipment.find((item) => item.id === "iso40");
  if (!eq) throw new Error("40 ft container preset is missing");
  const d = truckConfig.defaults;
  const straight = Math.floor(eq.length / d.palletL) * Math.floor(eq.width / d.palletW);
  const turned = Math.floor(eq.length / d.palletW) * Math.floor(eq.width / d.palletL);
  const best = bestFloorPattern(eq.length, eq.width, d.palletL, d.palletW);
  const loaded = truckload({
    floorL: eq.length,
    floorW: eq.width,
    interiorH: eq.height,
    palletL: d.palletL,
    palletW: d.palletW,
    loadH: d.loadH,
    loadWeight: d.loadWeight,
    maxLevels: d.maxLevels,
    payload: d.payload,
  });
  expect(loaded.count === 20 && straight === 18 && turned === 11, `40 ft preset drifted to ${loaded.count}`);
  return (
    <div className="mt-6">
      <ResultSummary
        label="Loaded pallets, best simple pattern"
        value={fmt(loaded.count)}
        detail={
          <p>
            {loaded.floor.pattern}. {fmt(loaded.floor.count)} floor positions × {loaded.levels} level, limited by {loaded.limitedBy}. Example
            total {fmt(loaded.totalWeight)} lb.
          </p>
        }
      />
      <DataTable
        table={{
          caption: "40 ft standard container, 48 × 40, single-stacked",
          columns: ["Pattern", "Floor positions"],
          rows: [
            ["All straight", fmt(straight)],
            ["All turned", fmt(turned)],
            [`Best simple pattern: ${best.pattern}`, fmt(best.count)],
          ],
          note: `Interior ${fmt(eq.length, 1)} × ${fmt(eq.width, 2)} × ${fmt(eq.height, 1)} in. Example unit ${d.loadH} in and ${fmt(d.loadWeight)} lb. Not a measured load. ${eq.note}`,
        }}
      />
      <Disclaimer text={disclaimer} />
    </div>
  );
}

function EmptyPreset() {
  const eq = equipment.find((item) => item.id === "van53");
  if (!eq) throw new Error("53 ft dry van preset is missing");
  const d = truckConfig.defaults;
  const empty = emptyLoad({
    floorL: eq.length,
    floorW: eq.width,
    interiorH: eq.height,
    palletL: d.palletL,
    palletW: d.palletW,
    palletH: d.palletH,
    clearance: d.clearance,
    palletWeight: d.palletWeight,
    payload: d.payload,
  });
  expect(empty.count === 510 && empty.perStack === 17, `empty preset drifted to ${empty.count}`);
  return (
    <div className="mt-6">
      <ResultSummary
        label="Empty pallets"
        value={fmt(empty.count)}
        detail={
          <p>
            {fmt(empty.floor.count)} stacks of {empty.perStack} ({empty.floor.pattern}), limited by {empty.limitedBy}. About {fmt(empty.totalWeight)} lb
            of empty pallets.
          </p>
        }
      />
      <DataTable
        table={{
          caption: "Empty-mode inputs, shared planning default",
          columns: ["Input", "Value"],
          rows: [
            ["Equipment", eq.label],
            ["Pallet", `${d.palletL} × ${d.palletW} in, ${d.palletH} in tall, ${d.palletWeight} lb`],
            ["Clearance above the stacks", `${d.clearance} in`],
            ["Payload limit", `${fmt(d.payload)} lb`],
            ["Stacks × height", `${fmt(empty.floor.count)} × ${empty.perStack}`],
            ["Limited by", empty.limitedBy],
          ],
          note: `Planning estimate from the calculator, not a counted truck. ${eq.note}`,
        }}
      />
      <Disclaimer text={disclaimer} />
    </div>
  );
}

function BoxesPreset() {
  const content = calculators.boxesPerPallet;
  const d = content.defaults;
  const result = boxesPerPallet({
    palletL: d.palletL,
    palletW: d.palletW,
    palletH: d.palletH,
    boxL: d.boxL,
    boxW: d.boxW,
    boxH: d.boxH,
    maxH: d.maxH,
  });
  expect(result.count === 50 && result.layers === 5 && result.perLayer.count === 10, `boxes preset drifted to ${result.count}`);
  return (
    <div className="mt-6">
      <ResultSummary
        label="Cartons on the example pallet"
        value={fmt(result.count)}
        detail={
          <p>
            {fmt(result.perLayer.count)} per layer × {result.layers} layers. Pattern: {result.perLayer.pattern}. Stack height {fmt(result.stackHeight)} in,
            limited by {result.limitedBy}.
          </p>
        }
      />
      <DataTable
        table={{
          caption: "Example carton on a 48 × 40 pallet",
          columns: ["Input", "Value"],
          rows: [
            ["Pallet", `${d.palletL} × ${d.palletW} in, ${d.palletH} in tall`],
            ["Carton", `${d.boxL} × ${d.boxW} × ${d.boxH} in`],
            ["Maximum load height", `${d.maxH} in, including the pallet`],
            ["Cartons per layer", fmt(result.perLayer.count)],
            ["Layers", fmt(result.layers)],
            ["Cartons", fmt(result.count)],
          ],
          note: "Column stacking, no overhang, same pattern on every layer. Example inputs only. Not a measured pack-out, and the pallet's own load rating is not checked.",
        }}
      />
      <Disclaimer text={disclaimer} />
    </div>
  );
}

export function QuestionAsset({ item }: { item: QuestionItem }) {
  const id = item.asset.id;
  if (item.asset.table && (id === "domestic-decision" || id === "grade-criteria" || id === "ownership-table" || id === "iso-disagree")) {
    return <DataTable table={item.asset.table} />;
  }
  if (id === "ht-stamp") return <StampDiagram item={item} />;
  if (id === "support-diagram") return <SupportDiagram item={item} />;
  if (id === "height-diagram") return <HeightDiagram item={item} />;
  if (id === "entry-diagram") return <EntryDiagram item={item} />;
  if (id === "weight-preset") return <WeightPreset />;
  if (id === "trailer-53") return <Trailer53Preset />;
  if (id === "container-40") return <Container40Preset />;
  if (id === "empty-truckload") return <EmptyPreset />;
  if (id === "boxes-preset") return <BoxesPreset />;
  throw new Error(`No asset renderer for ${id}`);
}
