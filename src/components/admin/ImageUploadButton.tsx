"use client";

import { useRef, useState } from "react";

export function ImageUploadButton({
  currentImage,
  uploadName,
  onUploaded,
}: {
  currentImage?: string;
  /** Used to derive the saved filename, e.g. the item's title or slug. */
  uploadName: string;
  onUploaded: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", uploadName);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onUploaded(json.path);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      {currentImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentImage} alt="" className="h-12 w-12 flex-none rounded object-cover" />
      )}
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        >
          {busy ? "Uploading…" : currentImage ? "Replace photo" : "Upload photo"}
        </button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
