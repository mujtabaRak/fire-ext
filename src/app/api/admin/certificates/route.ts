import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateCertificateSchema } from "@/lib/validations";
import { generateCertificateNumber } from "@/lib/certificate";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const certificates = await prisma.certificate.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(
    certificates.map((c) => ({
      certificateNumber: c.certificateNumber,
      clientName: c.clientName,
      saleDate: c.saleDate,
      itemCount: (JSON.parse(c.items) as unknown[]).length,
      createdAt: c.createdAt,
    }))
  );
}

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

  const MAX_ATTEMPTS = 3;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const certificateNumber = await generateCertificateNumber();
    try {
      const certificate = await prisma.certificate.create({
        data: {
          certificateNumber,
          clientName: data.clientName,
          clientAddress: data.clientAddress,
          saleDate: new Date(data.saleDate),
          warrantyPeriod: data.warrantyPeriod,
          testingNote: data.testingNote,
          items: JSON.stringify(data.items),
        },
      });
      return NextResponse.json({ certificateNumber: certificate.certificateNumber });
    } catch (err) {
      const isUniqueClash =
        err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
      if (!isUniqueClash || attempt === MAX_ATTEMPTS - 1) {
        throw err;
      }
      // Another request claimed this certificate number concurrently — retry with the next one.
    }
  }

  return NextResponse.json({ error: "Could not generate certificate. Try again." }, { status: 500 });
}
