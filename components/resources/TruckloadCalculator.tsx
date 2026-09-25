import calculators from "@/content/resources/calculators.json";
import { ArticleSection, DataTable } from "@/components/resources/ResourceArticle";
import { CalcForm, Disclaimer, FieldGroup, NoteList, NumberField, ResultSummary, SelectField } from "@/components/resources/Calculator";
import { bestFloorPattern, emptyLoad, fmt, numParam, strParam, truckload } from "@/lib/calculators";
import { TrailerDiagram } from "@/components/resources/TrailerDiagram";

type Params = Record<string, string | string[] | undefined>;

const { equipment, truckload: config, disclaimer } = calculators;
const EQUIPMENT_IDS = equipment.map((e) => e.id);

export const TRUCKLOAD_TOC = { id: "calculator", label: "Truckload calculator" };
/** Visible lead under the calculator heading. WebApplication description uses this same sentence. */
export const TRUCKLOAD_APP_DESCRIPTION =
  "Pick the equipment and enter your pallet and load. The page recalculates on submit and shows the counts below.";
export const CALCULATED_TOC = { id: "calculated-counts", label: "Calculated counts" };

const EUR = { l: 47.24, w: 31.5 };

/** Single-stacked floor counts for every preset, from the same math as the calculator. */
export function CalculatedCounts() {
  const presets = equipment.filter((e) => e.id !== "custom");
  const d = config.defaults;
  const rows = presets.map((e) => {
    const straight = Math.floor(e.length / 48) * Math.floor(e.width / 40);
    const turned = Math.floor(e.length / 40) * Math.floor(e.width / 48);
    const best = bestFloorPattern(e.length, e.width, 48, 40);
    const eur = bestFloorPattern(e.length, e.width, EUR.l, EUR.w);
    const empty = emptyLoad({
      floorL: e.length,
      floorW: e.width,
      interiorH: e.height,
      palletL: 48,
      palletW: 40,
      palletH: d.palletH,
      clearance: d.clearance,
      palletWeight: d.palletWeight,
      payload: d.payload,
    });
    return [
      e.label,
      `${fmt(e.length, 1)} × ${fmt(e.width, 2)} × ${fmt(e.height, 1)}`,
      fmt(straight),
      fmt(turned),
      fmt(best.count),
      `${fmt(empty.count)} (${empty.perStack} high)`,
      fmt(eur.count),
    ];
  });
  return (
    <ArticleSection section={{ id: CALCULATED_TOC.id, heading: "Calculated counts, single-stacked" }}>
      <p className="prose-measure mt-6 text-body text-ink/85">
        Counts below come from stated interior dimensions and the calculator&rsquo;s method, so they can be checked and reproduced. Floor
        columns are positions only. Interior height is listed because a high-cube container is taller than a standard container with the
        same floor, which changes the empty-pallet stack even when the floor count does not.
      </p>
      <DataTable
        table={{
          caption: "Floor positions and empty stacks by equipment, calculated",
          columns: [
            "Equipment",
            "Interior L × W × H (in)",
            "48 × 40 straight",
            "48 × 40 turned",
            "48 × 40 best pattern",
            "Empty 48 × 40, planning default",
            "EUR 1200 × 800 best pattern",
          ],
          rows,
          note: `Best pattern tests all-straight, all-turned, mixed rows, and mixed lanes. Loaders using pinwheel or interlocked patterns sometimes fit more, which is one reason the EUR figures here run below the published counts above. Empty counts use the shared planning default: 48 × 40 in, ${d.palletH} in tall, ${d.palletWeight} lb, ${d.clearance} in clearance, ${fmt(d.payload)} lb payload. A 40 ft high-cube and a 40 ft standard container share a floor size; the high-cube is taller, so its empty stack is higher. Dimension sources are listed under each preset in the calculator.`,
        }}
      />
    </ArticleSection>
  );
}

