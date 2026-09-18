// Local-dev fallback so /admin works without a GitHub token configured yet.
// Vercel's filesystem is read-only at runtime, so this path is never taken in
// production — see isGitHubConfigured() in github.ts.
import { promises as fs } from "fs";
import path from "path";

const PROJECT_ROOT = process.cwd();

export async function readLocalFile(relativePath: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(PROJECT_ROOT, relativePath), "utf-8");
  } catch {
    return null;
  }
}

export async function writeLocalFile(relativePath: string, content: string): Promise<void> {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf-8");
}

export async function writeLocalBinaryFile(relativePath: string, data: Buffer): Promise<void> {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, data);
}
