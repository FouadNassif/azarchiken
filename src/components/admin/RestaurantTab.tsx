"use client";

import { useState } from "react";

export interface RestaurantData {
  name: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  social: { instagram: string; facebook: string };
  openingHours: { day: string; hours: string }[];
  about: { story: string; offerings: string[] };
  currency: string;
}

export function RestaurantTab({
  restaurant,
  onSaved,
}: {
  restaurant: RestaurantData;
  onSaved: (r: RestaurantData) => void;
}) {
  const [data, setData] = useState<RestaurantData>(restaurant);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function field<K extends keyof RestaurantData>(key: K, value: RestaurantData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: "restaurant", data, message: "Update restaurant info via /admin" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      onSaved(data);
      setSavedAt(Date.now());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded border border-neutral-300 px-2 py-1.5 text-sm";
  const labelClass = "flex flex-col gap-1 text-xs font-medium text-neutral-600";

  return (
    <div className="max-w-xl">
      <div className="flex justify-end">
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

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className={labelClass}>
          Name
          <input value={data.name} onChange={(e) => field("name", e.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Tagline
          <input value={data.tagline} onChange={(e) => field("tagline", e.target.value)} className={inputClass} />
        </label>
        <label className={`col-span-2 ${labelClass}`}>
          Description
          <textarea
            value={data.description}
            onChange={(e) => field("description", e.target.value)}
            rows={2}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Phone (displayed)
          <input value={data.phone} onChange={(e) => field("phone", e.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          WhatsApp number (digits only, with country code)
          <input
            value={data.whatsappNumber}
            onChange={(e) => field("whatsappNumber", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Email
          <input value={data.email} onChange={(e) => field("email", e.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Currency label
          <input value={data.currency} onChange={(e) => field("currency", e.target.value)} className={inputClass} />
        </label>
        <label className={`col-span-2 ${labelClass}`}>
          Address
          <input value={data.address} onChange={(e) => field("address", e.target.value)} className={inputClass} />
        </label>
        <label className={`col-span-2 ${labelClass}`}>
          Google Maps link
          <input value={data.mapUrl} onChange={(e) => field("mapUrl", e.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Instagram URL
          <input
            value={data.social.instagram}
            onChange={(e) => field("social", { ...data.social, instagram: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Facebook URL
          <input
            value={data.social.facebook}
            onChange={(e) => field("social", { ...data.social, facebook: e.target.value })}
            className={inputClass}
          />
        </label>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-neutral-800">Opening hours</p>
        <div className="mt-2 flex flex-col gap-2">
          {data.openingHours.map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={entry.day}
                onChange={(e) => {
                  const next = [...data.openingHours];
                  next[i] = { ...next[i], day: e.target.value };
                  field("openingHours", next);
                }}
                placeholder="Days"
                className={`${inputClass} flex-1`}
              />
              <input
                value={entry.hours}
                onChange={(e) => {
                  const next = [...data.openingHours];
                  next[i] = { ...next[i], hours: e.target.value };
                  field("openingHours", next);
                }}
                placeholder="Hours"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => field("openingHours", data.openingHours.filter((_, idx) => idx !== i))}
                className="flex-none text-xs text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => field("openingHours", [...data.openingHours, { day: "", hours: "" }])}
            className="self-start text-xs font-medium text-neutral-600 underline"
          >
            + Add row
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-neutral-800">About</p>
        <label className={`mt-2 ${labelClass}`}>
          Story
          <textarea
            value={data.about.story}
            onChange={(e) => field("about", { ...data.about, story: e.target.value })}
            rows={4}
            className={inputClass}
          />
        </label>
        <p className="mt-3 text-xs font-medium text-neutral-600">Offerings</p>
        <div className="mt-1 flex flex-col gap-2">
          {data.about.offerings.map((offering, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={offering}
                onChange={(e) => {
                  const next = [...data.about.offerings];
                  next[i] = e.target.value;
                  field("about", { ...data.about, offerings: next });
                }}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() =>
                  field("about", { ...data.about, offerings: data.about.offerings.filter((_, idx) => idx !== i) })
                }
                className="flex-none text-xs text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => field("about", { ...data.about, offerings: [...data.about.offerings, ""] })}
            className="self-start text-xs font-medium text-neutral-600 underline"
          >
            + Add row
          </button>
        </div>
      </div>
    </div>
  );
}
