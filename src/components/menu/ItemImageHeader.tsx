"use client";

import Link from "next/link";
import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";

export function ItemImageHeader({
  src,
  alt,
  backHref,
}: {
  src: string;
  alt: string;
  backHref: string;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full bg-cream-200">
      <SafeImage src={src} alt={alt} fill sizes="672px" className="object-cover" priority />

      <Link
        href={backHref}
        aria-label="Back"
        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow backdrop-blur-sm"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5 7.5 12l7.5-7.5" />
        </svg>
      </Link>

      <button
        type="button"
        onClick={() => setLiked((v) => !v)}
        aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={liked}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow backdrop-blur-sm transition-transform active:scale-90"
      >
        <svg
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          className={`h-4.5 w-4.5 ${liked ? "text-crimson-600" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.25c-.3 0-.6-.1-.84-.3C7.9 17.2 3.75 13.6 3.75 9.5 3.75 6.9 5.85 4.75 8.5 4.75c1.44 0 2.8.68 3.5 1.79.7-1.11 2.06-1.79 3.5-1.79 2.65 0 4.75 2.15 4.75 4.75 0 4.1-4.15 7.7-7.41 10.45-.24.2-.54.3-.84.3Z"
          />
        </svg>
      </button>
    </div>
  );
}
