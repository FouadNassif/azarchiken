import { NextRequest, NextResponse } from "next/server";
import { getOrSetVisitorId } from "@/lib/visitorId";
import { incrementOncePerWindow, addToSet, underRateLimit } from "@/lib/analyticsStore";

export async function POST(request: NextRequest) {
  let itemId: string | undefined;
  try {
    const body = await request.json();
    itemId = body?.itemId;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!itemId || typeof itemId !== "string") {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  const visitorId = getOrSetVisitorId(request, response);

  if (!(await underRateLimit(`ratelimit:${visitorId}`, 120, 60))) {
    return response; // silently drop — don't let a bot's noise break the page
  }

  const today = new Date().toISOString().slice(0, 10);
  // One count per visitor per item per day, so refreshing a page repeatedly doesn't inflate views.
  await incrementOncePerWindow(`views:${itemId}`, `viewseen:${itemId}:${visitorId}:${today}`, 60 * 60 * 26);
  await addToSet("visitors:all", visitorId);

  return response;
}
