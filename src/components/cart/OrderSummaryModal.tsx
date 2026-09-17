"use client";

import { useEffect } from "react";
import { CartLine } from "@/types/menu";
import { computeCartTotal, computeLineTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function OrderSummaryModal({
  lines,
  onClose,
}: {
  lines: CartLine[];
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 animate-[fadeIn_150ms_ease-out]"
      />

      <div className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-[slideUp_200ms_ease-out] sm:max-w-md sm:rounded-3xl">
        <div className="flex-none border-b border-ink-900/10 p-5">
          <h2 className="text-lg font-bold text-ink-900">Your Order</h2>
          <p className="text-xs text-ink-900/45">Show this screen to your waiter</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {lines.map((line) => (
            <div key={line.lineId} className="border-b border-ink-900/[0.06] py-3 last:border-none">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-ink-900">
                  {line.quantity}x {line.title}
                </p>
                <p className="text-sm font-bold text-ink-900">{formatPrice(computeLineTotal(line))}</p>
              </div>
              {line.addOns.map((a) => (
                <p key={a.addOnId} className="mt-1 pl-4 text-xs text-ink-900/60">
                  + {a.name} — {formatPrice(a.price)}
                </p>
              ))}
              {line.removedIngredients.map((r) => (
                <p key={r} className="mt-1 pl-4 text-xs text-ink-900/60">
                  − No {r}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="flex-none border-t border-ink-900/10 p-5">
          <div className="flex items-center justify-between text-base font-bold text-ink-900">
            <span>Total</span>
            <span>{formatPrice(computeCartTotal(lines))}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-xl border border-ink-900/15 py-3 text-sm font-semibold text-ink-900/70"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
