"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CarouselSlide } from "@/types/menu";
import { SafeImage } from "@/components/ui/SafeImage";
import { useSwipe } from "@/hooks/useSwipe";

const AUTO_ADVANCE_MS = 5000;

export function Hero({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length || 1;

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => setIndex((i) => (i + 1) % count),
    onSwipeRight: () => setIndex((i) => (i - 1 + count) % count),
  });

  return (
    <section className="relative overflow-hidden bg-ink-900" {...swipeHandlers}>
      <div className="relative aspect-[5/6] w-full sm:aspect-[16/8]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <SafeImage
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
        {/* Warm cinematic scrim (black + a touch of burgundy) rather than a flat charcoal fade. */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-crimson-900/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:pb-10">
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">
            Fresh <span className="text-crimson-400">&bull;</span> Crispy <span className="text-crimson-400">&bull;</span> Delicious
          </span>
          <h1 className="font-display mt-3 max-w-sm text-7xl leading-[0.92] text-white sm:text-8xl">
            Bigger Bites
            <br />
            <span className="text-crimson-400">Better Days</span>
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75">
            Fresh ingredients. Bold flavors.
          </p>
          <Link
            href="#full-menu"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-crimson-600 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-transform active:scale-95"
          >
            Explore Our Menu
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          {slides.length > 1 && (
            <div className="mt-7 flex items-center gap-1.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-crimson-400" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
