import { MenuItem } from "@/types/menu";
import { MenuItemRow } from "@/components/menu/MenuItemRow";

export function MenuSection({
  id,
  title,
  items,
}: {
  id?: string;
  title: string;
  items: MenuItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24 py-4">
      {title && <h2 className="mb-3 text-lg font-bold text-ink-900">{title}</h2>}
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
