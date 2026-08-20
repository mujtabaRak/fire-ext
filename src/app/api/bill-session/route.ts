import { NextResponse } from "next/server";
import { getVerifiedBillSessionEmail } from "@/lib/auth";

export async function GET() {
  const email = await getVerifiedBillSessionEmail();
  return NextResponse.json({ email });
}
