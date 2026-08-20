import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildUpiLink } from "@/lib/upi";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ invoiceNumber: string }> }
) {
  const { invoiceNumber } = await params;

  const bill = await prisma.bill.findUnique({ where: { invoiceNumber } });
  if (!bill) {
    return NextResponse.json({ error: "No bill found for that invoice number." }, { status: 404 });
  }

  return NextResponse.json({
    invoiceNumber: bill.invoiceNumber,
    customerName: bill.customerName,
    billingAddress: bill.billingAddress,
    shippingAddress: bill.shippingAddress,
    items: JSON.parse(bill.items),
    taxRate: bill.taxRate,
    discount: bill.discount,
    subtotal: bill.subtotal,
    total: bill.total,
    notes: bill.notes,
    invoiceDate: bill.invoiceDate,
    dueDate: bill.dueDate,
    paymentStatus: bill.paymentStatus,
    paymentMethod: bill.paymentMethod,
    upiUtr: bill.upiUtr,
    paidAt: bill.paidAt,
    upiLink:
      bill.paymentStatus === "paid"
        ? null
        : buildUpiLink({ amount: bill.total, invoiceNumber: bill.invoiceNumber }),
  });
}
