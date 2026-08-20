import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const bills = await prisma.bill.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(
    bills.map((b) => ({
      invoiceNumber: b.invoiceNumber,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      total: b.total,
      paymentStatus: b.paymentStatus,
      upiUtr: b.upiUtr,
      createdAt: b.createdAt,
    }))
  );
}
