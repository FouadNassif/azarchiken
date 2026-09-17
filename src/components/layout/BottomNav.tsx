"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 11.204 3.045a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v6.75M6 3v3.75a2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25V3M8.25 12v9M15.75 3c-1.25 0-2.25 1.5-2.25 4.5S14.5 12 15.75 12s2.25-1.5 2.25-4.5S17 3 15.75 3Zm0 9v9" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.602-7.152.075-.302-.174-.598-.484-.598H5.106M7.5 14.25 5.106 5.25M7.5 14.25 5.5 19.5M6.75 20.25a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm12 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <circle cx="12" cy="8" r="3.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 19.25c1.2-3.2 4-5 7.25-5s6.05 1.8 7.25 5" />
    </svg>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();

  const linkClass = (active: boolean) =>
    `flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${
      active ? "text-crimson-600" : "text-ink-900/40"
    }`;

  return (
    <nav className="nav-surface fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/[0.06] shadow-[0_-6px_18px_-14px_rgba(37,26,19,0.25)] sm:hidden">
      <div className="mx-auto flex max-w-2xl">
        <Link href="/" className={linkClass(pathname === "/")}>
          <HomeIcon />
          Home
        </Link>
        <Link href="/#full-menu" className={linkClass(false)}>
          <MenuIcon />
          Menu
        </Link>
        <button type="button" onClick={openDrawer} className={linkClass(false)}>
          <span className="relative">
            <CartIcon />
            {count > 0 && (
              <span className="pop-in absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson-600 px-1 text-[10px] font-bold text-white shadow-sm">
                {count}
              </span>
            )}
          </span>
          Cart
        </button>
        <Link href="/restaurant" className={linkClass(pathname === "/restaurant")}>
          <ProfileIcon />
          Profile
        </Link>
      </div>
    </nav>
  );
}
