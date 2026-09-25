import type { Metadata } from "next";
import calculators from "@/content/resources/calculators.json";
import { CalculatorPage, calculatorPath } from "@/components/resources/CalculatorPage";
import { CalcForm, Disclaimer, FieldGroup, NoteList, NumberField, ResultSummary, SelectField } from "@/components/resources/Calculator";
import { DataTable } from "@/components/resources/ResourceArticle";
import { fmt, numParam, palletWeight, sgAtMoisture, strParam } from "@/lib/calculators";
import { pageMeta } from "@/lib/seo";

const content = calculators.weightEstimator;
const PATH = calculatorPath(content.slug);
const SPECIES_IDS = content.species.map((s) => s.id);

export const metadata: Metadata = pageMeta(content.metaTitle, content.metaDescription, PATH);

export default async function PalletWeightEstimatorPage(
  props: { searchParams: Promise<Record<string, string | string[] | undefined>> }
) {
  const searchParams = await props.searchParams;
  const speciesId = strParam(searchParams, "sp", SPECIES_IDS, content.defaults.species);
  const species = content.species.find((s) => s.id === speciesId)!;
  const mc = numParam(searchParams, "mc", content.defaults.mc, 6, 150);
  const lines = content.lines.map((l) => ({
    id: l.id,
    label: l.label,
    qty: numParam(searchParams, `${l.id}q`, l.qty, 0, 100),
    thickness: numParam(searchParams, `${l.id}t`, l.thickness, 0.1, 12),
    width: numParam(searchParams, `${l.id}w`, l.width, 0.1, 24),
    length: numParam(searchParams, `${l.id}l`, l.length, 1, 240),
  }));

  const r = palletWeight(lines, species, mc);
  const planning = calculators.truckload.defaults;
  const planningNote = `Shared planning default: height ${planning.palletH} in and weight ${planning.palletWeight} lb, the same empty-pallet figures the truckload calculator uses. This estimator's own calculation may differ slightly from that shared planning default.`;

  return (
    <CalculatorPage content={content}>
      <CalcForm action={`${PATH}#results`} resetHref={`${PATH}#calculator`} label="Pallet weight estimator">
        <FieldGroup legend="Wood">
          <SelectField name="sp" label="Species" value={speciesId} options={content.species} />
          <NumberField name="mc" label="Moisture content" unit="%" value={mc} min={6} max={150} />
        </FieldGroup>
        {lines.map((l) => (
          <FieldGroup key={l.id} legend={l.label} columns={4}>
            <NumberField name={`${l.id}q`} label="Quantity" value={l.qty} min={0} max={100} step="1" />
            <NumberField name={`${l.id}t`} label="Thickness" unit="in" value={l.thickness} min={0.1} max={12} />
            <NumberField name={`${l.id}w`} label="Width" unit="in" value={l.width} min={0.1} max={24} />
            <NumberField name={`${l.id}l`} label="Length" unit="in" value={l.length} min={1} max={240} />
          </FieldGroup>
        ))}
      </CalcForm>

      <section id="results" aria-labelledby="results-h" aria-live="polite" className="mt-10 scroll-mt-28">
        <h3 id="results-h" className="font-display text-step-lg uppercase text-brand-green">
          Results
        </h3>
        <div className="mt-6">
          <ResultSummary
            label="Estimated pallet weight"
            value={`${fmt(r.weight, 1)} lb`}
            detail={
              <p>
                {fmt(r.volumeFt3, 2)} ft³ of wood ({fmt(r.boardFeet, 1)} board feet, actual dimensions) at {fmt(r.density, 1)} lb/ft³ for{" "}
                {species.label.toLowerCase()} at {fmt(mc)}% moisture. An estimate, not a measured weight. {planningNote}
              </p>
            }
          />
        </div>
        <DataTable
          table={{
            caption: "Weight by component",
            columns: ["Component", "Quantity", "Size (in)", "Volume (in³)", "Weight (lb)"],
            rows: [
              ...r.rows.map((row) => [
                row.label,
                fmt(row.qty),
                `${fmt(row.thickness, 3)} × ${fmt(row.width, 2)} × ${fmt(row.length, 1)}`,
                fmt(row.volumeIn3),
                fmt(row.weight, 1),
              ]),
              ["Total", "", "", fmt(r.volumeIn3), fmt(r.weight, 1)],
            ],
            note: `Specific gravity used: ${fmt(sgAtMoisture(species, mc), 3)} (Wood Handbook values ${species.sgGreen} green, ${species.sg12} at 12% moisture). ${content.speciesNote}`,
          }}
        />
        <Disclaimer text={calculators.disclaimer} />
      </section>
      <NoteList heading="Defaults and where they come from" items={[...content.defaultNotes, planningNote]} />
    </CalculatorPage>
  );
}
