import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailGateSchema } from "@/lib/validations";
import { createOtpRequest, isWithinRateLimit } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";

const GENERIC_ERROR =
  "This email is not authorized to generate bills. Contact support.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = emailGateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const { email } = parsed.data;

  const whitelisted = await prisma.whitelistedEmail.findUnique({ where: { email } });
  if (!whitelisted || !whitelisted.active) {
    // Same response whether the email is unknown or just inactive — never reveal which.
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
  }

  const withinLimit = await isWithinRateLimit(email);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Too many code requests. Please try again in an hour." },
      { status: 429 }
    );
  }

  const { code } = await createOtpRequest(email);
  await sendOtpEmail(email, code);

  return NextResponse.json({ ok: true });
}
