import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { readData } from "@/lib/contentStore";
import { getCounters, topFromSortedSet, setCardinality, isRedisConfigured } from "@/lib/analyticsStore";
import { Deal, MenuItem } from "@/types/menu";

export async function GET(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const [menu, deals] = await Promise.all([
      readData<MenuItem[]>("menu"),
      readData<Deal[]>("deals"),
    ]);

    const [viewCounts, itemCartAdds, dealCartAdds, topSearches, uniqueVisitors] = await Promise.all([
      getCounters(menu.map((i) => `views:${i.id}`)),
      getCounters(menu.map((i) => `cartadds:item:${i.id}`)),
      getCounters(deals.map((d) => `cartadds:deal:${d.id}`)),
      topFromSortedSet("search:terms", 25),
      setCardinality("visitors:all"),
    ]);

    const items = menu
      .map((item, i) => ({
        id: item.id,
        title: item.title,
        views: viewCounts[i],
        cartAdds: itemCartAdds[i],
      }))
      .sort((a, b) => b.views - a.views || b.cartAdds - a.cartAdds);

    const dealStats = deals
      .map((deal, i) => ({ id: deal.id, title: deal.title, cartAdds: dealCartAdds[i] }))
      .sort((a, b) => b.cartAdds - a.cartAdds);

    const searches = topSearches.map((s) => ({ term: s.member, count: s.score }));

    return NextResponse.json({
      items,
      deals: dealStats,
      searches,
      uniqueVisitors,
      isRedisConfigured: isRedisConfigured(),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
