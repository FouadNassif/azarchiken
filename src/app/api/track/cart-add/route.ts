import { NextRequest, NextResponse } from "next/server";
import { getOrSetVisitorId } from "@/lib/visitorId";
import { increment, addToSet, underRateLimit } from "@/lib/analyticsStore";

export async function POST(request: NextRequest) {
  let itemId: string | undefined;
  let kind: string | undefined;
  try {
    const body = await request.json();
    itemId = body?.itemId;
    kind = body?.kind === "deal" ? "deal" : "item";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!itemId || typeof itemId !== "string") {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  const visitorId = getOrSetVisitorId(request, response);

  if (!(await underRateLimit(`ratelimit:${visitorId}`, 120, 60))) {
    return response;
  }

  await increment(`cartadds:${kind}:${itemId}`);
  await addToSet("visitors:all", visitorId);

  return response;
}
