"use client";

import { useEffect, useState } from "react";
import { Category, Deal, MenuItem } from "@/types/menu";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";
import { MenuItemsTab } from "@/components/admin/MenuItemsTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { DealsTab } from "@/components/admin/DealsTab";
import { RestaurantTab, RestaurantData } from "@/components/admin/RestaurantTab";

type Tab = "analytics" | "menu" | "categories" | "deals" | "restaurant";

interface AdminData {
  categories: Category[];
  menu: MenuItem[];
  deals: Deal[];
  restaurant: RestaurantData;
  usingGitHub: boolean;
}

const ICONS: Record<Tab, React.ReactNode> = {
  analytics: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h3v6H3v-6Zm7.5-6h3v12h-3v-12Zm7.5 3h3v9h-3v-9Z" />
  ),
  menu: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 6a2 2 0 1 1 0-.01M4 12h16M4 12a2 2 0 1 1 0-.01M4 18h16M4 18a2 2 0 1 1 0-.01"
    />
  ),
  categories: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v7H4v-7Zm9 0h7v7h-7v-7Z" />,
  deals: <path strokeLinecap="round" strokeLinejoin="round" d="M20 12 12 20l-8-8 8-8h8v8Zm-4.5-4.5h.01" />,
  restaurant: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 21V8l9-5 9 5v13M9 21v-6h6v6"
    />
  ),
};

function TabIcon({ tab }: { tab: Tab }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      {ICONS[tab]}
    </svg>
  );
}

export function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [data, setData] = useState<AdminData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("analytics");

  async function loadData() {
    setLoadError(null);
    const res = await fetch("/api/admin/data");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      setLoadError(json.error || "Failed to load data");
      return;
    }
    setData(json);
    setAuthed(true);
  }

  useEffect(() => {
    // One-time fetch of the current menu data on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      setPassword("");
      await loadData();
    } catch (err) {
      setLoginError((err as Error).message);
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setData(null);
  }

  if (authed === null) {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-500">Loading…</div>;
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col justify-center bg-neutral-50 px-6">
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-neutral-900">Menu Admin</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage the menu.</p>
          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
            />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button
              type="submit"
              disabled={loggingIn}
              className="rounded bg-neutral-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loggingIn ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-8 text-center text-sm text-red-600">
        {loadError || "Something went wrong loading the menu data."}
      </div>
    );
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "analytics", label: "Analytics" },
    { id: "menu", label: "Menu Items" },
    { id: "categories", label: "Categories" },
    { id: "deals", label: "Deals" },
    { id: "restaurant", label: "Restaurant Info" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <div className="hidden w-56 flex-none flex-col border-r border-neutral-200 bg-neutral-900 px-3 py-5 sm:flex">
        <div className="px-2">
          <p className="text-sm font-bold uppercase tracking-wide text-white">{data.restaurant.name}</p>
          <p className="text-[11px] text-neutral-400">Admin panel</p>
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors ${
                tab === t.id ? "bg-white text-neutral-900" : "text-neutral-300 hover:bg-white/10"
              }`}
            >
              <TabIcon tab={t.id} />
              {t.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto rounded-lg px-2.5 py-2 text-left text-sm font-medium text-neutral-400 hover:bg-white/10 hover:text-white"
        >
          Log out
        </button>
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between sm:hidden">
          <h1 className="text-lg font-bold text-neutral-900">Menu Admin</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600"
          >
            Log out
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-1 sm:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                tab === t.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-500 ring-1 ring-neutral-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mb-5 hidden items-center justify-between sm:flex">
          <h1 className="text-xl font-bold text-neutral-900">{TABS.find((t) => t.id === tab)?.label}</h1>
        </div>

        {!data.usingGitHub && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Dev mode: saving writes to local files, not GitHub. Set GITHUB_TOKEN + GITHUB_REPO in Vercel to publish
            for real.
          </p>
        )}

        {tab === "analytics" && <AnalyticsTab />}
        {tab === "menu" && (
          <MenuItemsTab
            items={data.menu}
            categories={data.categories}
            onSaved={(items) => setData({ ...data, menu: items })}
          />
        )}
        {tab === "categories" && (
          <CategoriesTab categories={data.categories} onSaved={(cats) => setData({ ...data, categories: cats })} />
        )}
        {tab === "deals" && (
          <DealsTab deals={data.deals} menuItems={data.menu} onSaved={(deals) => setData({ ...data, deals })} />
        )}
        {tab === "restaurant" && (
          <RestaurantTab restaurant={data.restaurant} onSaved={(r) => setData({ ...data, restaurant: r })} />
        )}
      </div>
    </div>
  );
}
