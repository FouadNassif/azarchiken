"use client";

import { useState } from "react";
import { MenuItem } from "@/types/menu";
import { useCart } from "@/context/CartContext";
import { CustomizationModal } from "@/components/menu/CustomizationModal";

const hasCustomization = (item: MenuItem) =>
  (item.removableIngredients && item.removableIngredients.length > 0) ||
  (item.addOnIds && item.addOnIds.length > 0);

export function ItemAddToCart({ item }: { item: MenuItem }) {
  const { addLine } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const customizable = hasCustomization(item);

  function handleAddClick() {
    if (customizable) {
      setModalOpen(true);
      return;
    }
    addLine({
      kind: "item",
      refId: item.id,
      title: item.title,
      image: item.image,
      unitPrice: item.specialPrice ?? item.price,
      quantity,
      removedIngredients: [],
      addOns: [],
    });
    setQuantity(1);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {!customizable && (
          <div className="flex flex-none items-center gap-3 rounded-md border border-ink-900/10 px-1 py-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-medium text-ink-900 transition-colors hover:bg-cream-200 active:scale-95"
            >
              &minus;
            </button>
            <span className="w-4 text-center text-sm font-bold text-ink-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-medium text-ink-900 transition-colors hover:bg-cream-200 active:scale-95"
            >
              +
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-crimson-600 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-md transition-transform active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.602-7.152.075-.302-.174-.598-.484-.598H5.106M7.5 14.25 5.106 5.25M7.5 14.25 5.5 19.5M6.75 20.25a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm12 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          {customizable ? "Customize & Add" : "Add to Cart"}
        </button>
      </div>
      {modalOpen && <CustomizationModal item={item} onClose={() => setModalOpen(false)} />}
    </>
  );
}
