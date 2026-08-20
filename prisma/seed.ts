import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "ABC Dry Chemical Powder 1KG",
    sizeKg: 1,
    type: "ABC" as const,
    coverageAreaSqFt: 100,
    fireClasses: "A,B,C",
    price: 750,
    useCase: "Kitchen, car, small office",
  },
  {
    name: "ABC Dry Chemical Powder 2KG",
    sizeKg: 2,
    type: "ABC" as const,
    coverageAreaSqFt: 250,
    fireClasses: "A,B,C",
    price: 950,
    useCase: "Home, retail shop",
  },
  {
    name: "ABC Dry Chemical Powder 4KG",
    sizeKg: 4,
    type: "ABC" as const,
    coverageAreaSqFt: 500,
    fireClasses: "A,B,C",
    price: 1400,
    useCase: "Office floor, warehouse aisle",
  },
  {
    name: "ABC 9KG NEW FIRE EXTINGUISHER",
    sizeKg: 9,
    type: "ABC" as const,
    coverageAreaSqFt: 900,
    fireClasses: "A,B,C",
    price: 1900,
    useCase: "Warehouses, industrial units, godowns",
  },
  {
    name: "CO2 Type Fire Extinguisher 2KG",
    sizeKg: 2,
    type: "CO2" as const,
    coverageAreaSqFt: 200,
    fireClasses: "B,C",
    price: 2200,
    useCase: "Electrical panels, small server rooms",
  },
  {
    name: "CO2 Type Fire Extinguisher 4.5KG",
    sizeKg: 4.5,
    type: "CO2" as const,
    coverageAreaSqFt: 450,
    fireClasses: "B,C",
    price: 3800,
    useCase: "Server rooms, data centers, labs",
  },
  {
    name: "HCFC-123 Clean Agent 4KG",
    sizeKg: 4,
    type: "HCFC_123" as const,
    coverageAreaSqFt: 400,
    fireClasses: "B,C",
    price: 4800,
    useCase: "Sensitive electronics, control rooms",
  },
  {
    name: "Mechanical Foam Fire Extinguisher 9L",
    sizeKg: 9,
    type: "FOAM" as const,
    coverageAreaSqFt: 600,
    fireClasses: "A,B",
    price: 2100,
    useCase: "Hotels, hostels, common areas",
  },
  {
    name: "Wet Chemical Fire Extinguisher 5L",
    sizeKg: 5,
    type: "WET_CHEMICAL" as const,
    coverageAreaSqFt: 150,
    fireClasses: "K,A",
    price: 2900,
    useCase: "Commercial kitchens, restaurants",
  },
];

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`Skipping seed — ${existing} product(s) already exist.`);
    return;
  }

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
