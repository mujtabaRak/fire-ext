import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { sizeKg: "asc" } });
  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      sizeKg: p.sizeKg,
      type: p.type,
      coverageAreaSqFt: p.coverageAreaSqFt,
      fireClasses: p.fireClasses.split(","),
      price: p.price,
      useCase: p.useCase,
    }))
  );
}
