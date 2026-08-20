import { NextResponse } from "next/server";
import { otpVerifySchema } from "@/lib/validations";
import { verifyOtp } from "@/lib/otp";
import { setBillSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = otpVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const { email, code } = parsed.data;
  const result = await verifyOtp(email, code);

  if (!result.ok) {
    const messages: Record<typeof result.reason, string> = {
      not_found: "No active code for this email. Request a new one.",
      expired: "This code has expired. Request a new one.",
      too_many_attempts: "Too many incorrect attempts. Request a new code.",
      invalid_code: "Incorrect code. Please try again.",
    };
    return NextResponse.json({ error: messages[result.reason] }, { status: 400 });
  }

  await setBillSessionCookie(email);
  return NextResponse.json({ ok: true });
}
