import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { productUpdateSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid product." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.sizeKg !== undefined && { sizeKg: data.sizeKg }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.coverageAreaSqFt !== undefined && { coverageAreaSqFt: data.coverageAreaSqFt }),
        ...(data.fireClasses !== undefined && { fireClasses: data.fireClasses.join(",") }),
        ...(data.useCase !== undefined && { useCase: data.useCase }),
        ...(data.active !== undefined && { active: data.active }),
      },
    });
    return NextResponse.json({ id: product.id });
  } catch (err) {
    const isNotFound =
      err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
    if (isNotFound) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    throw err;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const isNotFound =
      err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
    if (isNotFound) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    throw err;
  }
}
