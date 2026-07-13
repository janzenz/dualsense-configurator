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
      <div className="flex gap-2 flex-wrap">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selected?.id === tier.id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
            }`}
          >
            {tier.name}
            <span className={`ml-1 text-xs ${selected?.id === tier.id ? 'opacity-75' : 'opacity-60'}`}>
              <span className="text-[10px] opacity-75 ml-1">+${tier.priceNzd}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
