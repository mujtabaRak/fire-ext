import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET env var is required");
  }
  return secret;
}

export const ADMIN_SESSION_COOKIE = "admin_session";

const ADMIN_SESSION_TTL_SECONDS = 60 * 60; // 1 hour

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

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
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
