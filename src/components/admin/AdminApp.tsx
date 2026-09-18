"use client";

import { useEffect, useState } from "react";
import { Category, Deal, MenuItem } from "@/types/menu";
import { MenuItemsTab } from "@/components/admin/MenuItemsTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { DealsTab } from "@/components/admin/DealsTab";
import { RestaurantTab, RestaurantData } from "@/components/admin/RestaurantTab";

type Tab = "menu" | "categories" | "deals" | "restaurant";

interface AdminData {
  categories: Category[];
  menu: MenuItem[];
  deals: Deal[];
  restaurant: RestaurantData;
  usingGitHub: boolean;
}

export function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [data, setData] = useState<AdminData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("menu");

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
    return <div className="p-8 text-center text-sm text-neutral-500">Loading…</div>;
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
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
    );
  }

  if (loadError || !data) {
    return (
      <div className="p-8 text-center text-sm text-red-600">
        {loadError || "Something went wrong loading the menu data."}
      </div>
    );
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "menu", label: "Menu Items" },
    { id: "categories", label: "Categories" },
    { id: "deals", label: "Deals" },
    { id: "restaurant", label: "Restaurant Info" },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Menu Admin</h1>
          {!data.usingGitHub && (
            <p className="mt-0.5 text-xs text-amber-600">
              Dev mode: saving writes to local files, not GitHub. Set GITHUB_TOKEN + GITHUB_REPO to publish for real.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
        >
          Log out
        </button>
      </div>

      <div className="mt-5 flex gap-1 border-b border-neutral-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
              tab === t.id
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "menu" && (
          <MenuItemsTab items={data.menu} categories={data.categories} onSaved={(items) => setData({ ...data, menu: items })} />
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
