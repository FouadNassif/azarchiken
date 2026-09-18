// Single entry point the admin API routes use to read/write content. Picks
// GitHub (production) or the local filesystem (dev, no token needed) — see
// github.ts and fsFallback.ts for why.
import * as gh from "./github";
import { readLocalFile, writeLocalFile, writeLocalBinaryFile } from "./fsFallback";

export type DataFile = "categories" | "menu" | "deals" | "restaurant";

const DATA_PATH: Record<DataFile, string> = {
  categories: "src/data/json/categories.json",
  menu: "src/data/json/menu.json",
  deals: "src/data/json/deals.json",
  restaurant: "src/data/json/restaurant.json",
};

export function usingGitHub(): boolean {
  return gh.isGitHubConfigured();
}

export async function readData<T>(file: DataFile): Promise<T> {
  const relPath = DATA_PATH[file];
  if (usingGitHub()) {
    const result = await gh.getFile(relPath);
    if (!result) throw new Error(`${relPath} not found in the GitHub repo`);
    return JSON.parse(result.content) as T;
  }
  const raw = await readLocalFile(relPath);
  if (!raw) throw new Error(`${relPath} not found locally`);
  return JSON.parse(raw) as T;
}

export async function writeData(file: DataFile, data: unknown, commitMessage: string): Promise<void> {
  const relPath = DATA_PATH[file];
  const content = JSON.stringify(data, null, 2) + "\n";
  if (usingGitHub()) {
    const existing = await gh.getFile(relPath);
    await gh.putFile(relPath, content, commitMessage, existing?.sha);
    return;
  }
  await writeLocalFile(relPath, content);
}

/** Uploads an image, returning the public `/images/...` path to store on a record. */
export async function writeImage(
  publicPath: string,
  data: Buffer,
  commitMessage: string
): Promise<string> {
  const relPath = `public${publicPath}`;
  if (usingGitHub()) {
    await gh.putBinaryFile(relPath, data, commitMessage);
  } else {
    await writeLocalBinaryFile(relPath, data);
  }
  return publicPath;
}
