import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { writeData, DataFile } from "@/lib/contentStore";

const VALID_FILES: DataFile[] = ["categories", "menu", "deals", "restaurant"];

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  let body: { file?: string; data?: unknown; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { file, data, message } = body;
  if (!file || !VALID_FILES.includes(file as DataFile)) {
    return NextResponse.json({ error: `file must be one of ${VALID_FILES.join(", ")}` }, { status: 400 });
  }
  if (data === undefined || data === null) {
    return NextResponse.json({ error: "data is required" }, { status: 400 });
  }
  const expectsArray = file !== "restaurant";
  if (expectsArray !== Array.isArray(data)) {
    return NextResponse.json(
      { error: expectsArray ? "data must be an array" : "data must be an object" },
      { status: 400 }
    );
  }

  try {
    await writeData(file as DataFile, data, message || `Update ${file} via /admin`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
