import { notFound } from "next/navigation";
import { deals, getDealBySlug } from "@/data/deals";
import { getMenuItemById } from "@/data/menu";
import { SafeImage } from "@/components/ui/SafeImage";
import { DealAddToCart } from "@/components/menu/DealAddToCart";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return deals.map((d) => ({ slug: d.slug }));
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deal = getDealBySlug(slug);
  if (!deal || !deal.available) notFound();

  const includedItems = deal.itemIds
    .map((id) => getMenuItemById(id))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-cream-200">
        <SafeImage src={deal.image} alt={deal.title} fill sizes="672px" className="object-cover" priority />
      </div>

      <h1 className="font-display mt-4 text-4xl leading-none text-ink-900">{deal.title}</h1>
      <p className="mt-2 text-sm text-ink-900/45">{deal.description}</p>

      <div className="card-surface mt-4 rounded-xl p-4">
        <p className="text-sm font-semibold text-ink-900">Included</p>
        <ul className="mt-2 space-y-1 text-sm text-ink-900/60">
          {includedItems.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-crimson-600">{formatPrice(deal.price)}</span>
        <DealAddToCart deal={deal} />
      </div>
    </div>
  );
}
