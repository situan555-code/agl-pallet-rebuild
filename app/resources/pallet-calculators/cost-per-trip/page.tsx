import type { Metadata } from "next";
import calculators from "@/content/resources/calculators.json";
import { CalculatorPage, calculatorPath } from "@/components/resources/CalculatorPage";
import { CalcForm, Disclaimer, FieldGroup, NumberField, ResultSummary } from "@/components/resources/Calculator";
import { DataTable } from "@/components/resources/ResourceArticle";
import { costPerTrip, fmt, optionalNumParam, usd } from "@/lib/calculators";
import { pageMeta } from "@/lib/seo";

const content = calculators.costPerTrip;
const PATH = calculatorPath(content.slug);

export const metadata: Metadata = pageMeta(content.metaTitle, content.metaDescription, PATH);

// No default prices: every dollar figure on this page is one the visitor entered.
export default function CostPerTripPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const price = optionalNumParam(searchParams, "price", 0.01, 100000);
  const trips = optionalNumParam(searchParams, "trips", 1, 1000);
  const repairPerTrip = optionalNumParam(searchParams, "repair", 0, 100000) ?? 0;
  const returnPerTrip = optionalNumParam(searchParams, "return", 0, 100000) ?? 0;
  const residual = optionalNumParam(searchParams, "residual", 0, 100000) ?? 0;
  const ready = price !== undefined && trips !== undefined && residual <= price;
  const r = ready ? costPerTrip({ price, trips, repairPerTrip, returnPerTrip, residual }) : undefined;

  return (
    <CalculatorPage content={content}>
      <p className="prose-measure mt-6 text-body text-ink/85">
        <strong className="font-semibold text-brand-green">Formula:</strong> {content.formula}
      </p>
      <CalcForm action={`${PATH}#results`} resetHref={`${PATH}#calculator`} label="Pallet cost per trip calculator" submitLabel="Calculate">
        <FieldGroup legend="Your multi-trip pallet">
          <NumberField name="price" label="Purchase price per pallet" unit="$" value={price} min={0.01} max={100000} placeholder="Your price" />
          <NumberField name="trips" label="Expected trips before retirement" value={trips} min={1} max={1000} step="1" placeholder="e.g. your history" />
          <NumberField name="residual" label="Residual value at end, optional" unit="$" value={residual || undefined} min={0} max={100000} required={false} />
          <NumberField name="repair" label="Repair cost per trip, optional" unit="$" value={repairPerTrip || undefined} min={0} max={100000} required={false} />
          <NumberField name="return" label="Return freight and handling per trip, optional" unit="$" value={returnPerTrip || undefined} min={0} max={100000} required={false} />
        </FieldGroup>
      </CalcForm>

      <section id="results" aria-labelledby="results-h" aria-live="polite" className="mt-10 scroll-mt-28">
        <h3 id="results-h" className="font-display text-step-lg uppercase text-brand-green">
          Results
        </h3>
        {r && trips !== undefined && price !== undefined ? (
          <>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <ResultSummary label="Cost per trip, multi-trip pallet" value={usd(r.perTrip)} detail={<p>Over {fmt(trips)} trips, {usd(r.lifetime)} in total.</p>} />
              <ResultSummary label="Cost per trip, one-way at the same price" value={usd(r.oneWay)} detail={<p>A pallet that ships once costs its full price on that trip.</p>} />
            </div>
            <DataTable
              table={{
                caption: "How the cost per trip was reached",
                columns: ["Step", "Value"],
                rows: [
                  ["Purchase price − residual value", `${usd(price)} − ${usd(residual)} = ${usd(price - residual)}`],
                  ["÷ expected trips", `${usd(price - residual)} ÷ ${fmt(trips)} = ${usd(r.capitalPerTrip)}`],
                  ["+ repair per trip", usd(repairPerTrip)],
                  ["+ return freight and handling per trip", usd(returnPerTrip)],
                  ["Cost per trip", usd(r.perTrip)],
                ],
                note: "Every dollar figure above is one you entered. The calculator holds no price data.",
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
