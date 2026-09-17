"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Category } from "@/types/menu";
import { SafeImage } from "@/components/ui/SafeImage";
import { useSwipe } from "@/hooks/useSwipe";

export function CategoryPageShell({
  category,
  categories,
  children,
}: {
  category: Category;
  categories: Category[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [direction, setDirection] = useState<"left" | "right">("left");

  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const index = sorted.findIndex((c) => c.id === category.id);
  const prev = sorted[(index - 1 + sorted.length) % sorted.length];
  const next = sorted[(index + 1) % sorted.length];

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      setDirection("left");
      router.push(`/category/${next.slug}`);
    },
    onSwipeRight: () => {
      setDirection("right");
      router.push(`/category/${prev.slug}`);
    },
  });

  return (
    <div className="touch-pan-y" {...swipeHandlers}>
      <div className="relative aspect-[16/9] w-full bg-cream-200">
        {category.image && (
          <SafeImage
            src={category.image}
            alt={category.name}
            fill
            sizes="672px"
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />
        <Link
          href="/"
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-xs font-bold text-ink-900 shadow backdrop-blur-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5 7.5 12l7.5-7.5" />
          </svg>
          Back to Menu
        </Link>

        <div className="absolute right-4 top-4 flex items-center gap-1">
          {sorted.map((c) => (
            <span
              key={c.id}
              className={`h-1 rounded-full transition-all duration-300 ${
                c.id === category.id ? "w-4 bg-white" : "w-1 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div key={category.id} className={`px-5 ${direction === "left" ? "slide-from-right" : "slide-from-left"}`}>
        <span className="mt-6 block pt-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-600">
          Our Menu
        </span>
        <h1 className="font-display mt-2 text-6xl leading-[0.9] text-ink-900 sm:text-7xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 max-w-sm text-sm text-ink-900/45">{category.description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
