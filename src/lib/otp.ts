import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const MAX_REQUESTS_PER_HOUR = 5;

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function isWithinRateLimit(email: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.otpRequest.count({
    where: { email, createdAt: { gte: oneHourAgo } },
  });
  return count < MAX_REQUESTS_PER_HOUR;
}

export async function createOtpRequest(email: string) {
  const code = generateOtpCode();
  const otpHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  const record = await prisma.otpRequest.create({
    data: { email, otpHash, expiresAt },
  });

  return { code, record };
}

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "expired" | "too_many_attempts" | "invalid_code" };

export async function verifyOtp(email: string, code: string): Promise<VerifyResult> {
  const record = await prisma.otpRequest.findFirst({
    where: { email, consumed: false },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return { ok: false, reason: "not_found" };
  if (record.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "too_many_attempts" };
  if (record.expiresAt.getTime() < Date.now()) return { ok: false, reason: "expired" };

  const matches = await bcrypt.compare(code, record.otpHash);
  if (!matches) {
    await prisma.otpRequest.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: "invalid_code" };
  }

  await prisma.otpRequest.update({
    where: { id: record.id },
    data: { consumed: true },
  });

  return { ok: true };
}
