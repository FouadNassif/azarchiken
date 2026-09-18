import { Deal } from "@/types/menu";
import dealsJson from "./json/deals.json";

// The actual data lives in ./json/deals.json — this file just exposes it
// through the same getter functions the rest of the app already uses. Edit
// the JSON file directly, or use the /admin panel.
export const deals: Deal[] = dealsJson as Deal[];

export function getAvailableDeals(): Deal[] {
  return deals
    .filter((d) => d.available)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getDealBySlug(slug: string): Deal | undefined {
  return deals.find((d) => d.slug === slug);
}
