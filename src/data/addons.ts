import { AddOn } from "@/types/menu";

// Shared library of add-ons. Menu items reference these by id in their
// `addOnIds` array (see src/data/menu.ts), so an add-on's name/price only
// needs to be edited in one place.
export const addOns: AddOn[] = [
  { id: "extra-cheese", name: "Extra Cheese", price: 1 },
  { id: "extra-chicken", name: "Extra Chicken", price: 3 },
  { id: "extra-sauce", name: "Extra Sauce", price: 0.5 },
  { id: "extra-pickles", name: "Extra Pickles", price: 0.5 },
  { id: "bacon", name: "Bacon", price: 1.5 },
  { id: "fried-egg", name: "Fried Egg", price: 1 },
];

export function getAddOnById(id: string): AddOn | undefined {
  return addOns.find((a) => a.id === id);
}

export function getAddOnsByIds(ids: string[] = []): AddOn[] {
  return ids
    .map((id) => getAddOnById(id))
    .filter((a): a is AddOn => Boolean(a));
}
