import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { BillDocument, type PdfLineItem } from "@/pdf/BillDocument";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ invoiceNumber: string }> }
) {
  const { invoiceNumber } = await params;

  const bill = await prisma.bill.findUnique({ where: { invoiceNumber } });
  if (!bill) {
    return NextResponse.json({ error: "No bill found for that invoice number." }, { status: 404 });
  }

  const items = JSON.parse(bill.items) as PdfLineItem[];

  const buffer = await renderToBuffer(
    <BillDocument
      bill={{
        invoiceNumber: bill.invoiceNumber,
        invoiceDate: format(bill.invoiceDate, "dd MMM yyyy"),
        dueDate: bill.dueDate ? format(bill.dueDate, "dd MMM yyyy") : null,
        customerName: bill.customerName,
        customerPhone: bill.customerPhone,
        billingAddress: bill.billingAddress,
        shippingAddress: bill.shippingAddress,
        items,
        taxRate: bill.taxRate,
        discount: bill.discount,
        subtotal: bill.subtotal,
        total: bill.total,
        notes: bill.notes,
        paymentStatus: bill.paymentStatus,
      }}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${bill.invoiceNumber}.pdf"`,
    },
  });
}
