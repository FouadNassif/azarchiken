export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

/** Appends -2, -3, etc. until the slug doesn't collide with an existing one. */
export function uniqueSlug(base: string, existing: string[], ignoreIndex?: number): string {
  let candidate = base;
  let n = 2;
  const taken = new Set(existing.filter((_, i) => i !== ignoreIndex));
  while (taken.has(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}
