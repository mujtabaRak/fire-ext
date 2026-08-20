import { prisma } from "./prisma";

export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;

  const last = await prisma.bill.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: "desc" },
  });

  const lastSeq = last ? Number(last.invoiceNumber.slice(prefix.length)) : 0;
  const nextSeq = lastSeq + 1;

  return `${prefix}${String(nextSeq).padStart(4, "0")}`;
}
