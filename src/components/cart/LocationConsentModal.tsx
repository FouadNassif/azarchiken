"use client";

import { useEffect, useState } from "react";
import { CartLine } from "@/types/menu";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function LocationConsentModal({
  lines,
  onClose,
}: {
  lines: CartLine[];
  onClose: () => void;
}) {
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function shareLocation() {
    // Open the tab synchronously, inside this click handler, so popup
    // blockers don't kill it once the (async) geolocation lookup resolves.
    const pending = window.open("", "_blank");

    if (!navigator.geolocation) {
      pending?.close();
      setError("Location isn't available on this device or browser.");
      return;
    }

    setRequesting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const url = buildWhatsAppUrl(lines, {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        if (pending) pending.location.href = url;
        else window.open(url, "_blank", "noopener,noreferrer");
        onClose();
      },
      () => {
        pending?.close();
        setRequesting(false);
        setError("Couldn't get your location — check your browser's location permission, or skip and continue.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function continueWithoutLocation() {
    window.open(buildWhatsAppUrl(lines, null), "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={continueWithoutLocation}
        className="absolute inset-0 bg-black/50 animate-[fadeIn_150ms_ease-out]"
      />

      <div className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white p-5 shadow-2xl animate-[slideUp_200ms_ease-out] sm:max-w-sm sm:rounded-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-crimson-50 text-crimson-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.5-4.2-7-7.8-7-11a7 7 0 1 1 14 0c0 3.2-2.5 6.8-7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </div>

        <h2 className="font-display mt-3 text-2xl leading-none text-ink-900">Share your location?</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-900/60">
          Sending your current location with the order makes it easier for us to find you for delivery. This is
          optional.
        </p>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={shareLocation}
            disabled={requesting}
            className="w-full rounded-md bg-crimson-600 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-md transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {requesting ? "Getting location…" : "Share My Location"}
          </button>
          <button
            type="button"
            onClick={continueWithoutLocation}
            className="w-full rounded-md border border-ink-900/10 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-ink-900 transition-colors hover:bg-cream-200 active:scale-[0.98]"
          >
            Continue Without Location
          </button>
        </div>
      </div>
    </div>
  );
}
