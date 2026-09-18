import { MenuItem } from "@/types/menu";
import menuJson from "./json/menu.json";

// The actual data lives in ./json/menu.json — this file just exposes it
// through the same getter functions the rest of the app already uses. Edit
// the JSON file directly, or use the /admin panel.
export const menuItems: MenuItem[] = menuJson as MenuItem[];

export function getAvailableMenuItems(): MenuItem[] {
  return menuItems.filter((i) => i.available);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((i) => i.id === id);
}

export function getMenuItemBySlug(slug: string): MenuItem | undefined {
  return menuItems.find((i) => i.slug === slug);
}

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return getAvailableMenuItems()
    .filter((i) => i.categoryId === categoryId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
