"use client";

import { useState } from "react";
import { Category } from "@/types/menu";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { slugify, uniqueSlug } from "@/components/admin/slugify";

function blankCategory(): Category {
  return { id: `new-${Date.now()}`, name: "", slug: "", sortOrder: 1 };
}

export function CategoriesTab({
  categories,
  onSaved,
}: {
  categories: Category[];
  onSaved: (categories: Category[]) => void;
}) {
  const [rows, setRows] = useState<Category[]>(categories);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function update(id: string, patch: Partial<Category>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    if (!confirm("Remove this category? Any menu items in it will be orphaned until reassigned.")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const existingSlugs = rows.map((r) => r.slug).filter(Boolean);
      const finalized = rows.map((r, i) => {
        if (r.slug) return r;
        const base = slugify(r.name || "category");
        const slug = uniqueSlug(base, existingSlugs, i);
        return { ...r, id: r.id.startsWith("new-") ? slug : r.id, slug };
      });

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: "categories", data: finalized, message: "Update categories via /admin" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setRows(finalized);
      onSaved(finalized);
      setSavedAt(Date.now());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, blankCategory()])}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          + Add category
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-crimson-600 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {savedAt && !error && <p className="mt-2 text-sm text-green-600">Saved. Live in ~1 minute once redeployed.</p>}

      <div className="mt-4 flex flex-col gap-3">
        {rows.map((cat) => (
          <div key={cat.id} className="rounded-lg border border-neutral-200 p-3">
            <div className="flex flex-wrap items-start gap-3">
              <ImageUploadButton
                currentImage={cat.image}
                uploadName={cat.slug || cat.name}
                onUploaded={(path) => update(cat.id, { image: path })}
              />
              <div className="grid min-w-[240px] flex-1 grid-cols-2 gap-2">
                <input
                  value={cat.name}
                  onChange={(e) => update(cat.id, { name: e.target.value })}
                  placeholder="Name"
                  className="rounded border border-neutral-300 px-2 py-1.5 text-sm font-medium"
                />
                <input
                  type="number"
                  value={cat.sortOrder}
                  onChange={(e) => update(cat.id, { sortOrder: Number(e.target.value) })}
                  placeholder="Sort order"
                  className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
                />
                <input
                  value={cat.description ?? ""}
                  onChange={(e) => update(cat.id, { description: e.target.value })}
                  placeholder="Short description"
                  className="col-span-2 rounded border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(cat.id)}
                className="ml-auto flex-none rounded border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
