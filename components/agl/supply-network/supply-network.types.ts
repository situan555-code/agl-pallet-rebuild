export type SupplyIconName = "factory" | "building" | "layers";

export type SupplySource = {
  id: string;
  label: string;
  description: string;
  icon: SupplyIconName;
};

export type SupplyHub = {
  title: string;
  /** Rendered with arrow icons between steps. */
  steps: string[];
};

export type SupplyDestination = {
  title: string;
  description: string;
};

export type SupplyNetworkProps = {
  sources: SupplySource[];
  hub: SupplyHub;
  destination: SupplyDestination;
  className?: string;
};

/** Hovered node id: a source id, "agl", "destination", or null. */
export type ActiveNode = string | null;

export type Point = { x: number; y: number };

export type Geometry = {
  width: number;
  height: number;
  sources: Record<string, Point>;
  hubLeft: Point;
  hubRight: Point;
  destinationLeft: Point;
};
