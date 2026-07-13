// ─── Constants ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

export const LABOUR_RATE = 55; // per hour, NZD
export const PARTS_TOOLS_FEE = 15; // NZD
export const CONTROLLER_PRICE = 60; // NZD
export const EDGE_TMR_LABOUR_BONUS = 0.5; // extra labour hours for TMR stick replacement on DualSense Edge
export const EDGE_PADDLES_LABOUR_BONUS = 0.25; // extra labour hours for Back Paddles install on DualSense Edge
export const TRADE_IN_DISCOUNT = 40; // NZD discount per controller traded in

// Default fallback if API fails
export const DEFAULT_EXCHANGE_RATE = 1.76;

// ─── Exchange Rate ────────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function fetchExchangeRate(): Promise<number> {
  try {
    // frankfurter.app – free, no API key needed
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=NZD');
    if (!res.ok) throw new Error('Rate fetch failed');
    const data = await res.json();
    return data.rates.NZD;
  } catch {
    console.warn('Failed to fetch live rate, using fallback', DEFAULT_EXCHANGE_RATE);
    return DEFAULT_EXCHANGE_RATE;
  }
}

// ─── TMR Stick Tiers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export interface TmrTier {
  id: string;
  name: string;
  priceNzd: number;
  goodFor: string;
}

export const TMR_TIERS: TmrTier[] = [
  { id: 'alps', name: 'Original Non-TMR', priceNzd: 10, goodFor: 'Budget like-for-like replacement — casual play, not drift-proof long term' },
  { id: 'ginfull', name: 'Ginfull TMR', priceNzd: 20, goodFor: 'Entry-level drift-free upgrade — casual and everyday gaming' },
  { id: 'ksilver', name: 'KSilver TMR', priceNzd: 25, goodFor: 'Higher-precision sensing — competitive shooters needing finer aim control' },
  { id: 'gulikit', name: 'Gulikit TMR', priceNzd: 30, goodFor: 'Balanced precision and reliability — best all-rounder for most players' },
  { id: 'gulikit720', name: 'Gulikit 720° TMR', priceNzd: 40, goodFor: 'Finer control with adjustable tension and configurable stick range for max precision.' },
];

export const DEFAULT_TMR = TMR_TIERS[1]; // KSilver

// ─── Back Paddle Options ──────────────────────────────────────────────────────────────────────────────────────────────────────

export interface PaddleOption {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  maxBdm: string;
  edgeOnly?: boolean;
  link?: string;
}


export const PADDLE_OPTIONS: PaddleOption[] = [
  {
    id: 'spark',
    name: 'SPARK',
    description: '4 plastic paddles · OLED · clicky triggers',
    priceUsd: 49.99,
    maxBdm: 'BDM-060',
    link: 'https://www.extremerate.com/products/extremerate-spark-back-paddles-kit-with-oled-display-clicky-trigger-stops-ergonomic-grips-for-ps5-controller-bdm-030-040-050-060-rubberized-black',
  },
  {
    id: 'rise2',
    name: 'RISE Plus MAX RMB',
    description: 'Only 2 metal paddles · clicky triggers',
    priceUsd: 52.99,
    maxBdm: 'BDM-050',
    link: 'https://www.extremerate.com/products/extremerate-real-metal-buttons-rmb-version-rise-plus-max-back-paddles-kit-with-clicky-trigger-stops-rubberized-grip-for-ps5-controller-bdm-030-040-050-rubberized-black',
  },
  {
    id: 'rise4',
    name: 'RISE4 Plus MAX RMB',
    description: '4 metal paddles · clicky triggers',
    priceUsd: 55.99,
    maxBdm: 'BDM-050',
    link: 'https://www.extremerate.com/products/extremerate-real-metal-buttons-rmb-version-rise4-plus-max-back-paddles-kit-with-clicky-trigger-stops-rubberized-grip-for-ps5-controller-bdm-030-040-050-rubberized-white-gray-silver',
  },
  {
    id: 'rise_v4',
    name: 'RISE V4 Remap Kit',
    description: '2 plastic paddles · remappable · clicky triggers',
    priceUsd: 25.99,
    maxBdm: 'BDM-060',
    link: 'https://www.extremerate.com/products/extremerate-remappable-rise-v4-remap-kit-for-ps5-controller-bdm-030-040-050-060-textured-black',
  },
  {
    id: 'rise4_v4',
    name: 'RISE4 V4 Remap Kit',
    description: '4 plastic paddles · remappable · clicky triggers',
    priceUsd: 27.99,
    maxBdm: 'BDM-060',
    link: 'https://www.extremerate.com/products/extremerate-remappable-rise4-v4-remap-kit-for-ps5-controller-bdm-030-040-050-060-textured-black',
  },
  {
    id: 'beyond',
    name: 'BEYOND OLED',
    description: '4 paddles · OLED display · rubberized grips · Edge only',
    priceUsd: 49.99,
    maxBdm: 'N/A',
    edgeOnly: true,
  },
];

