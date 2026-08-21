import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
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
      active: p.active,
    }))
  );
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid product." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const product = await prisma.product.create({
    data: {
      name: data.name,
      type: data.type,
      sizeKg: data.sizeKg,
      price: data.price,
      coverageAreaSqFt: data.coverageAreaSqFt,
      fireClasses: data.fireClasses.join(","),
      useCase: data.useCase,
      active: data.active ?? true,
    },
  });

  return NextResponse.json({ id: product.id });
}
