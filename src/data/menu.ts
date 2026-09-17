import { MenuItem } from "@/types/menu";

// ---------------------------------------------------------------------------
// All menu items live in this one array. To edit the menu:
//   - Add an item:     push a new object below
//   - Remove an item:  delete its object
//   - Change price:    edit `price` (in LL, this is the delivery/takeaway
//                       price charged via the cart) / `specialPrice` /
//                       `dineInPrice` (shown as extra info only, not charged)
//   - Change image:    edit `image` — a file in /public/images/menu/
//   - Change category: edit `categoryId` (must match an id in categories.ts)
//   - Reorder:         edit `sortOrder` (lower shows first within its category)
//   - Hot Seller / Best Buy: toggle `hotSeller` / `bestBuy`
// ---------------------------------------------------------------------------

const PLACEHOLDER_IMAGE = "/images/placeholder.webp";

// Real Azar Chicken photography.
const ROASTED_CHICKEN_IMAGE = "/images/menu/whole-chicken-roasted.webp"; // spice-rubbed, jointed whole chicken
const TAWOOK_IMAGE = "/images/menu/tawook-chunks-fries.webp"; // grilled chicken cubes + fries
const SHAWARMA_IMAGE = "/images/menu/shawarma-spit-logo.webp"; // shawarma spit, branded
const CRISPY_IMAGE = "/images/menu/fried-crispy-chicken.webp"; // breaded fried chicken
const FAHEM_IMAGE = "/images/menu/grilled-flat-chicken-logo.webp"; // charcoal-grilled, branded

