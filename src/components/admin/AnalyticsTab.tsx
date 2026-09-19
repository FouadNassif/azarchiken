"use client";

import { useEffect, useState } from "react";

interface ItemStat {
  id: string;
  title: string;
  views: number;
  cartAdds: number;
}

interface DealStat {
  id: string;
  title: string;
  cartAdds: number;
}

interface AnalyticsData {
  items: ItemStat[];
  deals: DealStat[];
  searches: { term: string; count: number }[];
  uniqueVisitors: number;
  isRedisConfigured: boolean;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-neutral-900">{value.toLocaleString()}</p>
    </div>
  );
}

export function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-neutral-500">Loading analytics…</p>;

  const totalViews = data.items.reduce((sum, i) => sum + i.views, 0);
  const totalCartAdds =
    data.items.reduce((sum, i) => sum + i.cartAdds, 0) + data.deals.reduce((sum, d) => sum + d.cartAdds, 0);

  return (
    <div>
      {!data.isRedisConfigured && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Dev mode: these numbers are stored in memory and reset when the server restarts. Connect Upstash Redis in
          Vercel (Storage tab → Marketplace → Upstash) for this to persist for real.
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Unique visitors" value={data.uniqueVisitors} />
        <StatCard label="Item views" value={totalViews} />
        <StatCard label="Added to cart" value={totalCartAdds} />
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-neutral-800">Most viewed items</h3>
        <p className="text-xs text-neutral-400">
          Views are counted once per visitor per day, so refreshing doesn&apos;t inflate the number.
        </p>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500">
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 font-medium">Views</th>
              <th className="pb-2 font-medium">Added to cart</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-50 last:border-none">
                <td className="py-1.5 text-neutral-800">{item.title}</td>
                <td className="py-1.5 text-neutral-600">{item.views}</td>
                <td className="py-1.5 text-neutral-600">{item.cartAdds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.deals.length > 0 && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-800">Deals added to cart</h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {data.deals.map((deal) => (
                <tr key={deal.id} className="border-b border-neutral-50 last:border-none">
                  <td className="py-1.5 text-neutral-800">{deal.title}</td>
                  <td className="py-1.5 text-neutral-600">{deal.cartAdds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-neutral-800">What people search for</h3>
        {data.searches.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-400">No searches recorded yet.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.searches.map((s) => (
              <span
                key={s.term}
                className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700"
              >
                {s.term} <span className="text-neutral-400">×{s.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
