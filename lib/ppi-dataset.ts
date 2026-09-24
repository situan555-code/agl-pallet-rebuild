import ppi from "@/content/resources/data/ppi.json";
import { getSiteUrl } from "@/lib/site-url";

// One source for the prices-guide Dataset and its CSV distribution.
// PPI_DATASET_DESCRIPTION is rendered verbatim on the guide. Do not diverge.

export const PPI_CSV_PATH = "/resources/pallet-prices/ppi-csv/";

export const PPI_DATASET_NAME = "Wood pallets PPI and Lumber PPI";

export const PPI_DATASET_DESCRIPTION =
  "Wood pallets PPI and Lumber PPI are monthly, not seasonally adjusted producer price indexes published by the U.S. Bureau of Labor Statistics and retrieved from FRED.";

type Obs = [string, number];

export interface PpiSeries {
  id: string;
  name: string;
  shortName: string;
  base: string;
  publisher: string;
  href: string;
  observations: Obs[];
}

export function ppiSeries(): PpiSeries[] {
  return ppi.series.map((series) => ({
    id: series.id,
    name: series.name,
    shortName: series.shortName,
    base: series.base,
    publisher: series.publisher,
    href: series.href,
    observations: series.observations as Obs[],
  }));
}

/** Sorted YYYY-MM keys across every series. */
export function ppiMonths(): string[] {
  const months = new Set<string>();
  for (const series of ppiSeries()) {
    for (const [month] of series.observations) months.add(month);
  }
  return [...months].sort();
}

export function ppiTemporalCoverage(): string {
  const months = ppiMonths();
  return `${months[0]}/${months[months.length - 1]}`;
}

/** Wide CSV: month plus one column per series id, values as stored in ppi.json. */
export function ppiCsv(): string {
  const series = ppiSeries();
  const header = ["month", ...series.map((item) => item.id)].join(",");
  const lines = ppiMonths().map((month) => {
    const cells = series.map((item) => {
      const found = item.observations.find(([key]) => key === month);
      return found ? String(found[1]) : "";
    });
    return [month, ...cells].join(",");
  });
  return `${header}\n${lines.join("\n")}\n`;
}

export function ppiDatasetLd(): Record<string, unknown> {
  const series = ppiSeries();
  const url = getSiteUrl();
  const page = `${url}/resources/pallet-prices/`;
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: PPI_DATASET_NAME,
    description: PPI_DATASET_DESCRIPTION,
    url: page,
    creator: { "@type": "Organization", name: series[0]?.publisher },
    temporalCoverage: ppiTemporalCoverage(),
    variableMeasured: series.map((item) => ({
      "@type": "PropertyValue",
      name: item.shortName,
      propertyID: item.id,
      unitText: item.base,
    })),
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: `${url}${PPI_CSV_PATH}`,
    },
    isAccessibleForFree: true,
  };
}