// ─── Shell Swap Options ──────────────────────────────────────────────────────────────────────────────────────────────────────

export interface ShellOption {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  link?: string;
}


export const SHELL_OPTIONS: ShellOption[] = [
  {
    id: 'front_shell',
    name: 'Front Shell',
    description: 'Replace the front faceplate',
    priceUsd: 18.99,
    link: 'https://www.extremerate.com/products/chrome-silver-glossy-front-housing-shell-for-ps5-controller-diy-replacement-shell-for-ps5-controller-custom-cover-faceplate-for-ps5-controller-mpfd4002',
  },
  {
    id: 'touchpad',
    name: 'Touchpad',
    description: 'Replace the touchpad panel',
    priceUsd: 9.99,
    link: 'https://www.extremerate.com/products/midnight-blue-replacement-touchpad-for-ps5-controller-soft-touch-custom-part-touch-pad-with-tools-for-ps5-controller-controller-not-included-jpf4013',
  },
  {
    id: 'back_shell',
    name: 'Back Plate',
    description: 'Replace the rear shell',
    priceUsd: 19.99,
    link: 'https://www.extremerate.com/products/extremerate-performance-grip-replacement-back-housing-bottom-shell-for-ps5-controller-bdm-010-020-030-040-050-060-rubberized-black',
  },
  {
    id: 'buttons',
    name: 'Buttons',
    description: 'Replace ABXY + D-pad buttons',
    priceUsd: 12.99,
    link: 'https://www.extremerate.com/products/chrome-black-replacement-full-set-face-buttons-compatible-with-ps5-controller-bdm-010-bdm-020-jpf2008g2',
  },
];

// ─── Clicky Kit Options ──────────────────────────────────────────────────────────────────────────────────────────────────────

export interface ClickyKitOption {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  maxBdm: string;
  link?: string;
}

export const CLICKY_KIT_OPTIONS: ClickyKitOption[] = [
  {
    id: 'face',
    name: 'Face Buttons',
    description: 'Tactile D-pad & action buttons clicky kit',
    priceUsd: 14.99,
    maxBdm: 'BDM-030/040/050/060',
    link: 'https://www.extremerate.com/products/extremerate-custom-tactile-dpad-action-buttons-face-clicky-kit-v3-for-ps5-controller-bdm-030-040-050-060',
  },
  {
    id: 'whole',
    name: 'Whole Buttons',
    description: 'Micro-switch L1/R1/L2/R2 hair triggers + tactile face buttons',
    priceUsd: 19.99,
    maxBdm: 'BDM-040/050/060',
    link: 'https://www.extremerate.com/products/extremerate-whole-set-strong-version-clicky-kit-v2-for-ps5-controller-bdm-040-050-060-shoulder-face-buttons-micro-switch-l2r2-clicky-hair-trigger-kit-and-tactile-l1r1-face-buttons-mouse-click-for-ps5-controller',
  },
];

// ─── Service Definitions ──────────────────────────────────────────────────────────────────────────────────────────────────────

export type ServiceKey = 'tmr' | 'shell' | 'shell_tp' | 'clicky' | 'paddles';

export interface ServiceDef {
  key: ServiceKey;
  label: string;
  description: string;
  labourHours: number;
  partsCostUsd: number; // 0 if no extra parts beyond tools fee
  partsLabel: string;
  requiresTmr: boolean;
  requiresPaddles: boolean;
}

export const SERVICES: ServiceDef[] = [
  {
    key: 'tmr',
    label: 'Stick Replacement',
    description: 'stick install (pair) · soldering required · calibration included',
    labourHours: 1.0,
    partsCostUsd: 0,
    partsLabel: '',
    requiresTmr: true,
    requiresPaddles: false,
  },
  {
    key: 'paddles',
    label: 'Back Paddles',
    description: 'Choose from SPARK, RISE Plus MAX RMB, RISE4 Plus MAX RMB, RISE V4, or RISE4 V4',
    labourHours: 0.5,
    partsCostUsd: 0, // set by paddle selection
    partsLabel: '',
    requiresTmr: false,
    requiresPaddles: true,
  },
  {
    key: 'shell',
    label: 'Shell Swap',
    description: 'Shell replacement',
    labourHours: 0.25,
    partsCostUsd: 0, // set by shell part selection
    partsLabel: '',
    requiresTmr: false,
    requiresPaddles: false,
  },
  {
    key: 'clicky',
    label: 'Clicky Kit Install',
    description: 'Choose Face Buttons or Whole Buttons clicky kit',
    labourHours: 0.25,
    partsCostUsd: 0, // set by clicky kit selection
    partsLabel: '',
    requiresTmr: false,
    requiresPaddles: false,
  },
];

