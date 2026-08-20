import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET env var is required");
  }
  return secret;
}

export const BILL_SESSION_COOKIE = "bill_session";
export const ADMIN_SESSION_COOKIE = "admin_session";

const BILL_SESSION_TTL_SECONDS = 20 * 60; // 20 minutes
const ADMIN_SESSION_TTL_SECONDS = 60 * 60; // 1 hour

type BillSessionPayload = {
  email: string;
  purpose: "generate_bill";
};

export function signBillSession(email: string): string {
  return jwt.sign({ email, purpose: "generate_bill" } satisfies BillSessionPayload, getJwtSecret(), {
    expiresIn: BILL_SESSION_TTL_SECONDS,
  });
}

export async function setBillSessionCookie(email: string) {
  const token = signBillSession(email);
  const store = await cookies();
  store.set(BILL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: BILL_SESSION_TTL_SECONDS,
  });
}

export async function getVerifiedBillSessionEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(BILL_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getJwtSecret()) as unknown as BillSessionPayload;
    if (payload.purpose !== "generate_bill") return null;
    return payload.email;
  } catch {
    return null;
  }
}

export async function clearBillSessionCookie() {
  const store = await cookies();
  store.delete(BILL_SESSION_COOKIE);
}

export function signAdminSession(): string {
  return jwt.sign({ purpose: "admin" }, getJwtSecret(), { expiresIn: ADMIN_SESSION_TTL_SECONDS });
}

export async function setAdminSessionCookie() {
  const token = signAdminSession();
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    const payload = jwt.verify(token, getJwtSecret()) as unknown as { purpose: string };
    return payload.purpose === "admin";
  } catch {
    return false;
  }
}
