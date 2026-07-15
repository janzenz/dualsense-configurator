import { useState } from 'react';
import { Usb, CheckCircle2, RotateCcw } from 'lucide-react';
import { detectController, isWebHidSupported } from '../lib/controller';
import type { ControllerType } from '../lib/pricing';

interface Props {
  connected: boolean;
  board: string | null;
  controllerType: ControllerType;
  onDetected: (type: ControllerType, board: string) => void;
  onReset: () => void;
}

export function ControllerDetect({ connected, board, controllerType, onDetected, onReset }: Props) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = isWebHidSupported();

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const result = await detectController();
      if (result) {
        onDetected(result.type, result.board);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read controller — try again.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
      <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
        <Usb size={14} /> Detect your controller
      </p>

      {connected && board ? (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">
            <CheckCircle2 size={14} />
            Detected: {board} · {controllerType === 'edge' ? 'DualSense Edge' : 'DualSense'}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 transition-all"
          >
            <RotateCcw size={12} />
            Use a different controller
          </button>
        </div>
      ) : supported ? (
        <>
          <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
            Plug your controller in over USB and connect it here to auto-identify the board model.
          </p>
          <button
            type="button"
            onClick={handleConnect}
            disabled={connecting}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Usb size={16} />
            {connecting ? 'Connecting…' : 'Connect controller'}
          </button>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </>
      ) : (
        <p className="text-xs text-zinc-500 leading-relaxed">
          Detection needs Chrome or Edge on desktop — pick your board model under Controller Type below instead.
        </p>
      )}
    </div>
  );
}
