"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderSummaryModal } from "@/components/cart/OrderSummaryModal";
import { LocationConsentModal } from "@/components/cart/LocationConsentModal";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { lines, count, total, isDrawerOpen, closeDrawer } = useCart();
  const [showSummary, setShowSummary] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  if (!isDrawerOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        <button
          type="button"
          aria-label="Close cart"
          onClick={closeDrawer}
          className="absolute inset-0 bg-black/40 animate-[fadeIn_150ms_ease-out]"
        />

        <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-[slideInRight_220ms_ease-out]">
          <div className="flex flex-none items-start justify-between border-b border-ink-900/[0.06] p-5">
            <div>
              <h2 className="font-display text-3xl leading-none text-ink-900">Your Cart</h2>
              <p className="text-xs font-medium text-ink-900/40">
                {count} {count === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close cart"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-900/40 hover:bg-cream-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5">
            {lines.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-900/40">Your cart is empty.</p>
            ) : (
              lines.map((line) => <CartLineItem key={line.lineId} line={line} />)
            )}
          </div>

          {lines.length > 0 && (
            <div className="flex-none border-t border-ink-900/[0.06] p-5">
              <div className="mb-4 flex items-center justify-between text-base font-semibold text-ink-900">
                <span className="uppercase tracking-[0.1em]">Total</span>
                <span className="text-crimson-600">{formatPrice(total)}</span>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowLocationPrompt(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-crimson-600 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-md transition-transform active:scale-[0.98]"
                >
                  Send Order via WhatsApp
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSummary(true)}
                  className="w-full rounded-md border border-ink-900/10 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-ink-900 transition-colors hover:bg-cream-200 active:scale-[0.98]"
                >
                  Show to Waiter
                </button>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="w-full py-1 text-center text-xs font-semibold text-ink-900/40 hover:text-ink-900"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSummary && <OrderSummaryModal lines={lines} onClose={() => setShowSummary(false)} />}
      {showLocationPrompt && (
        <LocationConsentModal lines={lines} onClose={() => setShowLocationPrompt(false)} />
      )}
    </>
  );
}
