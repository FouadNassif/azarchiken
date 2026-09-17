"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

/**
 * Wraps next/image with a graceful fallback for menu photos that haven't
 * been added yet, so the site still looks complete before real images exist.
 */
export function SafeImage({ alt, className, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-ink-900/40 ${className ?? ""}`}
        aria-label={alt}
        role="img"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5V7.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="m3 16 5-5 4 4 3-3 6 6" />
          <circle cx="8" cy="9" r="1.25" />
        </svg>
      </div>
    );
  }

  // External stock photos (temporary, until real photos are added) are served
  // as-is by the browser instead of round-tripping through the Next.js image
  // optimizer, which is unnecessary for already-sized remote images.
  const isRemote = typeof props.src === "string" && props.src.startsWith("http");

  return (
    <Image
      alt={alt}
      className={className}
      unoptimized={isRemote}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
