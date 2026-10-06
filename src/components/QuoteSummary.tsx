import { Receipt, ArrowRight } from 'lucide-react';
import type { Quote } from '../lib/pricing';

interface Props {
  quote: Quote;
  title: string;
  onSend: () => void;
}

export function QuoteSummary({ quote, title, onSend }: Props) {
  if (quote.lines.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
        <Receipt size={32} className="text-zinc-700 mx-auto mb-3" />
        <p className="text-sm text-zinc-500">Select services or a package to see your quote</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
        <Receipt size={14} /> {title}
      </p>

      <div className="space-y-1.5 mb-4">
        {quote.lines.map((line, i) => (
          <div key={i} className={`flex justify-between text-xs ${line.amount < 0 ? 'text-emerald-400' : 'text-zinc-400'}`}>
            <span>{line.label}</span>
            <span>{line.amount < 0 ? '-' : ''}${Math.abs(line.amount).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-zinc-800 my-3" />

      <div className="flex justify-between text-sm font-semibold text-zinc-100">
        <span>Total</span>
        <span>${quote.total.toFixed(2)} NZD</span>
      </div>

      <button
        onClick={onSend}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
      >
        <ArrowRight size={16} />
        Send Quote Request
      </button>

      <p className="text-[10px] text-zinc-600 mt-3">
        Customer supplies controller. Calibration included with TMR installs. ExtremeRate parts at retail USD ×1.76 NZD. $5 parts &amp; tools fee covers consumables. Trade-in discount ($40 NZD/controller average) applies to controllers other than the one being modded — final amount confirmed once controllers are checked for version, wear, and damage.
      </p>
    </div>
  );
}
