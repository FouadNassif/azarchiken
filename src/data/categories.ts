import { Category } from "@/types/menu";
import categoriesJson from "./json/categories.json";

// The actual data lives in ./json/categories.json — this file just exposes it
// through the same getter functions the rest of the app already uses. Edit
// the JSON file directly, or use the /admin panel.
export const categories: Category[] = categoriesJson as Category[];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getSortedCategories(): Category[] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}
