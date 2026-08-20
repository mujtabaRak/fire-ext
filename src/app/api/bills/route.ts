import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateBillSchema } from "@/lib/validations";
import { generateInvoiceNumber } from "@/lib/invoice";

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

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

  const MAX_ATTEMPTS = 3;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const invoiceNumber = await generateInvoiceNumber();
    try {
      const bill = await prisma.bill.create({
        data: {
          invoiceNumber,
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
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        },
      });
      return NextResponse.json({ invoiceNumber: bill.invoiceNumber });
    } catch (err) {
      const isUniqueClash =
        err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
      if (!isUniqueClash || attempt === MAX_ATTEMPTS - 1) {
        throw err;
      }
      // Another request claimed this invoice number concurrently — retry with the next one.
    }
  }

  return NextResponse.json({ error: "Could not generate bill. Try again." }, { status: 500 });
}
