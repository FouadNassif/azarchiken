import { CartLine, SelectedAddOn } from "@/types/menu";

export function computeLineTotal(line: Pick<CartLine, "unitPrice" | "quantity" | "addOns">): number {
  const addOnsTotal = line.addOns.reduce((sum, a) => sum + a.price, 0);
  return (line.unitPrice + addOnsTotal) * line.quantity;
}

export function computeCartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + computeLineTotal(line), 0);
}

export function computeCartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function makeLineId(
  refId: string,
  removedIngredients: string[],
  addOns: SelectedAddOn[]
): string {
  const removed = [...removedIngredients].sort().join(",");
  const addons = [...addOns]
    .map((a) => a.addOnId)
    .sort()
    .join(",");
  return `${refId}|${removed}|${addons}`;
}
