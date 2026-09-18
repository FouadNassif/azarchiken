import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/adminSession";

/** Returns a 401 response if the request isn't an authenticated admin session, else null. */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return null;
}
