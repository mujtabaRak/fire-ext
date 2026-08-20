import { NextResponse } from "next/server";
import QRCode from "qrcode";
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

  const upiLink = buildUpiLink({ amount: bill.total, invoiceNumber: bill.invoiceNumber });
  const buffer = await QRCode.toBuffer(upiLink, { width: 320, margin: 1 });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
