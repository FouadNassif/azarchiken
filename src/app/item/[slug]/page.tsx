import { notFound } from "next/navigation";
import { menuItems, getMenuItemBySlug, getMenuItemsByCategory } from "@/data/menu";
import { getCategoryById } from "@/data/categories";
import { PriceTag } from "@/components/ui/PriceTag";
import { HotSellerBadge, BestBuyBadge } from "@/components/ui/Badge";
import { ItemAddToCart } from "@/components/menu/ItemAddToCart";
import { ItemImageHeader } from "@/components/menu/ItemImageHeader";
import { RelatedItems } from "@/components/menu/RelatedItems";
import { TrackItemView } from "@/components/menu/TrackItemView";

export function generateStaticParams() {
  return menuItems.map((i) => ({ slug: i.slug }));
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getMenuItemBySlug(slug);
  if (!item || !item.available) notFound();

  const category = getCategoryById(item.categoryId);
  const related = getMenuItemsByCategory(item.categoryId)
    .filter((i) => i.id !== item.id)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <TrackItemView itemId={item.id} />
      <ItemImageHeader
        src={item.image}
        alt={item.title}
        backHref={category ? `/category/${category.slug}` : "/"}
      />

      <div className="px-5">
        <div className="mt-4 flex items-start justify-between gap-3">
          <h1 className="font-display text-4xl leading-none text-ink-900">{item.title}</h1>
          <PriceTag price={item.price} specialPrice={item.specialPrice} dineInPrice={item.dineInPrice} />
        </div>

        {(item.hotSeller || item.bestBuy) && (
          <div className="mt-2 flex gap-1.5">
            {item.hotSeller && <HotSellerBadge />}
            {item.bestBuy && <BestBuyBadge />}
          </div>
        )}

        <p className="mt-3 text-sm leading-relaxed text-ink-900/45">{item.description}</p>

        <div className="mt-6">
          <ItemAddToCart item={item} />
        </div>

        <RelatedItems items={related} />
      </div>
    </div>
  );
}
