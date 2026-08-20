import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitUtrSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ invoiceNumber: string }> }
) {
  const { invoiceNumber } = await params;
  const body = await request.json().catch(() => null);
  const parsed = submitUtrSchema.safeParse({ ...body, invoiceNumber });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const bill = await prisma.bill.findUnique({ where: { invoiceNumber } });
  if (!bill) {
    return NextResponse.json({ error: "No bill found for that invoice number." }, { status: 404 });
  }
  if (bill.paymentStatus === "paid") {
    return NextResponse.json({ error: "This bill is already marked paid." }, { status: 409 });
  }

  await prisma.bill.update({
    where: { invoiceNumber },
    data: { paymentStatus: "payment_pending", upiUtr: parsed.data.utr },
  });

  return NextResponse.json({ ok: true });
}
