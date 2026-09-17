import { Category } from "@/types/menu";

// Add, remove, rename, or reorder categories here. `sortOrder` controls
// display order on the home page (lowest first).
export const categories: Category[] = [
  {
    id: "sandwiches",
    name: "Sandwiches",
    slug: "sandwiches",
    sortOrder: 1,
    image: "/images/menu/tawook-chunks-fries.webp",
    description: "Grilled and crispy sandwiches, wraps, and burgers.",
  },
  {
    id: "farouj",
    name: "Farouj",
    slug: "farouj",
    sortOrder: 2,
    image: "/images/menu/dine-in-spread.webp",
    description: "Whole and half chicken — broasted, gaz, or grilled over charcoal — plus platters.",
  },
  {
    id: "sauces",
    name: "Sauces",
    slug: "sauces",
    sortOrder: 3,
    description: "Our signature sauces.",
  },
  {
    id: "fries",
    name: "Fries",
    slug: "fries",
    sortOrder: 4,
    image: "/images/menu/tawook-chunks-fries.webp",
    description: "Crispy golden fries.",
  },
  {
    id: "drinks",
    name: "Drinks",
    slug: "drinks",
    sortOrder: 5,
    description: "Cold drinks to go with your order.",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getSortedCategories(): Category[] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}
