import { Repeat, Minus, Plus } from 'lucide-react';
import { TRADE_IN_DISCOUNT } from '../lib/pricing';

interface Props {
  count: number;
  onChange: (count: number) => void;
}

export function TradeInField({ count, onChange }: Props) {
  const clamp = (n: number) => Math.max(0, Math.min(20, n));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
      <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
        <Repeat size={14} /> Trade-in controllers
      </p>
      <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
        Trading in other controllers? Get ${TRADE_IN_DISCOUNT} NZD off per controller. Don't count the one you're sending in to be modded.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(clamp(count - 1))}
          disabled={count === 0}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          min={0}
          max={20}
          value={count}
          onChange={(e) => onChange(clamp(parseInt(e.target.value, 10) || 0))}
          className="w-14 text-center bg-transparent text-sm font-medium text-zinc-100 border border-zinc-700 rounded-lg py-1.5"
        />
        <button
          type="button"
          onClick={() => onChange(clamp(count + 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 transition-all"
        >
          <Plus size={14} />
        </button>
        {count > 0 && (
          <span className="text-xs text-emerald-400 font-medium">
            -${(count * TRADE_IN_DISCOUNT).toFixed(2)} NZD
          </span>
        )}
      </div>
      {count > 0 && (
        <p className="text-[10px] text-zinc-600 mt-3 leading-relaxed">
          This is an average estimate. The final trade-in discount is confirmed once your controllers are checked in person for version, wear, and damage.
        </p>
      )}
    </div>
  );
}
