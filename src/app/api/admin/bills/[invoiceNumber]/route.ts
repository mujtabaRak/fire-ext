import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateBillSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ invoiceNumber: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { invoiceNumber } = await params;
  const body = await request.json().catch(() => null);
  const parsed = generateBillSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid bill details." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  if (products.length !== new Set(productIds).size) {
    return NextResponse.json({ error: "One or more products are invalid." }, { status: 400 });
  }

  // Prices are always taken from the server-side catalog, never trusted from the client.
  const lineItems = data.items.map((item) => {
    const product = productMap.get(item.productId)!;
    return {
      productId: product.id,
      productName: product.name,
      sizeKg: product.sizeKg,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal: product.price * item.quantity,
    };
  });

  const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const taxAmount = (subtotal - data.discount) * (data.taxRate / 100);
  const total = Math.max(0, subtotal - data.discount + taxAmount);

  try {
    const bill = await prisma.bill.update({
      where: { invoiceNumber },
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        items: JSON.stringify(lineItems),
        taxRate: data.taxRate,
        discount: data.discount,
        subtotal,
        total,
        notes: data.notes,
        ...(data.invoiceDate && { invoiceDate: new Date(data.invoiceDate) }),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
    return NextResponse.json({ invoiceNumber: bill.invoiceNumber });
  } catch (err) {
    const isNotFound =
      err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
    if (isNotFound) {
      return NextResponse.json({ error: "Bill not found." }, { status: 404 });
    }
    throw err;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ invoiceNumber: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { invoiceNumber } = await params;

  try {
    await prisma.bill.delete({ where: { invoiceNumber } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const isNotFound =
      err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
    if (isNotFound) {
      return NextResponse.json({ error: "Bill not found." }, { status: 404 });
    }
    throw err;
  }
}
