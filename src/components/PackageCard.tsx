import { Check, AlertTriangle } from 'lucide-react';
import type { PackageDef, BadgeVariant } from '../lib/pricing';

interface Props {
  pkg: PackageDef;
  total: number;
  tmrName: string;
  isSelected: boolean;
  onSelect: () => void;
}

const BADGE_STYLES: Record<BadgeVariant, string> = {
  green: 'bg-emerald-600/20 text-emerald-400',
  blue: 'bg-indigo-600/20 text-indigo-400',
  amber: 'bg-amber-600/20 text-amber-400',
};

export function PackageCard({ pkg, total, tmrName, isSelected, onSelect }: Props) {
  return (
    <div
      onClick={onSelect}
      className={`relative rounded-xl border p-4 cursor-pointer transition-all card-glow ${
        isSelected
          ? 'border-indigo-500 bg-zinc-900 ring-1 ring-indigo-500/30'
          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
      }`}
    >
      {pkg.badge && (
        <span className={`absolute top-3 right-3 inline-block px-2 py-0.5 rounded text-[10px] font-medium ${BADGE_STYLES[pkg.badge.variant]}`}>
          {pkg.badge.label}
        </span>
      )}

      <p className="text-sm font-semibold text-zinc-100 mb-0.5">{pkg.name}</p>
      <p className="text-xs text-zinc-500 mb-3">{pkg.description}</p>

      <ul className="space-y-1 mb-3">
        <li className="flex items-start gap-1.5 text-xs text-zinc-400">
          <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
          Front shell + touchpad
        </li>
        <li className="flex items-start gap-1.5 text-xs text-zinc-400">
          <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
          Whole strong clicky kit
        </li>
        {pkg.services.includes('paddles') && pkg.paddleId && (
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
            {pkg.description}
          </li>
        )}
        <li className="flex items-start gap-1.5 text-xs text-zinc-400">
          <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
          TMR {tmrName} sticks
        </li>
        <li className="flex items-start gap-1.5 text-xs text-zinc-400">
          <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
          Calibration
        </li>
        <li className="flex items-start gap-1.5 text-xs text-zinc-400">
          <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
          Parts &amp; tools
        </li>
      </ul>

      <div className="border-t border-zinc-800 pt-3">
        <div className="text-2xl font-semibold text-zinc-100">
          ${total.toFixed(2)}
          <span className="text-sm font-normal text-zinc-500 ml-1">NZD</span>
        </div>
        <p className="text-[10px] text-zinc-600 mt-0.5">
          Labour: {pkg.labourHours}hrs
          {pkg.notes ? ` · ${pkg.notes}` : ''}
        </p>
        {pkg.notes && (
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-400 bg-amber-600/10 rounded px-1.5 py-0.5">
            <AlertTriangle size={10} /> {pkg.notes}
          </span>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-3 left-3">
          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
