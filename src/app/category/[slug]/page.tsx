import { notFound } from "next/navigation";
import { getCategoryBySlug, getSortedCategories } from "@/data/categories";
import { getMenuItemsByCategory } from "@/data/menu";
import { MenuSection } from "@/components/menu/MenuSection";
import { CategoryPageShell } from "@/components/menu/CategoryPageShell";

export function generateStaticParams() {
  return getSortedCategories().map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const items = getMenuItemsByCategory(category.id);
  const categories = getSortedCategories();

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <CategoryPageShell category={category} categories={categories}>
        <MenuSection title="" items={items} />
      </CategoryPageShell>
    </div>
  );
}
