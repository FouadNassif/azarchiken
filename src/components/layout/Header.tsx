"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { restaurantConfig } from "@/data/restaurant";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 text-ink-900">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
      )}
    </svg>
  );
}

export function Header() {
  const hidden = useHideOnScroll();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchValue.trim()) return;
    router.push(`/?q=${encodeURIComponent(searchValue.trim())}#full-menu`);
    setSearchOpen(false);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ease-out ${
        hidden && !menuOpen && !searchOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="header-surface border-b border-ink-900/[0.06]">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Link href="/" className="flex flex-col items-start" onClick={() => setMenuOpen(false)}>
            <span className="font-display text-[26px] leading-none tracking-[0.03em] text-ink-900">
              {restaurantConfig.name}
            </span>
            <span className="mt-1 flex items-center gap-1.5">
              <span className="h-[3px] w-4 rounded-full bg-crimson-600" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-ink-900/45">
                Restaurant
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((v) => !v);
                setMenuOpen(false);
              }}
              aria-label="Search menu"
              aria-expanded={searchOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-900 transition-colors hover:bg-ink-900/[0.05]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setSearchOpen(false);
              }}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink-900/[0.05]"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-ink-900/[0.06] transition-[max-height] duration-300 ease-out ${
            searchOpen ? "max-h-20" : "max-h-0"
          }`}
        >
          <form onSubmit={submitSearch} className="mx-auto max-w-2xl px-4 py-3">
            <input
              type="text"
              autoFocus={searchOpen}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search dishes or ingredients…"
              className="w-full rounded-full border border-ink-900/10 bg-cream-200/60 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-900/35 outline-none focus:border-crimson-500 focus:bg-white"
            />
          </form>
        </div>

        <div
          className={`overflow-hidden border-t border-ink-900/[0.06] transition-[max-height] duration-300 ease-out ${
            menuOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          <nav className="mx-auto flex max-w-2xl flex-col px-4 py-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-semibold text-ink-900 hover:bg-ink-900/[0.05]"
            >
              Home
            </Link>
            <Link
              href="/#full-menu"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-semibold text-ink-900 hover:bg-ink-900/[0.05]"
            >
              Menu
            </Link>
            <Link
              href="/restaurant"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-semibold text-ink-900 hover:bg-ink-900/[0.05]"
            >
              Restaurant
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
