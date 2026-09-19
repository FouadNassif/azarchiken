import { NextRequest, NextResponse } from "next/server";
import { getOrSetVisitorId } from "@/lib/visitorId";
import { incrementSortedSet, addToSet, underRateLimit } from "@/lib/analyticsStore";

export async function POST(request: NextRequest) {
  let query: string | undefined;
  try {
    const body = await request.json();
    query = body?.query;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const normalized = typeof query === "string" ? query.trim().toLowerCase().slice(0, 60) : "";
  if (normalized.length < 2) {
    return NextResponse.json({ ok: true }); // too short to be a meaningful search term
  }

  const response = NextResponse.json({ ok: true });
  const visitorId = getOrSetVisitorId(request, response);

  if (!(await underRateLimit(`ratelimit:${visitorId}`, 120, 60))) {
    return response;
  }

  await incrementSortedSet("search:terms", normalized, 1);
  await addToSet("visitors:all", visitorId);

  return response;
}
