import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK_PROVIDER_BIDS } from '@/services/mockData';
import { ProviderBid, EmergencyCategory, SosIncident, RescueProvider } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  Clock,
  ShieldCheck,
  Star,
  Truck,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Tag,
  DollarSign,
  AlertCircle,
  MapPin,
  Sparkles,
  SunMedium,
  MoonStar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface LiveBiddingPageProps {
  onIncidentUpdated: (inc: SosIncident | null) => void;
}

export const LiveBiddingPage: React.FC<LiveBiddingPageProps> = ({ onIncidentUpdated }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = (searchParams.get('category') as EmergencyCategory) || 'towing';

  const bidsList: ProviderBid[] =
    MOCK_PROVIDER_BIDS[categoryParam] || MOCK_PROVIDER_BIDS.towing;

  const [selectedBidId, setSelectedBidId] = useState<string>(bidsList[0]?.id || '');
  const [expandedBreakdownId, setExpandedBreakdownId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const selectedBid = bidsList.find((b) => b.id === selectedBidId) || bidsList[0];

  const themeClasses = useMemo(
    () =>
      theme === 'dark'
        ? {
            page: 'bg-[#070A10] text-slate-100',
            panel: 'bg-slate-900 border-slate-800',
            muted: 'text-slate-400',
            card: 'bg-slate-900 border-slate-800 hover:border-amber-500/40',
            selected: 'bg-slate-900 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]',
            accent: 'text-amber-400',
            subtle: 'bg-slate-800 text-slate-200 border-slate-700',
            section: 'bg-slate-950/70 border-slate-800',
          }
        : {
            page: 'bg-[#f5f7fb] text-slate-900',
            panel: 'bg-white border-slate-200',
            muted: 'text-slate-500',
            card: 'bg-white border-slate-200 hover:border-amber-300',
            selected: 'bg-[#fffaf0] border-amber-400 shadow-[0_12px_30px_rgba(245,158,11,0.14)]',
            accent: 'text-amber-600',
            subtle: 'bg-amber-50 text-amber-800 border-amber-200',
            section: 'bg-slate-50 border-slate-200',
          },
    [theme]
  );

  const handleAcceptBid = (bid: ProviderBid) => {
    // Convert chosen bid into an active rescue provider and save incident
    const providerObj: RescueProvider = {
      id: bid.providerId,
      companyName: bid.companyName,
      driverName: bid.driverName,
      driverAvatar: '',
      phoneMasked: bid.driverPhone,
      rating: bid.rating,
      completedRescues: bid.reviewsCount,
      vehicleType: bid.vehicleType,
      licensePlate: bid.licensePlate,
      currentCoordinates: [-1.2890, 36.8190],
      distanceMiles: bid.distanceKm * 0.621371,
      initialEtaMinutes: bid.etaMinutes,
      currentEtaMinutes: bid.etaMinutes,
      tier: 'Primary Responder',
      status: 'en_route',
    };

    const newIncident = storageService.createIncident(categoryParam, {
      assignedProvider: providerObj,
    });

    onIncidentUpdated(newIncident);
    toast.success(`Locked in with ${bid.companyName}! Unit ${bid.licensePlate} is en route.`);
    navigate('/tracking');
  };

  const toggleBreakdown = (id: string) => {
    setExpandedBreakdownId(expandedBreakdownId === id ? null : id);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 space-y-4 transition-colors ${themeClasses.page}`}>
      {/* Top Header: High-Stress Clarity */}
      <div className={`rounded-2xl border p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 ${themeClasses.panel}`}>
        <div>
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${themeClasses.accent}`}>
            <ShieldCheck className={`w-4 h-4 ${themeClasses.accent}`} />
            <span>Guaranteed Fixed Pricing Matrix</span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-black tracking-tight mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {bidsList.length} Verified Local Rigs Ready to Dispatch
          </h1>
          <p className={`text-xs mt-0.5 ${themeClasses.muted}`}>
            Prices are final and locked. Zero hidden charges, mileage markups, or towing surcharges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${theme === 'dark' ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-100 text-slate-700'}`}
          >
            {theme === 'dark' ? <SunMedium className="w-4 h-4" /> : <MoonStar className="w-4 h-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <span className={`text-xs font-bold border px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${themeClasses.subtle}`}>
            <CheckCircle2 className={`w-4 h-4 ${themeClasses.accent}`} />
            Fixed Price Guarantee ($0 Hidden Fees)
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
        {bidsList.map((bid) => {
          const isSelected = selectedBidId === bid.id;
          const isBreakdownOpen = expandedBreakdownId === bid.id;

          return (
            <div
              key={bid.id}
              onClick={() => setSelectedBidId(bid.id)}
              className={`rounded-3xl border p-5 flex flex-col justify-between transition-all cursor-pointer relative ${
                isSelected
                  ? themeClasses.selected
                  : themeClasses.card
              }`}
            >
              {/* Badges: Fastest ETA / Best Value */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  Unit {bid.licensePlate}
                </span>

                <div className="flex items-center gap-1.5">
                  {bid.isFastest && (
                    <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Fastest
                    </span>
                  )}
                  {bid.isBestValue && (
                    <span className="text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Best Value
                    </span>
                  )}
                </div>
              </div>

              {/* Provider Info & Rating */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-white leading-tight">
                  {bid.companyName}
                </h3>
                <div className={`text-xs flex items-center gap-2 ${themeClasses.muted}`}>
                  <span>Driver: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{bid.driverName}</strong></span>
                  <span>•</span>
                  <span className={`flex items-center gap-1 font-bold ${themeClasses.accent}`}>
                    <Star className={`w-3.5 h-3.5 fill-current ${themeClasses.accent}`} />
                    {bid.rating.toFixed(2)} ({bid.reviewsCount})
                  </span>
                </div>
              </div>

              {/* Key Metrics: Prominent Final Price & Verified ETA */}
              <div className={`my-4 p-3.5 rounded-2xl border space-y-2 ${theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs font-medium ${themeClasses.muted}`}>Final Fixed Price:</span>
                  <div className="text-right">
                    <span className={`text-2xl sm:text-3xl font-black font-mono ${themeClasses.accent}`}>
                      KES {bid.finalFixedPriceKes.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-500 block font-bold">
                      Guaranteed Total
                    </span>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-xs ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                  <span className={themeClasses.muted}>Verified Arrival Time:</span>
                  <span className="font-extrabold text-sm flex items-center gap-1 text-emerald-500">
                    <Clock className="w-3.5 h-3.5" />
                    {bid.etaMinutes} Mins ({bid.distanceKm} km away)
                  </span>
                </div>
              </div>

              {/* Equipment Compatibility Verification */}
              <div className={`p-3 rounded-xl border text-xs space-y-1 mb-4 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <div className={`font-bold flex items-center gap-1.5 text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <Truck className={`w-3.5 h-3.5 ${themeClasses.accent}`} />
                  <span>{bid.vehicleType}</span>
                </div>
                <div className={`text-[11px] leading-snug ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {bid.equipmentMatch}
                </div>
              </div>

              {/* Collapsible Price Breakdown */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBreakdown(bid.id);
                  }}
                  className={`w-full text-[11px] font-semibold flex items-center justify-between py-1 border-t ${theme === 'dark' ? 'text-slate-400 hover:text-white border-slate-800' : 'text-slate-500 hover:text-slate-900 border-slate-200'}`}
                >
                  <span>Itemized Price Breakdown</span>
                  {isBreakdownOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {isBreakdownOpen && (
                  <div className={`mt-2 p-2.5 rounded-xl border text-[11px] space-y-1 ${theme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Base Dispatch:</span>
                      <span className="font-mono">KES {bid.priceBreakdown.baseFareKes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Equipment Rig Fee:</span>
                      <span className="font-mono">KES {bid.priceBreakdown.equipmentKes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Transit & Mileage:</span>
                      <span className="font-mono">KES {bid.priceBreakdown.mileageFeeKes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Regulatory Taxes:</span>
                      <span className="font-mono">KES {bid.priceBreakdown.taxesKes}</span>
                    </div>
                    <div className={`flex justify-between pt-1 border-t font-bold ${theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-900'}`}>
                      <span>Total Guaranteed:</span>
                      <span className="font-mono text-amber-500">KES {bid.priceBreakdown.totalKes}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* One-Tap Lock-in CTA */}
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptBid(bid);
                }}
                className={`w-full h-12 rounded-xl font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isSelected
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                    : theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>Select & Lock In Rig</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Safety Notice & Back Navigation */}
      <div className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${theme === 'dark' ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>All providers are licensed, background-checked, and insured under Kenya transport laws.</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className={theme === 'dark' ? 'text-slate-300 hover:text-white text-xs' : 'text-slate-600 hover:text-slate-900 text-xs'}
        >
          Back to Diagnostic Tiles
        </Button>
      </div>
    </div>
  );
};
