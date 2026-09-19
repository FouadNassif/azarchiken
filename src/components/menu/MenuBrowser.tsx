"use client";

import { useEffect, useMemo, useState } from "react";
import { Category, MenuItem } from "@/types/menu";
import { SearchFilterBar } from "@/components/menu/SearchFilterBar";
import { MenuItemRow } from "@/components/menu/MenuItemRow";
import { Reveal } from "@/components/ui/Reveal";
import { useSwipe } from "@/hooks/useSwipe";

function matchesQuery(item: MenuItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [item.title, item.description, ...(item.removableIngredients ?? [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function MenuBrowser({
  items,
  categories,
}: {
  items: MenuItem[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

  useEffect(() => {
    // One-time read of the `?q=` search param the header's search box may
    // navigate here with — not a value React itself owns.
    const q = new URLSearchParams(window.location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setQuery(q);
    if (q && q.trim().length >= 2) {
      fetch("/api/track/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
        keepalive: true,
      }).catch(() => {
        // Analytics failing silently should never break search.
      });
    }
  }, []);

  const tabIds = useMemo(() => ["all", ...categories.map((c) => c.id)], [categories]);

  const changeCategory = (id: string, direction: "left" | "right") => {
    setSlideDirection(direction);
    setActiveCategory(id);
  };

  const handleCategoryChange = (id: string) => {
    const fromIndex = tabIds.indexOf(activeCategory);
    const toIndex = tabIds.indexOf(id);
    changeCategory(id, toIndex >= fromIndex ? "left" : "right");
  };

  const goToAdjacentCategory = (offset: 1 | -1) => {
    const currentIndex = tabIds.indexOf(activeCategory);
    const nextIndex = (currentIndex + offset + tabIds.length) % tabIds.length;
    changeCategory(tabIds[nextIndex], offset === 1 ? "left" : "right");
  };

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => goToAdjacentCategory(1),
    onSwipeRight: () => goToAdjacentCategory(-1),
  });

  const filtered = useMemo(() => {
    return items
      .filter((item) => activeCategory === "all" || item.categoryId === activeCategory)
      .filter((item) => matchesQuery(item, query));
  }, [items, activeCategory, query]);

  const isBrowsingAll = activeCategory === "all" && query.trim() === "";

  const grouped = useMemo(() => {
    if (!isBrowsingAll) return null;
    return categories
      .map((category) => ({
        category,
        items: filtered
          .filter((i) => i.categoryId === category.id)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      }))
      .filter((group) => group.items.length > 0);
  }, [isBrowsingAll, categories, filtered]);

  return (
    <div>
      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-600">Browse</span>
      <h2 className="font-display mt-1 text-4xl leading-none text-ink-900">Our Menu</h2>
      <div className="menu-divider mt-2.5">
        <span className="menu-rule" />
        <span className="menu-rule-thin" />
      </div>

      {query.trim() !== "" && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-ink-900/45">Results for &ldquo;{query}&rdquo;</span>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-xs font-semibold text-crimson-600 hover:text-crimson-700"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mt-5">
        <SearchFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <div
        key={activeCategory}
        className={`touch-pan-y mt-6 pb-6 ${slideDirection === "left" ? "slide-from-right" : "slide-from-left"}`}
        {...swipeHandlers}
      >
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-ink-900/40">
            No dishes match &ldquo;{query}&rdquo;. Try another search.
          </p>
        )}

        {grouped
          ? grouped.map((group, gi) => (
              <section key={group.category.id} className={gi > 0 ? "mt-8" : ""}>
                <h3 className="font-display mb-3 text-2xl leading-none text-ink-900">{group.category.name}</h3>
                <div className="flex flex-col gap-2.5">
                  {group.items.map((item, i) => (
                    <Reveal key={item.id} delay={(i % 6) * 40}>
                      <MenuItemRow item={item} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))
          : filtered.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {filtered.map((item, i) => (
                  <Reveal key={item.id} delay={(i % 6) * 40}>
                    <MenuItemRow item={item} />
                  </Reveal>
                ))}
              </div>
            )}
      </div>
    </div>
  );
}
