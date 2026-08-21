import { prisma } from "./prisma";

export async function generateCertificateNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `CERT-${year}-`;

  const last = await prisma.certificate.findFirst({
    where: { certificateNumber: { startsWith: prefix } },
    orderBy: { certificateNumber: "desc" },
  });

  const lastSeq = last ? Number(last.certificateNumber.slice(prefix.length)) : 0;
  const nextSeq = lastSeq + 1;

  return `${prefix}${String(nextSeq).padStart(4, "0")}`;
}
