import { useState, useEffect, useMemo } from 'react';
import { Gamepad2, Wrench, Package, Monitor, Box, ExternalLink } from 'lucide-react';
import { StickSelector } from './StickSelector';
import { ShellSelector } from './ShellSelector';
import { ServiceCard } from './ServiceCard';
import { PackageCard } from './PackageCard';
import { QuoteSummary } from './QuoteSummary';
import { TradeInField } from './TradeInField';
import {
  TMR_TIERS,
  DEFAULT_TMR,
  SERVICES,
  PACKAGES,
  PADDLE_OPTIONS,
  SHELL_OPTIONS,
  CLICKY_KIT_OPTIONS,
  DEFAULT_EXCHANGE_RATE,
  type ShellOption,
  fetchExchangeRate,
  toNzd,
  CONTROLLER_PRICE,
  calculateIndividualServices,
  calculatePackage,
  getServiceLabourHours,
  TRADE_IN_DISCOUNT,
  type ControllerType,
  type ServiceKey,
  type PackageKey,
  type Quote,
  type TmrTier,
} from '../lib/pricing';

type TabKey = 'individual' | 'package';

export default function Configurator() {
  const [controllerType, setControllerType] = useState<ControllerType>('dualsense');
  const [userProvidesController, setUserProvidesController] = useState(true);
  const [tab, setTab] = useState<TabKey>('individual');
  const [tmrTier, setTmrTier] = useState<TmrTier | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceKey[]>([]);
  const [selectedPaddle, setSelectedPaddle] = useState<string | null>(null);
  const [selectedShells, setSelectedShells] = useState<ShellOption[]>([]);
  const [selectedClickyKit, setSelectedClickyKit] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageKey | null>(null);
  const [tradeInCount, setTradeInCount] = useState(0);
  const [rate, setRate] = useState(DEFAULT_EXCHANGE_RATE);

  // Fetch live exchange rate on mount
  useEffect(() => {
    fetchExchangeRate().then(setRate);
  }, []);

  const isEdge = controllerType === 'edge';
  const paddleOptions = PADDLE_OPTIONS.filter((p) => (isEdge ? p.edgeOnly : !p.edgeOnly));

  // Clear a paddle selection that's no longer valid after a controller type switch
  useEffect(() => {
    setSelectedPaddle((prev) => (prev && !paddleOptions.some((p) => p.id === prev) ? null : prev));
  }, [isEdge]);

  // We only stock DualSense controllers, so Edge customers must always supply their own
  useEffect(() => {
    if (isEdge) setUserProvidesController(true);
  }, [isEdge]);

  const toggleService = (key: ServiceKey) => {
    setSelectedServices((prev) => {
      const isDeselecting = prev.includes(key);
      if (isDeselecting) {
        if (key === 'tmr') setTmrTier(null);
        if (key === 'paddles') setSelectedPaddle(null);
        if (key === 'shell') setSelectedShells([]);
        if (key === 'clicky') setSelectedClickyKit(null);
      }
      return isDeselecting ? prev.filter((s) => s !== key) : [...prev, key];
    });
  };

  const toggleShell = (option: ShellOption) => {
    setSelectedShells((prev) =>
      prev.some((s) => s.id === option.id)
        ? prev.filter((s) => s.id !== option.id)
        : [...prev, option],
    );
  };

  // Compute individual services quote
  const individualQuote: Quote = useMemo(
    () =>
      calculateIndividualServices(
        selectedServices,
        tmrTier,
        selectedPaddle ? PADDLE_OPTIONS.find((p) => p.id === selectedPaddle) || null : null,
        isEdge,
        userProvidesController,
        rate,
        selectedShells,
        selectedClickyKit ? CLICKY_KIT_OPTIONS.find((k) => k.id === selectedClickyKit) || null : null,
        tradeInCount,
      ),
    [selectedServices, tmrTier, selectedPaddle, selectedShells, selectedClickyKit, isEdge, userProvidesController, rate, tradeInCount],
  );

  // Compute selected package quote
  const packageQuote: Quote | null = useMemo(() => {
    if (!selectedPackage) return null;
    const pkg = PACKAGES.find((p) => p.key === selectedPackage);
    if (!pkg) return null;
    return calculatePackage(pkg, tmrTier ?? DEFAULT_TMR, isEdge, userProvidesController, rate, tradeInCount);
  }, [selectedPackage, tmrTier, isEdge, userProvidesController, rate, tradeInCount]);

  // Active quote to display
  const activeQuote = tab === 'individual' ? individualQuote : packageQuote;
  const quoteTitle = tab === 'individual' ? 'Custom Build Quote' : 'Package Quote';

  const handleSendQuote = () => {
    if (!activeQuote || activeQuote.lines.length === 0) return;

    const parts = [];
    parts.push(`Controller: ${isEdge ? 'DualSense Edge' : 'DualSense'}`);
    parts.push(`Controller supply: ${userProvidesController ? 'Customer provided' : `We supply ($${CONTROLLER_PRICE} NZD)`}`);
    parts.push(`Mode: ${tab === 'individual' ? 'Custom Build' : 'Package'}`);
    parts.push(`Exchange rate: 1 USD = $${rate.toFixed(2)} NZD`);
    if (tmrTier) {
      parts.push(`TMR Sticks: ${tmrTier.name} ($${tmrTier.priceNzd.toFixed(2)} NZD)`);
    }

    if (tab === 'individual') {
      const serviceNames = selectedServices
        .map((s) => SERVICES.find((d) => d.key === s)?.label)
        .filter(Boolean);
      if (serviceNames.length) {
        parts.push(`Services: ${serviceNames.join(', ')}`);
      }
      if (selectedPaddle) {
        const paddle = PADDLE_OPTIONS.find((p) => p.id === selectedPaddle);
        parts.push(`Paddles: ${paddle?.name}`);
      }
      if (selectedShells.length) {
        parts.push(`Shell parts: ${selectedShells.map((s) => s.name).join(', ')}`);
      }
    } else if (selectedPackage) {
      const pkg = PACKAGES.find((p) => p.key === selectedPackage);
      parts.push(`Package: ${pkg?.name}`);
    }

    if (tradeInCount > 0) {
      parts.push(`Trade-ins: ${tradeInCount} controller${tradeInCount === 1 ? '' : 's'} (-$${(tradeInCount * TRADE_IN_DISCOUNT).toFixed(2)} NZD)`);
    }

    parts.push(`Total: $${activeQuote.total.toFixed(2)} NZD`);

    const subject = encodeURIComponent('DualSense Mod Quote Request');
    const body = encodeURIComponent(parts.join('\n'));
    window.location.href = `mailto:hello@jzarzoso.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">DualSense Mod Configurator</h1>
        <p className="text-sm text-zinc-500">
          Configure your controller mods and get an instant quote
        </p>
        <p className="text-[10px] text-zinc-600 mt-1">
          Exchange rate: 1 USD = ${rate.toFixed(2)} NZD
          {rate !== DEFAULT_EXCHANGE_RATE ? ' (live)' : ' (fallback)'}
        </p>
      </div>

      {/* Controller Type */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
          <Monitor size={14} /> Controller type
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setControllerType('dualsense')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              !isEdge
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
            }`}
          >
            <Gamepad2 size={16} />
            DualSense
          </button>
          <button
            onClick={() => setControllerType('edge')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              isEdge
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
            }`}
          >
            <Gamepad2 size={16} />
            DualSense Edge
          </button>
        </div>
      </div>

      {/* Controller Supply */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
          <Box size={14} /> Controller supply
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setUserProvidesController(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              userProvidesController
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
            }`}
          >
            I'll bring my own
          </button>
          <button
            onClick={() => !isEdge && setUserProvidesController(false)}
            disabled={isEdge}
            title={isEdge ? "We don't stock DualSense Edge controllers" : undefined}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              !userProvidesController
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
            } ${isEdge ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            We supply (PS5 DualSense Only)
            <span className={`ml-1 text-xs ${!userProvidesController ? 'opacity-75' : 'opacity-60'}`}>
              <span className="text-[10px] opacity-75 ml-1">+${CONTROLLER_PRICE}</span>
            </span>
          </button>
        </div>
      </div>

      <TradeInField count={tradeInCount} onChange={setTradeInCount} />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-zinc-800 mb-6">
        <button
          onClick={() => setTab('individual')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            tab === 'individual'
              ? 'text-zinc-100 border-indigo-500'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <Wrench size={15} />
          Individual Services
        </button>
        {/* <button
          onClick={() => setTab('package')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            tab === 'package'
              ? 'text-zinc-100 border-indigo-500'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <Package size={15} />
          Packages
        </button> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {tab === 'individual' ? (
            <div className="space-y-4">
              {/* Service cards */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                {SERVICES.map((service) => {
                  const partsCost =
                    service.key === 'tmr'
                      ? (tmrTier ? tmrTier.priceNzd : 0)
                      : service.key === 'paddles'
                      ? (selectedPaddle ? toNzd(PADDLE_OPTIONS.find((p) => p.id === selectedPaddle)!.priceUsd, rate) : 0)
                      : service.key === 'shell'
                      ? (selectedShells.length
                          ? selectedShells.reduce((sum, s) => sum + toNzd(s.priceUsd, rate), 0)
                          : toNzd(service.partsCostUsd, rate))
                      : service.key === 'clicky'
                      ? (selectedClickyKit ? toNzd(CLICKY_KIT_OPTIONS.find((k) => k.id === selectedClickyKit)!.priceUsd, rate) : 0)
                      : toNzd(service.partsCostUsd, rate);
                  const total = getServiceLabourHours(service, isEdge) * 55 + partsCost;
                  const partsLabel =
                    service.key === 'tmr'
                      ? (tmrTier ? `${tmrTier.name} sticks` : '')
                      : service.key === 'paddles'
                      ? (selectedPaddle ? `${PADDLE_OPTIONS.find((p) => p.id === selectedPaddle)!.name} kit` : '')
                      : service.key === 'shell'
                      ? selectedShells.map((s) => s.name).join(' + ')
                      : service.key === 'clicky'
                      ? (selectedClickyKit ? `${CLICKY_KIT_OPTIONS.find((k) => k.id === selectedClickyKit)!.name} clicky kit` : '')
                      : undefined;

                  if (service.key === 'tmr' && selectedServices.includes('tmr')) {
                    return (
                      <>
                        <ServiceCard
                            key={service.key}
                            service={service}
                            partsCost={partsCost}
                            partsLabel={partsLabel}
                            total={total}
                            isSelected={selectedServices.includes(service.key)}
                            onSelect={() => toggleService(service.key)}
                            isEdge={isEdge}
                        />
                        <StickSelector
                          tiers={TMR_TIERS}
                          selected={tmrTier}
                          onSelect={(tier) => setTmrTier((prev) => (prev?.id === tier.id ? null : tier))}
                        />
                      </>
                    )
                  }

                  if (service.key === 'paddles' && selectedServices.includes('paddles')) {
                    return (
                      <>
                        <ServiceCard
                            key={service.key}
                            service={service}
                            partsCost={partsCost}
                            partsLabel={partsLabel}
                            total={total}
                            isSelected={selectedServices.includes(service.key)}
                            onSelect={() => toggleService(service.key)}
                            isEdge={isEdge}
                        />
                        {/* Paddle selector */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                          <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-3">
                            Back paddles
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {paddleOptions.map((paddle) => (
                              <button
                                key={paddle.id}
                                onClick={() =>
                                  setSelectedPaddle((prev) => (prev === paddle.id ? null : paddle.id))
                                }
                                className={`flex flex-col items-start px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  selectedPaddle === paddle.id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                                }`}
                              >
                                <span className="flex items-center gap-1">
                                  {paddle.name}
                                  <span className={`ml-1 text-[10px] ${selectedPaddle === paddle.id ? 'opacity-75' : 'opacity-60'}`}>
                                    ${toNzd(paddle.priceUsd, rate).toFixed(0)}
                                  </span>
                                  {paddle.link && (
                                    <a
                                      href={paddle.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className={`${selectedPaddle === paddle.id ? 'opacity-75 hover:opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                      title="View product page"
                                    >
                                      <ExternalLink size={10} />
                                    </a>
                                  )}
                                </span>
                                <span className={`text-[10px] font-normal ${selectedPaddle === paddle.id ? 'opacity-75' : 'opacity-60'}`}>
                                  {paddle.description}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )
                  }

                  if (service.key === 'shell' && selectedServices.includes('shell')) {
                    return (
                      <>
                        <ServiceCard
                            key={service.key}
                            service={service}
                            partsCost={partsCost}
                            partsLabel={partsLabel}
                            total={total}
                            isSelected={selectedServices.includes(service.key)}
                            onSelect={() => toggleService(service.key)}
                            isEdge={isEdge}
                        />
                        <ShellSelector options={SHELL_OPTIONS} selected={selectedShells} onToggle={toggleShell} rate={rate} />
                      </>
                    )
                  }

                  if (service.key === 'clicky' && selectedServices.includes('clicky')) {
                    return (
                      <>
                        <ServiceCard
                            key={service.key}
                            service={service}
                            partsCost={partsCost}
                            partsLabel={partsLabel}
                            total={total}
                            isSelected={selectedServices.includes(service.key)}
                            onSelect={() => toggleService(service.key)}
                            isEdge={isEdge}
                        />
                        {/* Clicky kit selector */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                          <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-3">
                            Clicky kit
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {CLICKY_KIT_OPTIONS.map((kit) => (
                              <button
                                key={kit.id}
                                onClick={() =>
                                  setSelectedClickyKit((prev) => (prev === kit.id ? null : kit.id))
                                }
                                className={`flex flex-col items-start px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  selectedClickyKit === kit.id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                                }`}
                              >
                                <span className="flex items-center gap-1">
                                  {kit.name}
                                  <span className={`ml-1 text-[10px] ${selectedClickyKit === kit.id ? 'opacity-75' : 'opacity-60'}`}>
                                    ${toNzd(kit.priceUsd, rate).toFixed(0)}
                                  </span>
                                  {kit.link && (
                                    <a
                                      href={kit.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className={`${selectedClickyKit === kit.id ? 'opacity-75 hover:opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                      title="View product page"
                                    >
                                      <ExternalLink size={10} />
                                    </a>
                                  )}
                                </span>
                                <span className={`text-[10px] font-normal ${selectedClickyKit === kit.id ? 'opacity-75' : 'opacity-60'}`}>
                                  {kit.description} · {kit.maxBdm}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )
                  }


                  return (
                    <ServiceCard
                      key={service.key}
                      service={service}
                      partsCost={partsCost}
                      partsLabel={partsLabel}
                      total={total}
                      isSelected={selectedServices.includes(service.key)}
                      onSelect={() => toggleService(service.key)}
                      isEdge={isEdge}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group packages by tier */}
              {['repair', 'custom', 'elite'].map((tier) => {
                const tierPackages = PACKAGES.filter((p) => p.tier === tier);
                if (tierPackages.length === 0) return null;

                const tierLabel = tierPackages[0].tierLabel;
                const tierIcon = tier === 'repair' ? <Wrench size={13} /> : tier === 'custom' ? <Package size={13} /> : <Gamepad2 size={13} />;

                return (
                  <div key={tier}>
                    <h3 className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 mb-3 pb-2 border-b border-zinc-800 flex items-center gap-2">
                      {tierIcon} {tierLabel}
                    </h3>
                    <div className={`grid gap-3 ${tier === 'elite' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                      {tierPackages.map((pkg) => {
                        const quote = calculatePackage(pkg, tmrTier ?? DEFAULT_TMR, isEdge, userProvidesController, rate);
                        return (
                          <PackageCard
                            key={pkg.key}
                            pkg={pkg}
                            total={quote.total}
                            tmrName={(tmrTier ?? DEFAULT_TMR).name}
                            isSelected={selectedPackage === pkg.key}
                            onSelect={() => setSelectedPackage(selectedPackage === pkg.key ? null : pkg.key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quote Summary (sticky sidebar) */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-4">
            <QuoteSummary
              quote={activeQuote || { lines: [], subtotal: 0, tradeInDiscount: 0, total: 0 }}
              title={quoteTitle}
              onSend={handleSendQuote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
