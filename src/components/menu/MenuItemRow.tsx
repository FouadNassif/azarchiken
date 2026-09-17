"use client";

import Link from "next/link";
import { MenuItem } from "@/types/menu";
import { SafeImage } from "@/components/ui/SafeImage";
import { PriceTag } from "@/components/ui/PriceTag";
import { CustomizationModal } from "@/components/menu/CustomizationModal";
import { useQuickAdd } from "@/hooks/useQuickAdd";

export function MenuItemRow({ item }: { item: MenuItem }) {
  const { modalOpen, setModalOpen, handleAddClick, justAdded } = useQuickAdd(item);
  const badge = item.hotSeller ? "Popular" : item.bestBuy ? "Best Seller" : null;

  return (
    <>
      <div className="card-surface flex items-center gap-3.5 rounded-xl p-3">
        <Link href={`/item/${item.slug}`} className="flex min-w-0 flex-1 items-center gap-3.5">
          <div className="relative h-24 w-24 flex-none overflow-hidden rounded-lg bg-cream-200">
            <SafeImage src={item.image} alt={item.title} fill sizes="96px" className="object-cover" loading="lazy" />
            {badge && (
              <span className="diner-badge absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide">
                {badge}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-display truncate text-2xl leading-none text-ink-900">{item.title}</h3>
            <p className="mt-1.5 line-clamp-1 text-xs text-ink-900/50">{item.description}</p>
            <div className="mt-2">
              <PriceTag price={item.price} specialPrice={item.specialPrice} dineInPrice={item.dineInPrice} size="sm" />
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleAddClick}
          aria-label={`Add ${item.title} to cart`}
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-full bg-crimson-600 text-white shadow-sm transition-transform active:scale-90 ${
            justAdded ? "scale-110" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} className="h-4 w-4">
            {justAdded ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            )}
          </svg>
        </button>
      </div>

      {modalOpen && <CustomizationModal item={item} onClose={() => setModalOpen(false)} />}
    </>
  );
}
