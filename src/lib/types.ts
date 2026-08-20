export type ExtinguisherType = "ABC" | "CO2" | "WATER" | "FOAM" | "WET_CHEMICAL";

export type ProductDto = {
  id: string;
  name: string;
  sizeKg: number;
  type: ExtinguisherType;
  coverageAreaSqFt: number;
  fireClasses: string[];
  price: number;
  useCase: string;
};

export const EXTINGUISHER_TYPE_LABELS: Record<ExtinguisherType, string> = {
  ABC: "ABC Dry Powder",
  CO2: "CO2 Clean Agent",
  WATER: "Water",
  FOAM: "Water / Foam",
  WET_CHEMICAL: "Wet Chemical",
};
