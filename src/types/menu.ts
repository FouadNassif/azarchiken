// Core content types for the menu, deals, and cart.
// Editing menu content only ever touches files in `src/data/` — never these types
// or the UI components.

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  /** Card/banner photo shown on the home menu grid and category page. */
  image?: string;
  /** Short blurb shown under the category title. */
  description?: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  /** Delivery/takeaway price — what's charged when ordering through this site. */
  price: number;
  specialPrice?: number;
  /** Some whole chicken items cost more eaten in-house; shown as extra info, not charged via the cart. */
  dineInPrice?: number;
  sortOrder: number;
  hotSeller?: boolean;
  bestBuy?: boolean;
  available: boolean;
  /** Ingredients the customer can choose to remove. */
  removableIngredients?: string[];
  /** Add-on ids available for this item, referencing `src/data/addons.ts`. */
  addOnIds?: string[];
}

export interface Deal {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  /** Menu item ids included in this deal. */
  itemIds: string[];
  price: number;
  sortOrder: number;
  available: boolean;
}

export type CarouselDestination =
  | { type: "item"; slug: string }
  | { type: "deal"; slug: string }
  | { type: "category"; slug: string }
  | { type: "url"; href: string };

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  sortOrder: number;
  destination: CarouselDestination;
}

export interface SelectedAddOn {
  addOnId: string;
  name: string;
  price: number;
}

/** A single line in the cart: either a customized menu item or a deal. */
export interface CartLine {
  /** Unique id for this cart line (not the product id — lets identical items with different customizations coexist). */
  lineId: string;
  kind: "item" | "deal";
  refId: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  removedIngredients: string[];
  addOns: SelectedAddOn[];
}
