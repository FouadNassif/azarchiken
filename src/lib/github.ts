// Reads and writes files straight to the GitHub repo via the REST API — this
// is the app's only "database". Every save from /admin becomes a real commit,
// and Vercel's auto-deploy hook picks it up and redeploys the site.
//
// Requires these env vars in production (Vercel project settings):
//   GITHUB_TOKEN  — a GitHub token with "Contents: Read and write" access to the repo
//   GITHUB_REPO   — "owner/repo", e.g. "FouadNassif/azarchiken"
//   GITHUB_BRANCH — defaults to "main"
//
// If GITHUB_TOKEN isn't set (e.g. local development), callers fall back to
// reading/writing the local filesystem instead — see fsFallback.ts.

const API_BASE = "https://api.github.com";

export function isGitHubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

function repoPath(): string {
  const repo = process.env.GITHUB_REPO;
  if (!repo) throw new Error("GITHUB_REPO is not set");
  return repo;
}

function branch(): string {
  return process.env.GITHUB_BRANCH || "main";
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export interface GitHubFile {
  /** UTF-8 decoded text content. */
  content: string;
  sha: string;
}

/** Fetches a file's current content + blob sha (sha is required to update it). */
export async function getFile(path: string): Promise<GitHubFile | null> {
  const res = await fetch(
    `${API_BASE}/repos/${repoPath()}/contents/${path}?ref=${branch()}`,
    { headers: headers(), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFile(${path}) failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return { content, sha: json.sha };
}

/**
 * Creates or updates a text file with a commit. Pass the current `sha` when
 * updating an existing file (fetch it via getFile first) — omit it only when
 * you're sure the file doesn't exist yet.
 */
export async function putFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  const res = await fetch(`${API_BASE}/repos/${repoPath()}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: branch(),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub putFile(${path}) failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return { sha: json.content.sha };
}

/** Creates or updates a binary file (e.g. an uploaded photo) from a Buffer. */
export async function putBinaryFile(
  path: string,
  data: Buffer,
  message: string
): Promise<{ sha: string }> {
  // Uploaded images are new files far more often than replacements, and
  // colliding filenames get a suffix (see admin route), so we don't need the
  // existing sha in the common case — but still handle the rare overwrite.
  const existing = await getFile(path).catch(() => null);
  const res = await fetch(`${API_BASE}/repos/${repoPath()}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: data.toString("base64"),
      branch: branch(),
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub putBinaryFile(${path}) failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return { sha: json.content.sha };
}
