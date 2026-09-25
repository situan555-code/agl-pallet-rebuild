import type { Metadata } from "next";
import calculators from "@/content/resources/calculators.json";
import { CalculatorPage, calculatorPath } from "@/components/resources/CalculatorPage";
import { CalcForm, Disclaimer, FieldGroup, NoteList, NumberField, ResultSummary } from "@/components/resources/Calculator";
import { DataTable } from "@/components/resources/ResourceArticle";
import { boxesPerPallet, fmt, numParam, optionalNumParam } from "@/lib/calculators";
import { pageMeta } from "@/lib/seo";

const content = calculators.boxesPerPallet;
const PATH = calculatorPath(content.slug);

export const metadata: Metadata = pageMeta(content.metaTitle, content.metaDescription, PATH);

export default async function BoxesPerPalletPage(
  props: { searchParams: Promise<Record<string, string | string[] | undefined>> }
) {
  const searchParams = await props.searchParams;
  const d = content.defaults;
  const palletL = numParam(searchParams, "pl", d.palletL, 12, 120);
  const palletW = numParam(searchParams, "pw", d.palletW, 12, 120);
  const palletH = numParam(searchParams, "ph", d.palletH, 2, 24);
  const boxL = numParam(searchParams, "bl", d.boxL, 1, 120);
  const boxW = numParam(searchParams, "bw", d.boxW, 1, 120);
  const boxH = numParam(searchParams, "bh", d.boxH, 1, 120);
  const maxH = numParam(searchParams, "mh", d.maxH, 6, 200);
  const boxWeight = optionalNumParam(searchParams, "bwt", 0.01, 5000);
  const maxWeight = optionalNumParam(searchParams, "mwt", 1, 20000);

  const r = boxesPerPallet({ palletL, palletW, palletH, boxL, boxW, boxH, maxH, boxWeight, maxWeight });

  return (
    <CalculatorPage content={content}>
      <CalcForm action={`${PATH}#results`} resetHref={`${PATH}#calculator`} label="Boxes per pallet calculator">
        <FieldGroup legend="Pallet">
          <NumberField name="pl" label="Length" unit="in" value={palletL} min={12} max={120} />
          <NumberField name="pw" label="Width" unit="in" value={palletW} min={12} max={120} />
          <NumberField name="ph" label="Height" unit="in" value={palletH} min={2} max={24} />
        </FieldGroup>
        <FieldGroup legend="Carton">
          <NumberField name="bl" label="Length" unit="in" value={boxL} min={1} max={120} />
          <NumberField name="bw" label="Width" unit="in" value={boxW} min={1} max={120} />
          <NumberField name="bh" label="Height" unit="in" value={boxH} min={1} max={120} />
        </FieldGroup>
        <FieldGroup legend="Limits">
          <NumberField name="mh" label="Max load height incl. pallet" unit="in" value={maxH} min={6} max={200} />
          <NumberField name="bwt" label="Carton weight, optional" unit="lb" value={boxWeight} min={0.01} max={5000} required={false} />
          <NumberField name="mwt" label="Max load weight, optional" unit="lb" value={maxWeight} min={1} max={20000} required={false} />
        </FieldGroup>
      </CalcForm>

      <section id="results" aria-labelledby="results-h" aria-live="polite" className="mt-10 scroll-mt-28">
        <h3 id="results-h" className="text-step-lg text-brand-green">
          Results
        </h3>
        <div className="mt-6">
          <ResultSummary
            label="Cartons per pallet"
            value={fmt(r.count)}
            detail={
              <p>
                {fmt(r.perLayer.count)} per layer × {r.layers} layer{r.layers === 1 ? "" : "s"}
                {r.limitedBy === "weight" ? ", capped by the weight limit" : ""}. Stack height about {fmt(r.stackHeight, 1)} in
                {r.loadWeight !== undefined ? `, load about ${fmt(r.loadWeight)} lb excluding the pallet` : ""}.
              </p>
            }
          />
        </div>
        <DataTable
          table={{
            caption: "How the count was reached",
            columns: ["Step", "Value"],
            rows: [
              ["Layer pattern", r.perLayer.pattern],
              ["Cartons per layer", fmt(r.perLayer.count)],
              ["Layers under the height limit", `${r.layers} (${fmt(maxH - palletH, 1)} in available ÷ ${fmt(boxH, 1)} in)`],
              ["Count by space", fmt(r.bySpace)],
              ["Count by weight", r.byWeight !== undefined ? fmt(r.byWeight) : "Not entered"],
              ["Result", fmt(r.count)],
            ],
          }}
        />
        <Disclaimer text={calculators.disclaimer} />
      </section>
      <NoteList heading="Defaults and where they come from" items={content.defaultNotes} />
    </CalculatorPage>
  );
}
