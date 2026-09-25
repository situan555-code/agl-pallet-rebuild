import type { Metadata } from "next";
import calculators from "@/content/resources/calculators.json";
import { CalculatorPage, calculatorPath } from "@/components/resources/CalculatorPage";
import { CalcForm, Disclaimer, FieldGroup, NumberField, ResultSummary } from "@/components/resources/Calculator";
import { DataTable } from "@/components/resources/ResourceArticle";
import { costPerTrip, fmt, hasParams, optionalNumParam, usd } from "@/lib/calculators";
import { pageMeta } from "@/lib/seo";

const content = calculators.costPerTrip;
const PATH = calculatorPath(content.slug);

export const metadata: Metadata = pageMeta(content.metaTitle, content.metaDescription, PATH);

function comparisonLine(perTrip: number, oneWay: number | undefined) {
  if (oneWay === undefined) return "Enter a one-way pallet price to compare.";
  const delta = oneWay - perTrip;
  if (Math.abs(delta) < 0.005) return "The multi-trip pallet and the one-way pallet cost the same per trip.";
  if (delta > 0) return `Multi-trip is ${usd(delta)} less per trip than the one-way pallet.`;
  return `One-way is ${usd(Math.abs(delta))} less per trip than the multi-trip pallet.`;
}

export default async function CostPerTripPage(
  props: { searchParams: Promise<Record<string, string | string[] | undefined>> }
) {
  const searchParams = await props.searchParams;
  const exampleMode = !hasParams(searchParams);
  const ex = content.example;
  const price = exampleMode ? ex.price : optionalNumParam(searchParams, "price", 0.01, 100000);
  const trips = exampleMode ? ex.trips : optionalNumParam(searchParams, "trips", 1, 1000);
  const repairPerTrip = exampleMode ? ex.repair : (optionalNumParam(searchParams, "repair", 0, 100000) ?? 0);
  const returnPerTrip = exampleMode ? ex.returnFreight : (optionalNumParam(searchParams, "return", 0, 100000) ?? 0);
  const residual = exampleMode ? ex.residual : (optionalNumParam(searchParams, "residual", 0, 100000) ?? 0);
  const oneWayPrice = exampleMode ? ex.oneWay : optionalNumParam(searchParams, "oneway", 0.01, 100000);
  const ready = price !== undefined && trips !== undefined && residual <= price;
  const r = ready ? costPerTrip({ price, trips, repairPerTrip, returnPerTrip, residual, oneWayPrice }) : undefined;

  return (
    <CalculatorPage content={content}>
      <p className="prose-measure mt-6 text-body text-ink/85">
        <strong className="font-semibold text-brand-green">Formula:</strong> {content.formula}
      </p>
      <CalcForm
        action={`${PATH}#results`}
        resetHref={`${PATH}#calculator`}
        label="Pallet cost per trip calculator"
        submitLabel="Calculate"
        resetLabel="Reset to worked example"
      >
        <FieldGroup legend="Your multi-trip pallet">
          <NumberField name="price" label="Purchase price per pallet" unit="$" value={price} min={0.01} max={100000} placeholder="Your price" />
          <NumberField name="trips" label="Expected trips before retirement" value={trips} min={1} max={1000} step="1" placeholder="e.g. your history" />
          <NumberField name="residual" label="Residual value at end, optional" unit="$" value={residual || undefined} min={0} max={100000} required={false} />
          <NumberField name="repair" label="Repair cost per trip, optional" unit="$" value={repairPerTrip || undefined} min={0} max={100000} required={false} />
          <NumberField name="return" label="Return freight and handling per trip, optional" unit="$" value={returnPerTrip || undefined} min={0} max={100000} required={false} />
        </FieldGroup>
        <FieldGroup legend="One-way comparison" columns={2}>
          <NumberField name="oneway" label="One-way pallet price, optional" unit="$" value={oneWayPrice} min={0.01} max={100000} required={false} placeholder="Optional" />
        </FieldGroup>
      </CalcForm>

      <section id="results" aria-labelledby="results-h" aria-live="polite" className="mt-10 scroll-mt-28">
        <h3 id="results-h" className="text-step-lg text-brand-green">
          {exampleMode ? "Worked example" : "Results"}
        </h3>
        {exampleMode && <p className="prose-measure mt-4 text-body text-ink/85">{ex.note}</p>}
        {r && trips !== undefined && price !== undefined ? (
          <>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <ResultSummary label="Cost per trip, multi-trip pallet" value={usd(r.perTrip)} detail={<p>Over {fmt(trips)} trips, {usd(r.lifetime)} in total.</p>} />
              <ResultSummary
                label="Cost per trip, one-way pallet"
                value={r.oneWay === undefined ? "—" : usd(r.oneWay)}
                detail={<p>{r.oneWay === undefined ? "Optional one-way pallet price was not entered." : "A pallet that ships once costs its price on that trip."}</p>}
              />
            </div>
            <DataTable
              table={{
                caption: exampleMode ? "Worked example: how the cost per trip was reached" : "How the cost per trip was reached",
                columns: ["Step", "Value"],
                rows: [
                  ["Purchase price − residual value", `${usd(price)} − ${usd(residual)} = ${usd(price - residual)}`],
                  ["÷ expected trips", `${usd(price - residual)} ÷ ${fmt(trips)} = ${usd(r.capitalPerTrip)}`],
                  ["+ repair per trip", usd(repairPerTrip)],
                  ["+ return freight and handling per trip", usd(returnPerTrip)],
                  ["Multi-trip cost per trip", usd(r.perTrip)],
                  ["One-way pallet price", r.oneWay === undefined ? "Not entered" : usd(r.oneWay)],
                  ["One-way vs. multi-trip", comparisonLine(r.perTrip, r.oneWay)],
                ],
                note: exampleMode
                  ? "Worked example. Every dollar figure above is a sample input, not an AGL price. The calculator holds no price data."
                  : "Every dollar figure above is one you entered. The calculator holds no price data.",
              }}
            />
          </>
        ) : (
          <p className="prose-measure mt-4 text-body text-ink/85">
            {price !== undefined && residual > price
              ? "Residual value is higher than the purchase price. Check the figures and calculate again."
              : "Enter a purchase price and expected trips, then calculate. Results appear here."}
          </p>
        )}
        <Disclaimer text={calculators.disclaimer} />
      </section>
    </CalculatorPage>
  );
}
