import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { writeImage } from "@/lib/contentStore";

const MAX_BYTES = 4 * 1024 * 1024; // stays under Vercel's serverless request-body limit
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp"];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "photo";
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const form = await request.formData();
  const file = form.get("file");
  const name = form.get("name");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Image is too large (${Math.round(file.size / 1024 / 1024)}MB). Please use one under 4MB.` },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.includes(ext)) {
    return NextResponse.json({ error: "Only .jpg, .jpeg, .png, or .webp images are allowed" }, { status: 400 });
  }

  const baseName = slugify(typeof name === "string" && name ? name : file.name.replace(/\.[^.]+$/, ""));
  const publicPath = `/images/menu/${baseName}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    await writeImage(publicPath, buffer, `Upload image ${baseName}.${ext} via /admin`);
    return NextResponse.json({ path: publicPath });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
