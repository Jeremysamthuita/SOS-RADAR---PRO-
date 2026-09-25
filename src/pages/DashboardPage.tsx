import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeafletRadarMap } from '@/components/map/LeafletRadarMap';
import {
  EmergencyCategory,
  VehicleProfile,
  TelemetryData,
  SosIncident,
} from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  EMERGENCY_PRICE_OPTIONS,
  REQUIRED_TriageChecks,
  REQUIRED_TriageLabels,
  calculateEmergencyEstimate,
} from '@/lib/emergency-pricing';
import {
  Truck,
  Disc,
  Zap,
  KeyRound,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Clock,
  Radio,
  Car,
  ChevronRight,
  Battery,
  AlertTriangle,
  Flame,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DashboardPageProps {
  activeIncident: SosIncident | null;
  onIncidentUpdated: (inc: SosIncident | null) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  activeIncident,
  onIncidentUpdated,
}) => {
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState<TelemetryData>(storageService.getTelemetry());
  const [vehicles, setVehicles] = useState<VehicleProfile[]>(storageService.getVehicles());
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile>(
    storageService.getDefaultVehicle()
  );

  // The 4 Large Diagnostic Categories
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('towing');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [customAdjustment, setCustomAdjustment] = useState<number>(0);
  const [triageChecks, setTriageChecks] = useState<Record<string, boolean>>({
    safe_location: false,
    conscious_and_breathing: false,
    hazards_visible: false,
    vehicle_secure: false,
  });

  const pricingEstimate = useMemo(
    () =>
      calculateEmergencyEstimate(
        selectedCategory,
        selectedAddOns,
        triageChecks as Record<'safe_location' | 'conscious_and_breathing' | 'hazards_visible' | 'vehicle_secure', boolean>,
        customAdjustment
      ),
    [selectedCategory, selectedAddOns, triageChecks, customAdjustment]
  );

  const diagnosticTiles = [
    {
      id: 'towing' as EmergencyCategory,
      title: 'Flatbed Tow',
      subtitle: 'Mechanical failure, accident, AWD/4WD safe tilt-bed',
      eta: '9–14 min',
      priceFrom: 'KES 2,900',
      icon: Truck,
      color: 'amber',
      badge: 'Heavy Rig Ready',
    },
    {
      id: 'flat_tire' as EmergencyCategory,
      title: 'Flat Tire',
      subtitle: 'Mobile puncture repair, bead seal & spare wheel swap',
      eta: '6–10 min',
      priceFrom: 'KES 1,500',
      icon: Disc,
      color: 'amber',
      badge: 'Rapid Van',
    },
    {
      id: 'dead_battery' as EmergencyCategory,
      title: 'Dead Battery',
      subtitle: '12V/24V commercial power boost & alternator test',
      eta: '5–8 min',
      priceFrom: 'KES 1,200',
      icon: Zap,
      color: 'amber',
      badge: 'Fast Dispatch',
    },
    {
      id: 'lockout' as EmergencyCategory,
      title: 'Lockout / Fuel / Winch',
      subtitle: 'Door unlock, 10L fuel drop, or mud ditch winch',
      eta: '10–15 min',
      priceFrom: 'KES 2,200',
      icon: KeyRound,
      color: 'amber',
      badge: 'Multi-Tool Rig',
    },
  ];

  const handleProceedToBidding = () => {
    // Navigate directly to live bidding comparison matrix
    navigate(`/bidding?category=${selectedCategory}`);
  };

  const toggleAddOn = (optionId: string) => {
    setSelectedAddOns((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
    );
  };

  const toggleCheck = (checkId: string) => {
    setTriageChecks((current) => ({
      ...current,
      [checkId]: !current[checkId],
    }));
  };

  const handleInstantOneTap = () => {
    if (!pricingEstimate.requiredChecksComplete) {
      toast.error('Complete the pre-SOS safety evaluation before dispatching help.');
      return;
    }

    const newInc = storageService.createIncident(selectedCategory, {
      selectedVehicle,
      notes: `Triage confirmed. Estimated cost: KES ${pricingEstimate.total.toLocaleString()}. Services: ${pricingEstimate.selectedLabels.join(', ') || 'base rescue'} .`,
    });
    onIncidentUpdated(newInc);
    toast.success(`One-Tap Rescue Active: Dispatching nearest verified responder. Estimated total: KES ${pricingEstimate.total.toLocaleString()}`);
    navigate('/tracking');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 space-y-3">
      {/* Active Incident Warning Alert Bar */}
      {activeIncident && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-xl flex flex-wrap items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-slate-950 animate-spin" />
            <div>
              <div className="text-sm font-extrabold uppercase">
                ACTIVE RESCUE IN PROGRESS • {activeIncident.id}
              </div>
              <div className="text-xs font-medium text-slate-900">
                {activeIncident.primaryProvider.companyName} is en route (ETA {activeIncident.primaryProvider.currentEtaMinutes} mins)
              </div>
            </div>
          </div>
          <Button
            onClick={() => navigate('/tracking')}
            className="rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs h-9 px-4 font-bold"
          >
            Open Live Countdown Clock
          </Button>
        </div>
      )}

      {/* Top Location Bar: High-contrast Dark Mode with Highway Context */}
      <div className="safety-card rounded-2xl p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping shrink-0" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium">GPS Locked:</span>
            <span className="font-extrabold text-white text-xs sm:text-sm">
              {telemetry.highwayMarker}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Vehicle Pill */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-2.5 py-1 rounded-xl text-slate-300">
            <Car className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-white">{selectedVehicle.licensePlate}</span>
          </div>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-xl text-[11px] hidden sm:inline">
            3 Providers Online
          </span>
        </div>
      </div>

      {/* Main Grid: Prominent Map (dominant visual) & 4 Large Diagnostic Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Dominant Map (Desktop: 7 cols, Mobile: Top full width) */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden border border-white/10 shadow-2xl safety-card min-h-[320px] lg:min-h-[580px]">
          <LeafletRadarMap
            userTelemetry={telemetry}
            activeProvider={activeIncident?.primaryProvider}
            className="w-full flex-1 min-h-[320px] lg:min-h-[580px]"
          />
        </div>

        {/* 4 Large Diagnostic Tiles + Dispatch Bar (Desktop: 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {/* Section Header */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Select Emergency Diagnostic
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              1-Tap Dispatch Ready
            </span>
          </div>

          {/* THE 4 LARGE DIAGNOSTIC TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
            {diagnosticTiles.map((tile) => {
              const Icon = tile.icon;
              const isSelected = selectedCategory === tile.id;
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => setSelectedCategory(tile.id)}
                  className={`p-4 rounded-2xl text-left transition-all flex flex-col justify-between relative group ${
                    isSelected
                      ? 'safety-card-selected'
                      : 'safety-card hover:border-amber-400/40 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                          : 'bg-slate-800 text-amber-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isSelected
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-slate-800 text-slate-400 border-white/5'
                      }`}
                    >
                      {tile.badge}
                    </span>
                  </div>

                  {/* Middle: Title & Subtitle */}
                  <div className="my-3">
                    <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
                      {tile.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {tile.subtitle}
                    </p>
                  </div>

                  {/* Bottom: Pricing & ETA Guarantee */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs w-full">
                    <span className="font-extrabold text-amber-300">
                      {tile.priceFrom}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {tile.eta}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Emergency pricing & evaluation panel */}
          <div className="rounded-2xl border border-amber-400/20 bg-slate-950/70 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                Pre-SOS assessment
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">
                {pricingEstimate.requiredChecksComplete ? 'Ready to dispatch' : 'Needs review'}
              </span>
            </div>

            <div className="space-y-2">
              {EMERGENCY_PRICE_OPTIONS[selectedCategory]?.map((option) => (
                <label
                  key={option.id}
                  className="flex items-start gap-2 rounded-xl border border-white/10 bg-slate-900/70 p-2 text-left cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(option.id)}
                    onChange={() => toggleAddOn(option.id)}
                    className="mt-1 h-4 w-4 accent-amber-400"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold text-white">{option.label}</span>
                    <span className="block text-[10px] text-slate-400">{option.description}</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-300">KES {option.price.toLocaleString()}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2 border-t border-white/10 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-300">Safety check</span>
                <span className="text-[10px] text-slate-400">{Object.values(triageChecks).filter(Boolean).length}/4</span>
              </div>

              {REQUIRED_TriageChecks.map((check) => (
                <label key={check} className="flex items-center justify-between gap-2 text-[11px] text-slate-200">
                  <span className="flex-1">{REQUIRED_TriageLabels[check]}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(triageChecks[check])}
                    onChange={() => toggleCheck(check)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                </label>
              ))}
            </div>

            <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-2.5 text-[11px] text-slate-200">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="font-bold uppercase tracking-wide text-amber-300">Estimated price</span>
                <span className="font-black text-lg text-white">KES {pricingEstimate.total.toLocaleString()}</span>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Base service</span>
                  <span>KES {pricingEstimate.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Add-ons</span>
                  <span>KES {pricingEstimate.modifierTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Custom adjustment</span>
                  <input
                    type="number"
                    value={customAdjustment}
                    onChange={(event) => setCustomAdjustment(Number(event.target.value) || 0)}
                    className="w-20 rounded-md border border-white/10 bg-slate-900 px-2 py-1 text-right text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs: High-Stress Single-Tap Call or View Live Bids */}
          <div className="space-y-2 pt-1">
            {/* Primary Action Button: View Live Bidding & Comparison Matrix */}
            <Button
              type="button"
              onClick={handleProceedToBidding}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl safety-amber-glow flex items-center justify-center gap-2 border-none"
            >
              <span>Compare Live Provider Bids & Prices</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </Button>

            {/* Instant Fast Dispatch Button */}
            <Button
              type="button"
              onClick={handleInstantOneTap}
              disabled={!pricingEstimate.requiredChecksComplete}
              className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Instant 1-Tap Auto-Dispatch Nearest Rig</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
