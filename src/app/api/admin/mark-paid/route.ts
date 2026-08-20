import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { adminMarkPaidSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminMarkPaidSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invoice number." }, { status: 400 });
  }

  const bill = await prisma.bill.findUnique({ where: { invoiceNumber: parsed.data.invoiceNumber } });
  if (!bill) {
    return NextResponse.json({ error: "No bill found for that invoice number." }, { status: 404 });
  }

  await prisma.bill.update({
    where: { invoiceNumber: parsed.data.invoiceNumber },
    data: { paymentStatus: "paid", paidAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
