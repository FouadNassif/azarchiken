import { Deal } from "@/types/menu";

const LEBANESE_BURGER_IMAGE = "/images/menu/lebanese-burger.jpg";
const CRISPY_BURGER_IMAGE = "/images/menu/crispy-burger.jpg";
const SHAWARMA_IMAGE = "/images/menu/shawarma-sandwich.jpg";

// Deals bundle multiple menu items (by id, referencing src/data/menu.ts) at a
// fixed combined price. Add, remove, or reorder deals here.
export const deals: Deal[] = [
  {
    id: "lebanese-burger-deal",
    slug: "lebanese-burger-deal",
    title: "2 Lebanese Burgers",
    description: "Two Lebanese burgers, great for sharing.",
    image: LEBANESE_BURGER_IMAGE,
    itemIds: ["lebanese-burger"],
    price: 450_000,
    sortOrder: 1,
    available: true,
  },
  {
    id: "crispy-burger-deal",
    slug: "crispy-burger-deal",
    title: "2 Crispy Burgers",
    description: "Two crispy chicken burgers, great for sharing.",
    image: CRISPY_BURGER_IMAGE,
    itemIds: ["crispy-burger"],
    price: 450_000,
    sortOrder: 2,
    available: true,
  },
  {
    id: "shawarma-deal",
    slug: "shawarma-deal",
    title: "2 Small Shawarma",
    description: "Two small chicken shawarma sandwiches.",
    image: SHAWARMA_IMAGE,
    itemIds: ["shawarma-sandwich"],
    price: 400_000,
    sortOrder: 3,
    available: true,
  },
];

export function getAvailableDeals(): Deal[] {
  return deals
    .filter((d) => d.available)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getDealBySlug(slug: string): Deal | undefined {
  return deals.find((d) => d.slug === slug);
}
