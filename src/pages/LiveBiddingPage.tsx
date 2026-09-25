import React, { useState } from 'react';
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

  const selectedBid = bidsList.find((b) => b.id === selectedBidId) || bidsList[0];

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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 space-y-4">
      {/* Top Header: High-Stress Clarity */}
      <div className="safety-card rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Guaranteed Fixed Pricing Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {bidsList.length} Verified Local Rigs Ready to Dispatch
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Prices are final and locked. Zero hidden charges, mileage markups, or towing surcharges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
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
              className={`rounded-3xl p-5 flex flex-col justify-between transition-all cursor-pointer relative ${
                isSelected
                  ? 'safety-card-selected'
                  : 'safety-card hover:border-amber-400/40 hover:bg-slate-900/60'
              }`}
            >
              {/* Badges: Fastest ETA / Best Value */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-white/5">
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
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Driver: <strong className="text-white">{bid.driverName}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {bid.rating.toFixed(2)} ({bid.reviewsCount})
                  </span>
                </div>
              </div>

              {/* Key Metrics: Prominent Final Price & Verified ETA */}
              <div className="my-4 p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-medium">Final Fixed Price:</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                      KES {bid.finalFixedPriceKes.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-bold">
                      Guaranteed Total
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Verified Arrival Time:</span>
                  <span className="font-extrabold text-white text-sm flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    {bid.etaMinutes} Mins ({bid.distanceKm} km away)
                  </span>
                </div>
              </div>

              {/* Equipment Compatibility Verification */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 space-y-1 mb-4">
                <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{bid.vehicleType}</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
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
                  className="w-full text-[11px] font-semibold text-slate-400 hover:text-white flex items-center justify-between py-1 border-t border-white/5"
                >
                  <span>Itemized Price Breakdown</span>
                  {isBreakdownOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {isBreakdownOpen && (
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-900/90 border border-white/5 text-[11px] space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Dispatch:</span>
                      <span className="font-mono">KES {bid.priceBreakdown.baseFareKes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Equipment Rig Fee:</span>
                      <span className="font-mono">KES {bid.priceBreakdown.equipmentKes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transit & Mileage:</span>
                      <span className="font-mono">KES {bid.priceBreakdown.mileageFeeKes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Regulatory Taxes:</span>
                      <span className="font-mono">KES {bid.priceBreakdown.taxesKes}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/10 font-bold text-white">
                      <span>Total Guaranteed:</span>
                      <span className="font-mono text-amber-400">KES {bid.priceBreakdown.totalKes}</span>
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
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
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
      <div className="p-3.5 rounded-2xl safety-card flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>All providers are licensed, background-checked, and insured under Kenya transport laws.</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-slate-300 hover:text-white text-xs"
        >
          Back to Diagnostic Tiles
        </Button>
      </div>
    </div>
  );
};
