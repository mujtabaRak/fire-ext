import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { format } from "date-fns";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateCertificateSchema } from "@/lib/validations";
import { CertificateDocument } from "@/pdf/CertificateDocument";

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = generateCertificateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid certificate details." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const buffer = await renderToBuffer(
    <CertificateDocument
      cert={{
        certificateNumber: "PREVIEW — NOT SAVED",
        certificateDate: format(new Date(), "dd/MM/yyyy"),
        clientName: data.clientName,
        clientAddress: data.clientAddress,
        saleDate: format(new Date(data.saleDate), "dd/MM/yyyy"),
        warrantyPeriod: data.warrantyPeriod,
        testingNote: data.testingNote ?? null,
        items: data.items.map((item) => ({
          ...item,
          refillingDueDate: format(new Date(item.refillingDueDate), "dd.MM.yyyy"),
        })),
      }}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificate-preview.pdf"`,
    },
  });
}
