import Link from "next/link";
import { restaurantConfig } from "@/data/restaurant";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-900/[0.06] bg-cream-200 text-ink-900">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-3xl leading-none text-ink-900">
              {restaurantConfig.name}
            </p>
            <p className="mt-1 text-sm text-ink-900/45">{restaurantConfig.tagline}</p>
          </div>

          <div className="text-sm text-ink-900/60">
            <p>{restaurantConfig.address}</p>
            <p className="mt-1">{restaurantConfig.phone}</p>
          </div>

          <div className="flex gap-2 text-sm font-medium">
            <Link href="/#full-menu" className="text-ink-900/60 hover:text-crimson-600">
              Menu
            </Link>
            <span className="text-ink-900/25">&bull;</span>
            <Link href="/restaurant" className="text-ink-900/60 hover:text-crimson-600">
              Restaurant
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-ink-900/40">
          &copy; {new Date().getFullYear()} {restaurantConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
