"use client";

import { useEffect, useMemo, useState } from "react";
import { MenuItem } from "@/types/menu";
import { getAddOnsByIds } from "@/data/addons";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/ui/SafeImage";

export function CustomizationModal({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const { addLine } = useCart();
  const availableAddOns = useMemo(() => getAddOnsByIds(item.addOnIds), [item.addOnIds]);
  const unitPrice = item.specialPrice ?? item.price;

  const [quantity, setQuantity] = useState(1);
  const [removed, setRemoved] = useState<string[]>([]);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function toggleRemoved(ingredient: string) {
    setRemoved((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient]
    );
  }

  function toggleAddOn(id: string) {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  const selectedAddOns = availableAddOns.filter((a) => selectedAddOnIds.includes(a.id));
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const lineTotal = (unitPrice + addOnsTotal) * quantity;

  function handleAddToCart() {
    addLine({
      kind: "item",
      refId: item.id,
      title: item.title,
      image: item.image,
      unitPrice,
      quantity,
      removedIngredients: removed,
      addOns: selectedAddOns.map((a) => ({ addOnId: a.id, name: a.name, price: a.price })),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-[fadeIn_150ms_ease-out]"
      />

      <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-[slideUp_200ms_ease-out] sm:max-w-md sm:rounded-2xl">
        <div className="relative aspect-[16/9] w-full flex-none bg-cream-200">
          <SafeImage src={item.image} alt={item.title} fill sizes="480px" className="object-cover" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <h2 className="font-display text-3xl leading-none text-ink-900">{item.title}</h2>
          <p className="mt-1 text-sm text-ink-900/60">{item.description}</p>

          {item.removableIngredients && item.removableIngredients.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-ink-900">Remove ingredients</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.removableIngredients.map((ingredient) => {
                  const active = removed.includes(ingredient);
                  return (
                    <button
                      key={ingredient}
                      type="button"
                      onClick={() => toggleRemoved(ingredient)}
                      className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? "border-crimson-500 bg-crimson-50 text-crimson-600 line-through"
                          : "border-ink-900/15 text-ink-900/70"
                      }`}
                    >
                      {ingredient}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {availableAddOns.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-ink-900">Add-ons</p>
              <div className="mt-2 flex flex-col gap-2">
                {availableAddOns.map((addOn) => {
                  const active = selectedAddOnIds.includes(addOn.id);
                  return (
                    <label
                      key={addOn.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                        active ? "border-crimson-500 bg-crimson-50" : "border-ink-900/10"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-ink-900/80">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleAddOn(addOn.id)}
                          className="h-4 w-4 accent-crimson-600"
                        />
                        {addOn.name}
                      </span>
                      <span className="font-medium text-ink-900/60">
                        +{formatPrice(addOn.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-900">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/15 text-lg font-medium text-ink-900/70 active:scale-95"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/15 text-lg font-medium text-ink-900/70 active:scale-95"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex-none border-t border-ink-900/10 p-4">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-between rounded-md bg-crimson-600 px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-transform active:scale-[0.98]"
          >
            <span>Add to Cart</span>
            <span>{formatPrice(lineTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
