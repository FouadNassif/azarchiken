// A random, anonymous id stored in a cookie so we can dedupe "views" per
// visitor (not spammed by one person refreshing a page). It identifies a
// browser, not a person — no IP, email, or account is involved.
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const VISITOR_COOKIE = "azar_visitor";

/** Reads the visitor id from the request, generating + setting a new one on the response if missing. */
export function getOrSetVisitorId(request: NextRequest, response: NextResponse): string {
  const existing = request.cookies.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  response.cookies.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return id;
}
