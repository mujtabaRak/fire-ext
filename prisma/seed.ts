import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Compact ABC Dry Powder",
    sizeKg: 1,
    type: "ABC" as const,
    coverageAreaSqFt: 100,
    fireClasses: "A,B,C",
    price: 899,
    useCase: "Kitchen, car, small office",
  },
  {
    name: "Standard ABC Dry Powder",
    sizeKg: 2,
    type: "ABC" as const,
    coverageAreaSqFt: 250,
    fireClasses: "A,B,C",
    price: 1299,
    useCase: "Home, retail shop",
  },
  {
    name: "CO2 Clean Agent",
    sizeKg: 2,
    type: "CO2" as const,
    coverageAreaSqFt: 200,
    fireClasses: "B,C",
    price: 2499,
    useCase: "Server rooms, electrical panels",
  },
  {
    name: "Mid ABC Dry Powder",
    sizeKg: 4,
    type: "ABC" as const,
    coverageAreaSqFt: 500,
    fireClasses: "A,B,C",
    price: 1899,
    useCase: "Office floor, warehouse aisle",
  },
  {
    name: "Water/Foam Extinguisher",
    sizeKg: 6,
    type: "FOAM" as const,
    coverageAreaSqFt: 600,
    fireClasses: "A,B",
    price: 2199,
    useCase: "Hotels, hostels, common areas",
  },
  {
    name: "Large CO2 Extinguisher",
    sizeKg: 6,
    type: "CO2" as const,
    coverageAreaSqFt: 450,
    fireClasses: "B,C",
    price: 4499,
    useCase: "Labs, data centers, factories",
  },
  {
    name: "Industrial ABC Dry Powder",
    sizeKg: 9,
    type: "ABC" as const,
    coverageAreaSqFt: 900,
    fireClasses: "A,B,C",
    price: 3199,
    useCase: "Warehouses, industrial units, godowns",
  },
  {
    name: "Kitchen Wet Chemical",
    sizeKg: 3,
    type: "WET_CHEMICAL" as const,
    coverageAreaSqFt: 150,
    fireClasses: "K,A",
    price: 2799,
    useCase: "Commercial kitchens, restaurants",
  },
];

const whitelistedEmails = [
  { email: "owner@fireguard.example", companyName: "FireGuard Extinguishers" },
  { email: "billing@fireguard.example", companyName: "FireGuard Extinguishers" },
  { email: "test.partner@example.com", companyName: "Test Partner Co." },
];

async function main() {
  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  for (const w of whitelistedEmails) {
    await prisma.whitelistedEmail.upsert({
      where: { email: w.email },
      update: { companyName: w.companyName, active: true },
      create: { email: w.email, companyName: w.companyName },
    });
  }

  console.log(`Seeded ${products.length} products and ${whitelistedEmails.length} whitelisted emails.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
