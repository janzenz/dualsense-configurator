import { Palette, Mouse, Gamepad2, Wrench, Check } from 'lucide-react';
import type { ServiceDef } from '../lib/pricing';
import { LABOUR_RATE, getServiceLabourHours } from '../lib/pricing';

const ICONS: Record<string, typeof Wrench> = {
  tmr: Wrench,
  shell: Palette,
  shell_tp: Palette,
  clicky: Mouse,
  paddles: Gamepad2,
};

interface Props {
  service: ServiceDef;
  partsCost: number;
  partsLabel?: string;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
  isEdge: boolean;
}

export function ServiceCard({ service, partsCost, partsLabel, total, isSelected, onSelect, isEdge }: Props) {
  const Icon = ICONS[service.key] || Wrench;
  const hours = getServiceLabourHours(service, isEdge);
  const labour = hours * LABOUR_RATE;

  return (
    <div
      onClick={onSelect}
      className={`rounded-xl border p-4 cursor-pointer transition-all card-glow ${
        isSelected
          ? 'border-indigo-500 bg-zinc-900 ring-1 ring-indigo-500/30'
          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
      }`}
    >
      <p className="text-sm font-medium text-zinc-100 mb-0.5 flex items-center gap-2">
        <Icon size={16} className="text-zinc-500" />
        {service.label}
      </p>
      <p className="text-xs text-zinc-500 mb-3 leading-relaxed">{service.description}</p>

      <div className="text-2xl font-semibold text-zinc-100">
        ${total.toFixed(2)}
      </div>
      <p className="text-xs text-zinc-600 mt-1">NZD</p>

      <div className="h-px bg-zinc-800 my-3" />

      <div className="space-y-0.5">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Labour — {hours}hr</span>
          <span>${labour.toFixed(2)}</span>
        </div>
        {partsCost > 0 && (
          <div className="flex justify-between text-xs text-zinc-400">
            <span>{partsLabel || service.partsLabel}</span>
            <span>${partsCost.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-medium text-zinc-200 border-t border-zinc-800 pt-1.5 mt-1">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