export const menuItems: MenuItem[] = [
  // --- Sandwiches ---------------------------------------------------------
  {
    id: "djej-sandwich",
    slug: "djej-sandwich",
    title: "Djej Sandwich",
    description: "Grilled chicken sandwich with garlic sauce and pickles.",
    image: "/images/menu/djej-sandwich.jpg",
    categoryId: "sandwiches",
    price: 500_000,
    sortOrder: 1,
    hotSeller: true,
    available: true,
  },
  {
    id: "asbe-sandwich",
    slug: "asbe-sandwich",
    title: "Asbe Sandwich",
    description: "Crispy chicken finger sandwich with pickles and sauce.",
    image: CRISPY_IMAGE,
    categoryId: "sandwiches",
    price: 500_000,
    sortOrder: 2,
    available: true,
  },
  {
    id: "crispy-sandwich",
    slug: "crispy-sandwich",
    title: "Crispy Sandwich",
    description: "Crispy fried chicken sandwich with pickles and sauce.",
    image: "/images/menu/crispy-sandwich.jpg",
    categoryId: "sandwiches",
    price: 500_000,
    sortOrder: 3,
    available: true,
  },
  {
    id: "tawook-sandwich",
    slug: "tawook-sandwich",
    title: "Tawook Sandwich",
    description: "Charcoal-grilled chicken tawook with garlic sauce.",
    image: "/images/menu/tawook-sandwich.jpg",
    categoryId: "sandwiches",
    price: 500_000,
    sortOrder: 4,
    available: true,
  },
  {
    id: "batata-sandwich",
    slug: "batata-sandwich",
    title: "Batata Sandwich",
    description: "Crispy potato sandwich with garlic sauce and ketchup.",
    image: "/images/menu/batata-sandwich.jpg",
    categoryId: "sandwiches",
    price: 300_000,
    sortOrder: 5,
    available: true,
  },
  {
    id: "shawarma-sandwich",
    slug: "shawarma-sandwich",
    title: "Shawarma Sandwich",
    description: "Classic chicken shawarma wrap with pickles, garlic, and fries.",
    image: "/images/menu/shawarma-sandwich.jpg",
    categoryId: "sandwiches",
    price: 600_000,
    sortOrder: 6,
    bestBuy: true,
    available: true,
  },
  {
    id: "kafta-sandwich",
    slug: "kafta-sandwich",
    title: "Kafta Sandwich",
    description: "Grilled kafta sandwich with tomato, parsley, and tahini.",
    image: "/images/menu/kafta-sandwich.jpg",
    categoryId: "sandwiches",
    price: 500_000,
    sortOrder: 7,
    available: true,
  },
  {
    id: "lebanese-burger",
    slug: "lebanese-burger",
    title: "Lebanese Burger",
    description: "Classic beef burger with lettuce, tomato, and pickles.",
    image: "/images/menu/lebanese-burger.jpg",
    categoryId: "sandwiches",
    price: 400_000,
    sortOrder: 8,
    available: true,
  },
  {
    id: "crispy-burger",
    slug: "crispy-burger",
    title: "Crispy Burger",
    description: "Crispy chicken burger with lettuce, pickles, and sauce.",
    image: "/images/menu/crispy-burger.jpg",
    categoryId: "sandwiches",
    price: 400_000,
    sortOrder: 9,
    available: true,
  },

  // --- Farouj (whole & half chicken, plus platters) -----------------------
  // Whole Farouj items have two prices: `price` is delivery/takeaway (what's
  // charged through this site), `dineInPrice` is what it costs to eat in.
  {
    id: "farouj-gaz",
    slug: "farouj-gaz",
    title: "Farouj Gaz",
    description: "Whole chicken slow-roasted on the rotisserie.",
    image: ROASTED_CHICKEN_IMAGE,
    categoryId: "farouj",
    price: 1_200_000,
    dineInPrice: 1_600_000,
    sortOrder: 1,
    available: true,
  },
  {
    id: "farouj-broasted",
    slug: "farouj-broasted",
    title: "Farouj Broasted",
    description: "Whole broasted chicken, crispy outside and juicy inside.",
    image: CRISPY_IMAGE,
    categoryId: "farouj",
    price: 1_600_000,
    dineInPrice: 1_900_000,
    sortOrder: 2,
    hotSeller: true,
    available: true,
  },
  {
    id: "farouj-fahem",
    slug: "farouj-fahem",
    title: "Farouj Fahem",
    description: "Whole chicken grilled over charcoal for a smoky flavor.",
    image: FAHEM_IMAGE,
    categoryId: "farouj",
    price: 1_400_000,
    dineInPrice: 1_700_000,
    sortOrder: 3,
    available: true,
  },
  {
    id: "gaz-half",
    slug: "gaz-half",
    title: "Half Gaz",
    description: "Half chicken slow-roasted on the rotisserie.",
    image: ROASTED_CHICKEN_IMAGE,
    categoryId: "farouj",
    price: 650_000,
    sortOrder: 4,
    available: true,
  },
  {
    id: "broasted-half",
    slug: "broasted-half",
    title: "Half Broasted",
    description: "Half broasted chicken, crispy outside and juicy inside.",
    image: CRISPY_IMAGE,
    categoryId: "farouj",
    price: 850_000,
    sortOrder: 5,
    bestBuy: true,
    available: true,
  },
  {
    id: "fahem-half",
    slug: "fahem-half",
    title: "Half Fahem",
    description: "Half chicken grilled over charcoal for a smoky flavor.",
    image: FAHEM_IMAGE,
    categoryId: "farouj",
    price: 750_000,
    sortOrder: 6,
    available: true,
  },
  {
    id: "plat-shawarma",
    slug: "plat-shawarma",
    title: "Plat Shawarma",
    description: "Chicken shawarma platter, served dine-in with sides.",
    image: SHAWARMA_IMAGE,
    categoryId: "farouj",
    price: 1_000_000,
    sortOrder: 7,
    bestBuy: true,
    available: true,
  },
  {
    id: "plat-tawook",
    slug: "plat-tawook",
    title: "Plat Tawook",
    description: "Chicken tawook platter, served dine-in with sides.",
    image: TAWOOK_IMAGE,
    categoryId: "farouj",
    price: 1_000_000,
    sortOrder: 8,
    available: true,
  },

  // --- Sauces ---------------------------------------------------------------
  {
    id: "garlic-sauce",
    slug: "garlic-sauce",
    title: "Garlic Sauce",
    description: "Our signature garlic sauce.",
    image: PLACEHOLDER_IMAGE,
    categoryId: "sauces",
    price: 100_000,
    sortOrder: 1,
    available: true,
  },

  // --- Fries ---------------------------------------------------------------
  {
    id: "fries-small",
    slug: "fries-small",
    title: "Fries (Small)",
    description: "Crispy golden fries, lightly salted.",
    image: TAWOOK_IMAGE,
    categoryId: "fries",
    price: 350_000,
    sortOrder: 1,
    available: true,
  },
  {
    id: "fries-medium",
    slug: "fries-medium",
    title: "Fries (Medium)",
    description: "Crispy golden fries, lightly salted.",
    image: TAWOOK_IMAGE,
    categoryId: "fries",
    price: 500_000,
    sortOrder: 2,
    available: true,
  },
  {
    id: "fries-large",
    slug: "fries-large",
    title: "Fries (Large)",
    description: "Crispy golden fries, lightly salted.",
    image: TAWOOK_IMAGE,
    categoryId: "fries",
    price: 700_000,
    sortOrder: 3,
    available: true,
  },

  // --- Drinks ----------------------------------------------------------------
  {
    id: "pepsi",
    slug: "pepsi",
    title: "Pepsi",
    description: "Chilled can of Pepsi.",
    image: PLACEHOLDER_IMAGE,
    categoryId: "drinks",
    price: 100_000,
    sortOrder: 1,
    available: true,
  },
  {
    id: "pepsi-1l",
    slug: "pepsi-1l",
    title: "Pepsi (1L)",
    description: "1 liter bottle of Pepsi.",
    image: PLACEHOLDER_IMAGE,
    categoryId: "drinks",
    price: 150_000,
    sortOrder: 2,
    available: true,
  },
  {
    id: "water-small",
    slug: "water-small",
    title: "Water (Small)",
    description: "Small bottle of water.",
    image: PLACEHOLDER_IMAGE,
    categoryId: "drinks",
    price: 50_000,
    sortOrder: 3,
    available: true,
  },
];

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
