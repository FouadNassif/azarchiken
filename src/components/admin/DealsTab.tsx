"use client";

import { useState } from "react";
import { Deal, MenuItem } from "@/types/menu";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { slugify, uniqueSlug } from "@/components/admin/slugify";

function blankDeal(): Deal {
  return {
    id: `new-${Date.now()}`,
    slug: "",
    title: "",
    description: "",
    image: "/images/placeholder.webp",
    itemIds: [],
    price: 0,
    sortOrder: 1,
    available: true,
  };
}

export function DealsTab({
  deals,
  menuItems,
  onSaved,
}: {
  deals: Deal[];
  menuItems: MenuItem[];
  onSaved: (deals: Deal[]) => void;
}) {
  const [rows, setRows] = useState<Deal[]>(deals);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function update(id: string, patch: Partial<Deal>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    if (!confirm("Remove this deal?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function toggleItem(dealId: string, itemId: string, checked: boolean) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === dealId
          ? { ...r, itemIds: checked ? [...r.itemIds, itemId] : r.itemIds.filter((i) => i !== itemId) }
          : r
      )
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const existingSlugs = rows.map((r) => r.slug).filter(Boolean);
      const finalized = rows.map((r, i) => {
        if (r.slug) return r;
        const base = slugify(r.title || "deal");
        const slug = uniqueSlug(base, existingSlugs, i);
        return { ...r, id: r.id.startsWith("new-") ? slug : r.id, slug };
      });

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: "deals", data: finalized, message: "Update deals via /admin" }),
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
          onClick={() => setRows((prev) => [...prev, blankDeal()])}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          + Add deal
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
        {rows.map((deal) => (
          <div key={deal.id} className="rounded-lg border border-neutral-200 p-3">
            <div className="flex flex-wrap items-start gap-3">
              <ImageUploadButton
                currentImage={deal.image}
                uploadName={deal.slug || deal.title}
                onUploaded={(path) => update(deal.id, { image: path })}
              />
              <div className="grid min-w-[240px] flex-1 grid-cols-2 gap-2">
                <input
                  value={deal.title}
                  onChange={(e) => update(deal.id, { title: e.target.value })}
                  placeholder="Title"
                  className="col-span-2 rounded border border-neutral-300 px-2 py-1.5 text-sm font-medium"
                />
                <textarea
                  value={deal.description}
                  onChange={(e) => update(deal.id, { description: e.target.value })}
                  placeholder="Description"
                  rows={2}
                  className="col-span-2 rounded border border-neutral-300 px-2 py-1.5 text-sm"
                />
                <label className="flex items-center gap-1.5 text-xs text-neutral-600">
                  Price (LL)
                  <input
                    type="number"
                    value={deal.price}
                    onChange={(e) => update(deal.id, { price: Number(e.target.value) })}
                    className="w-32 rounded border border-neutral-300 px-2 py-1 text-sm"
                  />
                </label>
                <input
                  type="number"
                  value={deal.sortOrder}
                  onChange={(e) => update(deal.id, { sortOrder: Number(e.target.value) })}
                  placeholder="Sort order"
                  className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
                />

                <div className="col-span-2">
                  <p className="mb-1 text-xs font-medium text-neutral-600">Included items</p>
                  <div className="flex flex-wrap gap-2">
                    {menuItems.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                          deal.itemIds.includes(item.id)
                            ? "border-crimson-500 bg-crimson-50 text-crimson-700"
                            : "border-neutral-200 text-neutral-500"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={deal.itemIds.includes(item.id)}
                          onChange={(e) => toggleItem(deal.id, item.id, e.target.checked)}
                          className="h-3 w-3"
                        />
                        {item.title}
                      </label>
                    ))}
                  </div>
                </div>

                <label className="col-span-2 flex items-center gap-1.5 text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={deal.available}
                    onChange={(e) => update(deal.id, { available: e.target.checked })}
                  />
                  Available
                </label>
              </div>
              <button
                type="button"
                onClick={() => remove(deal.id)}
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