/** Pallets-per-truckload calculator; `path` is the page it posts back to. */
export function TruckloadCalculator({ params, path }: { params: Params; path: string }) {
  const d = config.defaults;
  const eqId = strParam(params, "eq", EQUIPMENT_IDS, "van53");
  const eq = equipment.find((e) => e.id === eqId)!;
  const custom = eqId === "custom";
  const floorL = custom ? numParam(params, "L", eq.length, 24, 1000) : eq.length;
  const floorW = custom ? numParam(params, "W", eq.width, 24, 200) : eq.width;
  const interiorH = custom ? numParam(params, "H", eq.height, 24, 200) : eq.height;

  const palletL = numParam(params, "pl", d.palletL, 12, 120);
  const palletW = numParam(params, "pw", d.palletW, 12, 120);
  const palletH = numParam(params, "ph", d.palletH, 2, 24);
  const palletWeight = numParam(params, "pwt", d.palletWeight, 1, 500);
  const clearance = numParam(params, "cl", d.clearance, 0, 48);
  const loadH = numParam(params, "lh", d.loadH, 6, 200);
  const loadWeight = numParam(params, "lw", d.loadWeight, 1, 10000);
  const maxLevels = numParam(params, "lv", d.maxLevels, 1, 4);
  const payload = numParam(params, "pay", d.payload, 1000, 100000);

  const loaded = truckload({ floorL, floorW, interiorH, palletL, palletW, loadH, loadWeight, maxLevels, payload });
  const empty = emptyLoad({ floorL, floorW, interiorH, palletL, palletW, palletH, clearance, palletWeight, payload });
  const footprint = `${fmt(palletL, palletL % 1 ? 1 : 0)} × ${fmt(palletW, palletW % 1 ? 1 : 0)} in`;

  return (
    <ArticleSection section={{ id: TRUCKLOAD_TOC.id, heading: "Pallets per truckload calculator" }}>
      <p className="prose-measure mt-6 text-body text-ink/85">{TRUCKLOAD_APP_DESCRIPTION}</p>
      <CalcForm action={`${path}#truckload-results`} resetHref={`${path}#calculator`} label="Pallets per truckload calculator">
        <FieldGroup legend="Equipment">
          <SelectField name="eq" label="Trailer or container" value={eqId} options={equipment} wide />
          <NumberField name="L" label="Interior length, custom" unit="in" value={floorL} min={24} max={1000} />
          <NumberField name="W" label="Interior width, custom" unit="in" value={floorW} min={24} max={200} />
          <NumberField name="H" label="Interior height, custom" unit="in" value={interiorH} min={24} max={200} />
        </FieldGroup>
        <FieldGroup legend="Pallet">
          <NumberField name="pl" label="Length" unit="in" value={palletL} min={12} max={120} />
          <NumberField name="pw" label="Width" unit="in" value={palletW} min={12} max={120} />
          <NumberField name="ph" label="Empty height" unit="in" value={palletH} min={2} max={24} />
          <NumberField name="pwt" label="Empty weight" unit="lb" value={palletWeight} min={1} max={500} />
          <NumberField name="cl" label="Clearance above empty stacks" unit="in" value={clearance} min={0} max={48} />
        </FieldGroup>
        <FieldGroup legend="Loaded unit and limits">
          <NumberField name="lh" label="Loaded height incl. pallet" unit="in" value={loadH} min={6} max={200} />
          <NumberField name="lw" label="Loaded weight incl. pallet" unit="lb" value={loadWeight} min={1} max={10000} />
          <NumberField name="lv" label="Stack levels allowed" unit="1–4" value={maxLevels} min={1} max={4} step="1" />
          <NumberField name="pay" label="Payload limit" unit="lb" value={payload} min={1000} max={100000} />
        </FieldGroup>
      </CalcForm>
      <p className="prose-measure mt-4 text-[14px] leading-relaxed text-ink/70">
        Custom dimensions apply only when “Custom” is selected. Preset: {eq.note}
      </p>

      <section id="truckload-results" aria-labelledby="truckload-results-h" aria-live="polite" className="mt-10 scroll-mt-28">
        <h3 id="truckload-results-h" className="text-step-lg text-current">
          Results: {eq.label}, {footprint}
        </h3>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <ResultSummary
            label="Loaded pallets"
            value={fmt(loaded.count)}
            detail={
              <p>
                {fmt(loaded.floor.count)} floor positions × {loaded.levels} level{loaded.levels === 1 ? "" : "s"}, limited by{" "}
                {loaded.limitedBy}. About {fmt(loaded.totalWeight)} lb.
              </p>
            }
          />
          <ResultSummary
            label="Empty pallets in stacks"
            value={fmt(empty.count)}
            detail={
              <p>
                {fmt(empty.floor.count)} stacks of {empty.perStack}, limited by {empty.limitedBy}. About {fmt(empty.totalWeight)} lb.
              </p>
            }
          />
        </div>
        <DataTable
          table={{
            caption: "How the counts were reached",
            columns: ["Step", "Loaded pallets", "Empty pallets"],
            rows: [
              ["Floor pattern", loaded.floor.pattern, empty.floor.pattern],
              ["Floor positions", fmt(loaded.floor.count), fmt(empty.floor.count)],
              ["Levels or stack height", `${loaded.levels} of ${maxLevels} allowed (${fmt(loadH)} in each)`, `${empty.perStack} pallets (${fmt(palletH, 1)} in each)`],
              ["Count by space", fmt(loaded.bySpace), fmt(empty.bySpace)],
              ["Count by payload", Number.isFinite(loaded.byWeight) ? fmt(loaded.byWeight) : "—", Number.isFinite(empty.byWeight) ? fmt(empty.byWeight) : "—"],
              ["Result", fmt(loaded.count), fmt(empty.count)],
            ],
            note: `Interior used: ${fmt(floorL, 1)} × ${fmt(floorW, 2)} × ${fmt(interiorH, 1)} in. Payload limit ${fmt(payload)} lb.`,
          }}
        />
        <TrailerDiagram
          floorL={floorL}
          floorW={floorW}
          palletL={palletL}
          palletW={palletW}
          floor={loaded.floor}
        />
        <Disclaimer text={disclaimer} />
      </section>

      <NoteList heading="Defaults and where they come from" items={config.defaultNotes} />
      <NoteList heading="Method" items={config.method} />
    </ArticleSection>
  );
}
