type NavChild = { label: string; href: string };

export type ResourceGroup = "Guides" | "Tools" | "Reference";

export function resourceGroup(href: string, label: string): ResourceGroup {
  const hay = `${href} ${label}`.toLowerCase();
  if (
    hay.includes("calculator") ||
    hay.includes("truckload") ||
    hay.includes("stamp-decoder") ||
    hay.includes("pallet-prices")
  ) {
    return "Tools";
  }
  if (
    hay.includes("glossary") ||
    hay.includes("downloads") ||
    hay.includes("questions") ||
    hay.includes("standards")
  ) {
    return "Reference";
  }
  return "Guides";
}

export function groupResourceChildren(children: NavChild[]) {
  const groups: Record<ResourceGroup, NavChild[]> = {
    Guides: [],
    Tools: [],
    Reference: [],
  };
  for (const child of children) {
    groups[resourceGroup(child.href, child.label)].push(child);
  }
  return (Object.keys(groups) as ResourceGroup[]).map((name) => ({
    name,
    items: groups[name],
  }));
}

export const TRUCKLOAD_HREF = "/resources/pallets-per-truckload/";
