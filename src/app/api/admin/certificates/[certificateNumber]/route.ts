import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateCertificateSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ certificateNumber: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { certificateNumber } = await params;
  const cert = await prisma.certificate.findUnique({ where: { certificateNumber } });
  if (!cert) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  return NextResponse.json({
    certificateNumber: cert.certificateNumber,
    clientName: cert.clientName,
    clientAddress: cert.clientAddress,
    saleDate: cert.saleDate,
    certificateDate: cert.certificateDate,
    warrantyPeriod: cert.warrantyPeriod,
    testingNote: cert.testingNote,
    items: JSON.parse(cert.items),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ certificateNumber: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { certificateNumber } = await params;
  const body = await request.json().catch(() => null);
  const parsed = generateCertificateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid certificate details." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const cert = await prisma.certificate.update({
      where: { certificateNumber },
      data: {
        clientName: data.clientName,
        clientAddress: data.clientAddress,
        saleDate: new Date(data.saleDate),
        ...(data.certificateDate && { certificateDate: new Date(data.certificateDate) }),
        warrantyPeriod: data.warrantyPeriod,
        testingNote: data.testingNote,
        items: JSON.stringify(data.items),
      },
    });
    return NextResponse.json({ certificateNumber: cert.certificateNumber });
  } catch (err) {
    const isNotFound =
      err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
    if (isNotFound) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }
    throw err;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ certificateNumber: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { certificateNumber } = await params;

  try {
    await prisma.certificate.delete({ where: { certificateNumber } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const isNotFound =
      err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
    if (isNotFound) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }
    throw err;
  }
}
