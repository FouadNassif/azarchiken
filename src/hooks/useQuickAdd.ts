"use client";

import { useState } from "react";
import { MenuItem } from "@/types/menu";
import { useCart } from "@/context/CartContext";

const hasCustomization = (item: MenuItem) =>
  (item.removableIngredients && item.removableIngredients.length > 0) ||
  (item.addOnIds && item.addOnIds.length > 0);

/** Adds a menu item straight to the cart, or opens the customization modal when the item has removable ingredients or add-ons. */
export function useQuickAdd(item: MenuItem) {
  const { addLine } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  function handleAddClick() {
    if (hasCustomization(item)) {
      setModalOpen(true);
      return;
    }
    addLine({
      kind: "item",
      refId: item.id,
      title: item.title,
      image: item.image,
      unitPrice: item.specialPrice ?? item.price,
      quantity: 1,
      removedIngredients: [],
      addOns: [],
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 700);
  }

  return { modalOpen, setModalOpen, handleAddClick, justAdded };
}
