"use client";

import { useState } from "react";
import { Category, MenuItem } from "@/types/menu";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { slugify, uniqueSlug } from "@/components/admin/slugify";

function blankItem(categoryId: string): MenuItem {
  return {
    id: `new-${Date.now()}`,
    slug: "",
    title: "",
    description: "",
    image: "/images/placeholder.webp",
    categoryId,
    price: 0,
    sortOrder: 1,
    available: true,
  };
}

export function MenuItemsTab({
  items,
  categories,
  onSaved,
}: {
  items: MenuItem[];
  categories: Category[];
  onSaved: (items: MenuItem[]) => void;
}) {
  const [rows, setRows] = useState<MenuItem[]>(items);
  const [filter, setFilter] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function update(id: string, patch: Partial<MenuItem>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    if (!confirm("Remove this item? This can't be undone from here (though it's still in git history).")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function addNew() {
    setRows((prev) => [...prev, blankItem(categories[0]?.id ?? "")]);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const existingSlugs = rows.map((r) => r.slug).filter(Boolean);
      const finalized = rows.map((r, i) => {
        if (r.slug) return r;
        const base = slugify(r.title || "item");
        const slug = uniqueSlug(base, existingSlugs, i);
        return { ...r, id: r.id.startsWith("new-") ? slug : r.id, slug };
      });

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: "menu", data: finalized, message: "Update menu items via /admin" }),
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

  const visible = filter === "all" ? rows : rows.filter((r) => r.categoryId === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addNew}
            className="rounded border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            + Add item
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
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {savedAt && !error && <p className="mt-2 text-sm text-green-600">Saved. Live in ~1 minute once redeployed.</p>}

      <div className="mt-4 flex flex-col gap-3">
        {visible.map((item) => (
          <div key={item.id} className="rounded-lg border border-neutral-200 p-3">
            <div className="flex flex-wrap items-start gap-3">
              <ImageUploadButton
                currentImage={item.image}
                uploadName={item.slug || item.title}
                onUploaded={(path) => update(item.id, { image: path })}
              />

              <div className="grid min-w-[240px] flex-1 grid-cols-2 gap-2">
                <input
                  value={item.title}
                  onChange={(e) => update(item.id, { title: e.target.value })}
                  placeholder="Title"
                  className="col-span-2 rounded border border-neutral-300 px-2 py-1.5 text-sm font-medium"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => update(item.id, { description: e.target.value })}
                  placeholder="Description"
                  rows={2}
                  className="col-span-2 rounded border border-neutral-300 px-2 py-1.5 text-sm"
                />
                <select
                  value={item.categoryId}
                  onChange={(e) => update(item.id, { categoryId: e.target.value })}
                  className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.sortOrder}
                  onChange={(e) => update(item.id, { sortOrder: Number(e.target.value) })}
                  placeholder="Sort order"
                  className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
                />

                <label className="col-span-2 flex items-center gap-1.5 text-xs text-neutral-600">
                  Price (LL)
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => update(item.id, { price: Number(e.target.value) })}
                    className="w-32 rounded border border-neutral-300 px-2 py-1 text-sm"
                  />
                  <span className="ml-3">Special price</span>
                  <input
                    type="number"
                    value={item.specialPrice ?? ""}
                    onChange={(e) =>
                      update(item.id, { specialPrice: e.target.value === "" ? undefined : Number(e.target.value) })
                    }
                    className="w-32 rounded border border-neutral-300 px-2 py-1 text-sm"
                  />
                  <span className="ml-3">Dine-in price</span>
                  <input
                    type="number"
                    value={item.dineInPrice ?? ""}
                    onChange={(e) =>
                      update(item.id, { dineInPrice: e.target.value === "" ? undefined : Number(e.target.value) })
                    }
                    className="w-32 rounded border border-neutral-300 px-2 py-1 text-sm"
                  />
                </label>

                <input
                  value={item.removableIngredients?.join(", ") ?? ""}
                  onChange={(e) =>
                    update(item.id, {
                      removableIngredients: e.target.value
                        ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        : undefined,
                    })
                  }
                  placeholder="Removable ingredients (comma separated)"
                  className="col-span-2 rounded border border-neutral-300 px-2 py-1.5 text-sm"
                />

                <div className="col-span-2 flex flex-wrap items-center gap-4 text-xs text-neutral-600">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={(e) => update(item.id, { available: e.target.checked })}
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={Boolean(item.hotSeller)}
                      onChange={(e) => update(item.id, { hotSeller: e.target.checked })}
                    />
                    Popular badge
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={Boolean(item.bestBuy)}
                      onChange={(e) => update(item.id, { bestBuy: e.target.checked })}
                    />
                    Best Seller badge
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.title || "item"}`}
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
