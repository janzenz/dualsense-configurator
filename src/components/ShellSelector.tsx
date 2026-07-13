import { Paintbrush, ExternalLink } from 'lucide-react';
import type { ShellOption } from '../lib/pricing';
import { toNzd } from '../lib/pricing';

interface Props {
  options: ShellOption[];
  selected: ShellOption[];
  onToggle: (option: ShellOption) => void;
  rate: number;
}

export function ShellSelector({ options, selected, onToggle, rate }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
        <Paintbrush size={14} /> Select shell parts
      </p>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => {
          const isSelected = selected.some((s) => s.id === option.id);
          return (
            <button
              key={option.id}
              onClick={() => onToggle(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
              }`}
            >
              {option.name}
              <span className={`ml-1 text-xs ${isSelected ? 'opacity-75' : 'opacity-60'}`}>
                {option.priceUsd > 0 && (
                  <span className="text-[10px] opacity-75 ml-1">+${toNzd(option.priceUsd, rate).toFixed(0)}</span>
                )}
              </span>
              {option.link && (
                <a
                  href={option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex align-middle ml-1 ${isSelected ? 'opacity-75 hover:opacity-100' : 'opacity-60 hover:opacity-100'}`}
                  title="View product page"
                >
                  <ExternalLink size={10} />
                </a>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
