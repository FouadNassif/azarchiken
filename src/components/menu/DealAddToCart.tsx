"use client";

import { Deal } from "@/types/menu";
import { useCart } from "@/context/CartContext";

export function DealAddToCart({ deal }: { deal: Deal }) {
  const { addLine } = useCart();

  return (
    <button
      type="button"
      onClick={() =>
        addLine({
          kind: "deal",
          refId: deal.id,
          title: deal.title,
          image: deal.image,
          unitPrice: deal.price,
          quantity: 1,
          removedIngredients: [],
          addOns: [],
        })
      }
      className="rounded-md bg-crimson-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-transform active:scale-95"
    >
      Add to Cart
    </button>
  );
}
