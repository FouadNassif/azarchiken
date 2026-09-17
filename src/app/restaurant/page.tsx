import type { Metadata } from "next";
import { restaurantConfig } from "@/data/restaurant";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: `About — ${restaurantConfig.name}`,
  description: restaurantConfig.description,
};

const heroImage = "/images/restaurant/storefront.webp";
const galleryImages = [
  "/images/menu/dine-in-spread.webp",
  "/images/menu/grilled-flat-chicken-logo.webp",
  "/images/menu/tawook-chunks-fries.webp",
  "/images/menu/fried-crispy-chicken.webp",
];

const FEATURES = [
  {
    label: "Fresh Ingredients",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6m0 0c-3.5 0-6 2.5-6 6a6 6 0 0 0 12 0c0-3.5-2.5-6-6-6Z" />
    ),
  },
  {
    label: "Bold Flavors",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21 8 8h8l1 13M9 8V4h6v4" />
    ),
  },
  {
    label: "Great Vibes",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75 8 16.25l11.5-11.5" />,
  },
];

export default function RestaurantPage() {
  return (
    <div className="mx-auto max-w-2xl pb-4">
      <div className="relative aspect-[4/3] w-full bg-cream-200">
        <SafeImage src={heroImage} alt={restaurantConfig.name} fill sizes="672px" className="object-cover" priority />
      </div>

      <div className="px-5 py-8">
        <Reveal>
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-600">About Us</span>
          <h1 className="font-display mt-2 text-5xl leading-[0.95] text-ink-900 sm:text-6xl">
            More than just a <span className="text-crimson-600">Restaurant</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-900/45">{restaurantConfig.about.story}</p>
        </Reveal>

        <Reveal>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {FEATURES.map((feature) => (
              <div key={feature.label} className="flex flex-col items-center gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-crimson-50 text-crimson-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
                    {feature.icon}
                  </svg>
                </span>
                <span className="text-[11px] font-bold uppercase leading-tight text-ink-900">{feature.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p className="script-signature mt-8 text-center text-2xl text-crimson-600">
            See you at {restaurantConfig.name}
          </p>
        </Reveal>

        <Reveal>
          <section className="mt-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-600">What We Offer</span>
            <ul className="mt-3 grid grid-cols-2 gap-3">
              {restaurantConfig.about.offerings.map((offering) => (
                <li
                  key={offering}
                  className="card-surface flex flex-col items-center gap-2 rounded-xl px-4 py-5 text-center"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-crimson-50 text-crimson-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-xs font-semibold text-ink-900">{offering}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-600">Photos</span>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {galleryImages.map((src) => (
                <div key={src} className="group relative aspect-square overflow-hidden rounded-xl bg-cream-200">
                  <SafeImage
                    src={src}
                    alt="Restaurant photo"
                    fill
                    sizes="240px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6">
          <Reveal>
            <section>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-600">
                Contact &amp; Location
              </span>
              <dl className="mt-3 space-y-1.5 text-sm text-ink-900/60">
                <div className="flex gap-2">
                  <dt className="w-20 flex-none text-ink-900/40">Address</dt>
                  <dd>{restaurantConfig.address}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 flex-none text-ink-900/40">Phone</dt>
                  <dd>
                    <a href={`tel:${restaurantConfig.phone.replace(/\s/g, "")}`} className="hover:text-crimson-600">
                      {restaurantConfig.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 flex-none text-ink-900/40">Email</dt>
                  <dd>
                    <a href={`mailto:${restaurantConfig.email}`} className="hover:text-crimson-600">
                      {restaurantConfig.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <a
                href={restaurantConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-md bg-crimson-600 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-md transition-transform active:scale-95"
              >
                Get Directions
              </a>
            </section>
          </Reveal>

          <Reveal delay={80}>
            <section>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-600">Opening Hours</span>
              <dl className="mt-3 space-y-1 text-sm text-ink-900/60">
                {restaurantConfig.openingHours.map((entry) => (
                  <div key={entry.day} className="flex justify-between border-b border-ink-900/[0.06] py-1.5">
                    <dt>{entry.day}</dt>
                    <dd className="font-medium text-ink-900">{entry.hours}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
