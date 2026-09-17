"use client";

import { CartLine } from "@/types/menu";
import { useCart } from "@/context/CartContext";
import { computeLineTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/ui/SafeImage";

export function CartLineItem({ line }: { line: CartLine }) {
  const { setQuantity, removeLine } = useCart();

  return (
    <div className="flex gap-3 border-b border-ink-900/[0.06] py-4 last:border-none">
      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl bg-cream-200">
        <SafeImage src={line.image} alt={line.title} fill sizes="64px" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-ink-900">{line.title}</p>
          <button
            type="button"
            onClick={() => removeLine(line.lineId)}
            aria-label={`Remove ${line.title}`}
            className="text-ink-900/40 hover:text-crimson-600"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 .6 12a2 2 0 0 0 2 1.9h4.8a2 2 0 0 0 2-1.9L18 7" />
            </svg>
          </button>
        </div>

        {line.addOns.length > 0 && (
          <p className="mt-0.5 text-xs text-ink-900/45">
            + {line.addOns.map((a) => a.name).join(", ")}
          </p>
        )}
        {line.removedIngredients.length > 0 && (
          <p className="mt-0.5 text-xs text-ink-900/45">
            No {line.removedIngredients.join(", ")}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(line.lineId, line.quantity - 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-ink-900/15 text-sm text-ink-900 active:scale-95"
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <span className="w-4 text-center text-sm font-medium text-ink-900">{line.quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(line.lineId, line.quantity + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-ink-900/15 text-sm text-ink-900 active:scale-95"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-sm font-bold text-crimson-600">{formatPrice(computeLineTotal(line))}</span>
        </div>
      </div>
    </div>
  );
}
