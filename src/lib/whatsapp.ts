import { restaurantConfig } from "@/data/restaurant";
import { CartLine } from "@/types/menu";
import { computeCartTotal, computeLineTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export interface OrderLocation {
  lat: number;
  lng: number;
}

export function buildOrderMessage(lines: CartLine[], location?: OrderLocation | null): string {
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

  if (location) {
    parts.push("", `📍 My location: https://www.google.com/maps?q=${location.lat},${location.lng}`);
  }

  return parts.join("\n");
}

export function buildWhatsAppUrl(lines: CartLine[], location?: OrderLocation | null): string {
  const message = buildOrderMessage(lines, location);
  return `https://wa.me/${restaurantConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
