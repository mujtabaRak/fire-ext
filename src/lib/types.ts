export type ExtinguisherType = "ABC" | "CO2" | "HCFC_123" | "FOAM" | "WET_CHEMICAL";

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

export type AdminProductDto = ProductDto & { active: boolean };

export type FireClassValue = "A" | "B" | "C" | "K";

export const FIRE_CLASS_VALUES: FireClassValue[] = ["A", "B", "C", "K"];

export const EXTINGUISHER_TYPE_VALUES: ExtinguisherType[] = [
  "ABC",
  "CO2",
  "HCFC_123",
  "FOAM",
  "WET_CHEMICAL",
];

export const EXTINGUISHER_TYPE_LABELS: Record<ExtinguisherType, string> = {
  ABC: "Dry Chemical Powder",
  CO2: "CO2",
  HCFC_123: "HCFC-123 Clean Agent",
  FOAM: "Foam",
  WET_CHEMICAL: "Wet Chemical (Class K)",
};

export const EXTINGUISHER_TYPE_SHORT_LABELS: Record<ExtinguisherType, string> = {
  ABC: "Dry Chemical",
  CO2: "CO2",
  HCFC_123: "HCFC-123",
  FOAM: "Foam",
  WET_CHEMICAL: "Wet Chem",
};
