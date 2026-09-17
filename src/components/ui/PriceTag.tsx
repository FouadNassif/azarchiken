import { formatPrice } from "@/lib/format";

export function PriceTag({
  price,
  specialPrice,
  dineInPrice,
  size = "md",
}: {
  price: number;
  specialPrice?: number;
  dineInPrice?: number;
  size?: "sm" | "md";
}) {
  const priceClass = size === "sm" ? "text-base" : "text-xl";
  const regularClass = size === "sm" ? "text-xs" : "text-sm";

  const mainPrice =
    specialPrice != null && specialPrice < price ? (
      <span className="inline-flex items-baseline gap-1.5">
        <span className={`${regularClass} text-ink-900/40 line-through`}>{formatPrice(price)}</span>
        <span className={`${priceClass} font-extrabold text-crimson-600`}>{formatPrice(specialPrice)}</span>
      </span>
    ) : (
      <span className={`${priceClass} font-extrabold text-crimson-600`}>{formatPrice(price)}</span>
    );

  if (!dineInPrice) return mainPrice;

  return (
    <span className="inline-flex flex-col">
      {mainPrice}
      <span className="text-[11px] text-ink-900/40">Dine-in: {formatPrice(dineInPrice)}</span>
    </span>
  );
}
