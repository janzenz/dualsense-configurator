import { Wrench } from 'lucide-react';
import type { TmrTier } from '../lib/pricing';

interface Props {
  tiers: TmrTier[];
  selected: TmrTier | null;
  onSelect: (tier: TmrTier) => void;
}

export function StickSelector({ tiers, selected, onSelect }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
        <Wrench size={14} /> Select sticks
      </p>
      <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
        TMR (Tunneling Magnetoresistance) sticks use magnetic sensing instead of worn physical contacts, eliminating stick drift and lasting far longer than stock sticks — higher tiers add finer precision and smoother feel.
      </p>
      <div className="flex gap-2 flex-wrap">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier)}
            className={`flex flex-col items-start px-3 py-1.5 rounded-lg text-xs font-medium border transition-all max-w-[200px] ${
              selected?.id === tier.id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
            }`}
          >
            <span>
              {tier.name}
              <span className={`ml-1 text-[10px] ${selected?.id === tier.id ? 'opacity-75' : 'opacity-60'}`}>
                +${tier.priceNzd}
              </span>
            </span>
            <span className={`text-[10px] font-normal text-left ${selected?.id === tier.id ? 'opacity-75' : 'opacity-60'}`}>
              {tier.goodFor}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
