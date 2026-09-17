import { CarouselSlide } from "@/types/menu";

// Home page featured carousel. Up to 3 slides are shown at once on desktop
// (one at a time on mobile, swipeable). Reorder with `sortOrder`; change
// `image` and `destination` to point each slide at a menu item, deal,
// category, or arbitrary URL.
export const carouselSlides: CarouselSlide[] = [
  {
    id: "slide-broasted",
    image: "/images/menu/fried-crispy-chicken.webp",
    title: "Broasted Chicken",
    subtitle: "Crispy outside, juicy inside",
    sortOrder: 1,
    destination: { type: "item", slug: "farouj-broasted" },
  },
  {
    id: "slide-fahem",
    image: "/images/menu/grilled-flat-chicken-logo.webp",
    title: "Fahem",
    subtitle: "Grilled over charcoal for a smoky flavor",
    sortOrder: 2,
    destination: { type: "item", slug: "farouj-fahem" },
  },
  {
    id: "slide-shawarma",
    image: "/images/menu/shawarma-spit-logo.webp",
    title: "Shawarma",
    subtitle: "Fresh off the spit",
    sortOrder: 3,
    destination: { type: "category", slug: "sandwiches" },
  },
  {
    id: "slide-farouj",
    image: "/images/menu/dine-in-spread.webp",
    title: "Farouj",
    subtitle: "Whole chicken & platters for the table",
    sortOrder: 4,
    destination: { type: "category", slug: "farouj" },
  },
];

export function getSortedCarouselSlides(): CarouselSlide[] {
  return [...carouselSlides].sort((a, b) => a.sortOrder - b.sortOrder);
}
