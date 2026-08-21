import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { CertificateDocument, type PdfCertificateItem } from "@/pdf/CertificateDocument";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ certificateNumber: string }> }
) {
  const { certificateNumber } = await params;

  const cert = await prisma.certificate.findUnique({ where: { certificateNumber } });
  if (!cert) {
    return NextResponse.json(
      { error: "No certificate found for that certificate number." },
      { status: 404 }
    );
  }

  const rawItems = JSON.parse(cert.items) as {
    description: string;
    yearOfManufacturing: number;
    qty: number;
    refillingDueDate: string;
    cylinderSerialNo: string;
  }[];

  const items: PdfCertificateItem[] = rawItems.map((item) => ({
    ...item,
    refillingDueDate: format(new Date(item.refillingDueDate), "dd.MM.yyyy"),
  }));

  const buffer = await renderToBuffer(
    <CertificateDocument
      cert={{
        certificateNumber: cert.certificateNumber,
        certificateDate: format(cert.createdAt, "dd/MM/yyyy"),
        clientName: cert.clientName,
        clientAddress: cert.clientAddress,
        saleDate: format(cert.saleDate, "dd/MM/yyyy"),
        warrantyPeriod: cert.warrantyPeriod,
        testingNote: cert.testingNote,
        items,
      }}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${cert.certificateNumber}.pdf"`,
    },
  });
}
