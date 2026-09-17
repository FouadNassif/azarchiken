"use client";

import Link from "next/link";
import { Deal } from "@/types/menu";
import { getMenuItemById } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/ui/SafeImage";

export function DealCard({ deal }: { deal: Deal }) {
  const { addLine } = useCart();
  const includedTitles = deal.itemIds
    .map((id) => getMenuItemById(id)?.title)
    .filter((t): t is string => Boolean(t));

  function handleAdd() {
    addLine({
      kind: "deal",
      refId: deal.id,
      title: deal.title,
      image: deal.image,
      unitPrice: deal.price,
      quantity: 1,
      removedIngredients: [],
      addOns: [],
    });
  }

  return (
    <div className="card-surface group w-[72vw] flex-none overflow-hidden rounded-xl sm:w-72">
      <Link href={`/deal/${deal.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-cream-200">
        <SafeImage
          src={deal.image}
          alt={deal.title}
          fill
          sizes="320px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <span className="diner-badge absolute left-3 top-3 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
          Deal
        </span>
      </Link>
      <div className="p-3.5">
        <h3 className="font-display truncate text-2xl leading-none text-ink-900">{deal.title}</h3>
        {includedTitles.length > 0 && (
          <p className="mt-1 line-clamp-1 text-xs text-ink-900/50">{includedTitles.join(" + ")}</p>
        )}
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-base font-bold text-crimson-600">{formatPrice(deal.price)}</span>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${deal.title} to cart`}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-crimson-600 text-white transition-transform active:scale-90"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