// DualSense Edge takes longer to work on — add the edge bonus for affected services
export function getServiceLabourHours(service: ServiceDef, isEdge: boolean): number {
  if (!isEdge) return service.labourHours;
  if (service.key === 'tmr') return service.labourHours + EDGE_TMR_LABOUR_BONUS;
  if (service.key === 'paddles') return service.labourHours + EDGE_PADDLES_LABOUR_BONUS;
  return service.labourHours;
}

// ─── Package Definitions ──────────────────────────────────────────────────────────────────────────────────────────────────────

export type PackageKey =
  | 'drift_fix'
  | 'shell_refresh'
  | 'pro_build'
  | 'elite_spark'
  | 'elite_rise2'
  | 'elite_rise4';

export type BadgeVariant = 'green' | 'blue' | 'amber';

export interface PackageDef {
  key: PackageKey;
  tier: 'repair' | 'custom' | 'elite';
  tierLabel: string;
  name: string;
  description: string;
  services: ServiceKey[];
  paddleId?: string;
  labourHours: number;
  badge?: { label: string; variant: BadgeVariant };
  notes?: string;
}

export const PACKAGES: PackageDef[] = [
  {
    key: 'drift_fix',
    tier: 'repair',
    tierLabel: 'Repair',
    name: 'Drift Fix',
    description: 'Stop the drift, nothing else changes',
    services: ['tmr'],
    badge: { label: 'Most Popular', variant: 'green' },
    labourHours: 1.0,
  },
  {
    key: 'shell_refresh',
    tier: 'repair',
    tierLabel: 'Repair',
    name: 'Shell Refresh',
    description: 'New look + drift fix',
    services: ['shell_tp', 'tmr'],
    labourHours: 1.5,
  },
  {
    key: 'pro_build',
    tier: 'custom',
    tierLabel: 'Custom Builds',
    name: 'Pro Build',
    description: 'Full upgrade, no paddles',
    services: ['shell_tp', 'clicky', 'tmr'],
    badge: { label: 'Best Value', variant: 'blue' },
    labourHours: 1.75,
  },
  {
    key: 'elite_spark',
    tier: 'elite',
    tierLabel: 'Elite Builds',
    name: 'Elite — SPARK',
    description: '4 plastic paddles + OLED',
    services: ['shell_tp', 'clicky', 'paddles', 'tmr'],
    paddleId: 'spark',
    badge: { label: 'Elite', variant: 'blue' },
    labourHours: 2.5,
  },
  {
    key: 'elite_rise2',
    tier: 'elite',
    tierLabel: 'Elite Builds',
    name: 'Elite — RISE RMB',
    description: '2 real metal paddles',
    services: ['shell_tp', 'clicky', 'paddles', 'tmr'],
    paddleId: 'rise2',
    badge: { label: 'Elite', variant: 'blue' },
    labourHours: 2.5,
    notes: 'BDM-030–050 only',
  },
  {
    key: 'elite_rise4',
    tier: 'elite',
    tierLabel: 'Elite Builds',
    name: 'Elite — RISE4 RMB',
    description: '4 real metal paddles',
    services: ['shell_tp', 'clicky', 'paddles', 'tmr'],
    paddleId: 'rise4',
    badge: { label: 'Elite', variant: 'blue' },
    labourHours: 2.5,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface Quote {
  lines: QuoteLine[];
  subtotal: number;
  tradeInDiscount: number;
  total: number;
}

export type ControllerType = 'dualsense' | 'edge';

// ─── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Convert USD to NZD at a given rate
export const toNzd = (usd: number, rate: number) => usd * rate;

// Format NZD currency
export const fmt = (nzd: number) => `$${nzd.toFixed(2)}`;

// ─── Calculation Engine ───────────────────────────────────────────────────────────────────────────────────────────────────────

export function calculateIndividualServices(
  selectedServices: ServiceKey[],
  tmrTier: TmrTier | null,
  paddleOption: PaddleOption | null,
  isEdge: boolean,
  userProvidesController: boolean,
  rate: number,
  shellOptions: ShellOption[] = [],
  clickyKit: ClickyKitOption | null = null,
  tradeInCount = 0,
): Quote {
  const lines: QuoteLine[] = [];
  let toolsAdded = false;

  for (const svc of selectedServices) {
    const def = SERVICES.find((s) => s.key === svc)!;
    const hours = getServiceLabourHours(def, isEdge);
    const labour = hours * LABOUR_RATE;

    if (!toolsAdded) {
      lines.push({
        label: `Labour — ${hours}hr ${
          svc === 'tmr' ? 'TMR + calibration' : def.label.toLowerCase()
        }`,
        amount: labour,
      });
      lines.push({ label: 'Parts & tools', amount: PARTS_TOOLS_FEE });
      toolsAdded = true;
    } else {
      lines.push({
        label: `Labour — ${hours}hr ${def.label.toLowerCase()}`,
        amount: labour,
      });
    }

    if (svc === 'tmr' && tmrTier) {
      lines.push({ label: `${tmrTier.name} sticks, pair`, amount: tmrTier.priceNzd });
    } else if (svc === 'paddles' && paddleOption) {
      const price = toNzd(paddleOption.priceUsd, rate);
      lines.push({ label: `${paddleOption.name} kit (USD$${paddleOption.priceUsd})`, amount: price });
    } else if (svc === 'shell') {
      for (const shell of shellOptions) {
        const price = toNzd(shell.priceUsd, rate);
        lines.push({ label: `${shell.name} (USD$${shell.priceUsd})`, amount: price });
      }
    } else if (svc === 'clicky' && clickyKit) {
      const price = toNzd(clickyKit.priceUsd, rate);
      lines.push({ label: `${clickyKit.name} clicky kit (USD$${clickyKit.priceUsd})`, amount: price });
    } else if (def.partsCostUsd > 0) {
      const price = toNzd(def.partsCostUsd, rate);
      lines.push({ label: `${def.partsLabel} (USD$${def.partsCostUsd})`, amount: price });
    }
  }

  if (!userProvidesController) {
    lines.push({ label: `Controller supply (NZD$${CONTROLLER_PRICE})`, amount: CONTROLLER_PRICE });
  }

  if (lines.length === 0) {
    return { lines, subtotal: 0, tradeInDiscount: 0, total: 0 };
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  const tradeInDiscount = tradeInCount * TRADE_IN_DISCOUNT;
  if (tradeInDiscount > 0) {
    lines.push({ label: `Trade-in discount, avg (${tradeInCount} controller${tradeInCount === 1 ? '' : 's'})`, amount: -tradeInDiscount });
  }

  return { lines, subtotal, tradeInDiscount, total: subtotal - tradeInDiscount };
}

export function calculatePackage(
  pkg: PackageDef,
  tmrTier: TmrTier,
  isEdge: boolean,
  userProvidesController: boolean,
  rate: number,
  tradeInCount = 0,
): Quote {
  const lines: QuoteLine[] = [];

  const edgeBonus = isEdge
    ? (pkg.services.includes('tmr') ? EDGE_TMR_LABOUR_BONUS : 0) + (pkg.services.includes('paddles') ? EDGE_PADDLES_LABOUR_BONUS : 0)
    : 0;
  const hours = pkg.labourHours + edgeBonus;
  const labour = hours * LABOUR_RATE;
  lines.push({ label: `Labour — ${hours}hr`, amount: labour });

  lines.push({ label: 'Parts & tools', amount: PARTS_TOOLS_FEE });

  for (const svc of pkg.services) {
    const def = SERVICES.find((s) => s.key === svc)!;
    if (svc === 'tmr') {
      lines.push({ label: `TMR ${tmrTier.name} sticks, pair`, amount: tmrTier.priceNzd });
    } else if (svc === 'paddles' && pkg.paddleId) {
      const paddle = PADDLE_OPTIONS.find((p) => p.id === pkg.paddleId)!;
      const price = toNzd(paddle.priceUsd, rate);
      lines.push({ label: `${paddle.name} kit (USD$${paddle.priceUsd})`, amount: price });
    } else if (svc === 'clicky') {
      const kit = CLICKY_KIT_OPTIONS.find((k) => k.id === 'whole')!;
      const price = toNzd(kit.priceUsd, rate);
      lines.push({ label: `${kit.name} clicky kit (USD$${kit.priceUsd})`, amount: price });
    } else if (def.partsCostUsd > 0) {
      const price = toNzd(def.partsCostUsd, rate);
      lines.push({ label: `${def.partsLabel} (USD$${def.partsCostUsd})`, amount: price });
    }
  }

  if (!userProvidesController) {
    lines.push({ label: `Controller supply (NZD$${CONTROLLER_PRICE})`, amount: CONTROLLER_PRICE });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  const tradeInDiscount = tradeInCount * TRADE_IN_DISCOUNT;
  if (tradeInDiscount > 0) {
    lines.push({ label: `Trade-in discount, avg (${tradeInCount} controller${tradeInCount === 1 ? '' : 's'})`, amount: -tradeInDiscount });
  }

  return { lines, subtotal, tradeInDiscount, total: subtotal - tradeInDiscount };
}
