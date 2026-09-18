import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { readData, usingGitHub } from "@/lib/contentStore";
import { Category, Deal, MenuItem } from "@/types/menu";

export async function GET(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const [categories, menu, deals, restaurant] = await Promise.all([
      readData<Category[]>("categories"),
      readData<MenuItem[]>("menu"),
      readData<Deal[]>("deals"),
      readData<Record<string, unknown>>("restaurant"),
    ]);
    return NextResponse.json({ categories, menu, deals, restaurant, usingGitHub: usingGitHub() });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
