"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Category } from "@/types/menu";

export function SearchFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}) {
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const el = buttonRefs.current.get(activeCategory);
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeCategory, categories]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    // Skip on mount — scrollIntoView would otherwise drag the whole page down
    // to reveal the pill row (it starts below the fold, under the hero),
    // which looks like the page loaded scrolled to the menu instead of the top.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const el = buttonRefs.current.get(activeCategory);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeCategory]);

  const tab = (id: string, label: string) => (
    <button
      key={id}
      ref={(el) => {
        if (el) buttonRefs.current.set(id, el);
      }}
      type="button"
      onClick={() => onCategoryChange(id)}
      className={`relative flex-none pb-2.5 text-sm font-bold uppercase tracking-wide transition-colors duration-300 ${
        activeCategory === id ? "text-ink-900" : "text-ink-900/40 hover:text-ink-900/70"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="scrollbar-none relative flex gap-6 overflow-x-auto border-b border-ink-900/10">
      {indicator && (
        <div className="nav-underline" style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }} />
      )}
      {tab("all", "All")}
      {categories.map((category) => tab(category.id, category.name))}
    </div>
  );
}
