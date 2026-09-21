import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateBillSchema } from "@/lib/validations";
import { BillDocument } from "@/pdf/BillDocument";

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

  const buffer = await renderToBuffer(
    <BillDocument
      bill={{
        invoiceNumber: "PREVIEW — NOT SAVED",
        invoiceDate: format(data.invoiceDate ? new Date(data.invoiceDate) : new Date(), "dd MMM yyyy"),
        dueDate: data.dueDate ? format(new Date(data.dueDate), "dd MMM yyyy") : null,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        items: lineItems,
        taxRate: data.taxRate,
        discount: data.discount,
        subtotal,
        total,
        notes: data.notes ?? null,
        paymentStatus: "unpaid",
      }}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="bill-preview.pdf"`,
    },
  });
}
