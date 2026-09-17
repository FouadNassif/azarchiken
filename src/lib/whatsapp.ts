import { restaurantConfig } from "@/data/restaurant";
import { CartLine } from "@/types/menu";
import { computeCartTotal, computeLineTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function buildOrderMessage(lines: CartLine[]): string {
  const parts: string[] = ["Hello, I would like to order:", ""];

  for (const line of lines) {
    parts.push(`${line.quantity}x ${line.title} - ${formatPrice(computeLineTotal(line))}`);
    for (const addOn of line.addOns) {
      parts.push(`  + ${addOn.name} - ${formatPrice(addOn.price)}`);
    }
    for (const removed of line.removedIngredients) {
      parts.push(`  - No ${removed}`);
    }
  }

  parts.push("", `Total: ${formatPrice(computeCartTotal(lines))}`);

  return parts.join("\n");
}

export function buildWhatsAppUrl(lines: CartLine[]): string {
  const message = buildOrderMessage(lines);
  return `https://wa.me/${restaurantConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
