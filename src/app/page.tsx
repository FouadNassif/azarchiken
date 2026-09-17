import { Hero } from "@/components/home/Hero";
import { DealRow } from "@/components/menu/DealRow";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { getSortedCarouselSlides } from "@/data/carousel";
import { getSortedCategories } from "@/data/categories";
import { getAvailableMenuItems } from "@/data/menu";
import { getAvailableDeals } from "@/data/deals";

export default function HomePage() {
  const slides = getSortedCarouselSlides();
  const dealsList = getAvailableDeals();
  const categoryList = getSortedCategories();
  const allItems = getAvailableMenuItems();

  return (
    <div>
      <Hero slides={slides} />

      <div className="mx-auto max-w-2xl px-5 pt-8">
        <DealRow id="deals" deals={dealsList} />

        <div id="full-menu" className="scroll-mt-24 pt-2 pb-10">
          <MenuBrowser items={allItems} categories={categoryList} />
        </div>
      </div>
    </div>
  );
}
