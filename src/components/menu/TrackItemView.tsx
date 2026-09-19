"use client";

import { useEffect } from "react";

/** Fires a de-duplicated (per visitor per day) view count for this item. Renders nothing. */
export function TrackItemView({ itemId }: { itemId: string }) {
  useEffect(() => {
    fetch("/api/track/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
      keepalive: true,
    }).catch(() => {
      // Analytics failing silently should never break the page.
    });
  }, [itemId]);

  return null;
}
