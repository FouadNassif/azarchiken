import Link from "next/link";
import { MenuItem } from "@/types/menu";
import { SafeImage } from "@/components/ui/SafeImage";
import { PriceTag } from "@/components/ui/PriceTag";

export function RelatedItems({ items }: { items: MenuItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-600">Goes Well With</span>
      <h2 className="font-display mt-1 text-2xl leading-none text-ink-900">You May Also Like</h2>
      <div className="scrollbar-none -mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
        {items.map((item) => (
          <Link key={item.id} href={`/item/${item.slug}`} className="w-28 flex-none">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-cream-200">
              <SafeImage src={item.image} alt={item.title} fill sizes="112px" className="object-cover" loading="lazy" />
            </div>
            <p className="font-display mt-2 truncate text-lg leading-none text-ink-900">{item.title}</p>
            <div className="mt-0.5">
              <PriceTag price={item.price} specialPrice={item.specialPrice} size="sm" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
