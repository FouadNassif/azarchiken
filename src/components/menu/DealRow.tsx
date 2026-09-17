import { Deal } from "@/types/menu";
import { DealCard } from "@/components/menu/DealCard";
import { Reveal } from "@/components/ui/Reveal";

export function DealRow({ id, deals }: { id?: string; deals: Deal[] }) {
  if (deals.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24 py-8">
      <Reveal>
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-600">Combos</span>
        <h2 className="font-display mt-1 text-4xl leading-none text-ink-900">Best Deals</h2>
        <div className="menu-divider mt-2.5">
          <span className="menu-rule" />
          <span className="menu-rule-thin" />
        </div>
      </Reveal>

      <div className="scrollbar-none -mx-5 mt-4 flex gap-3.5 overflow-x-auto px-5 pb-1">
        {deals.map((deal, i) => (
          <Reveal key={deal.id} delay={i * 60} className="flex-none">
            <DealCard deal={deal} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
