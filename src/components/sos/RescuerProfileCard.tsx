import React from 'react';
import { RescueProvider } from '@/types/sos';
import {
  PhoneCall,
  MessageSquare,
  Truck,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface RescuerProfileCardProps {
  provider: RescueProvider;
  incidentStatus: string;
  onOpenChat: () => void;
  onOpenCall: () => void;
  onCancelIncident?: () => void;
  onStatusAdvance?: () => void;
}

export const RescuerProfileCard: React.FC<RescuerProfileCardProps> = ({
  provider,
  incidentStatus,
  onOpenChat,
  onOpenCall,
  onCancelIncident,
  onStatusAdvance,
}) => {
  const stages = [
    { key: 'dispatching', label: 'Dispatched' },
    { key: 'en_route', label: 'En Route' },
    { key: 'arrived', label: 'Arrived' },
    { key: 'completed', label: 'Finished' },
  ];

  const currentStageIndex =
    incidentStatus === 'completed'
      ? 3
      : incidentStatus === 'arrived'
      ? 2
      : incidentStatus === 'en_route'
      ? 1
      : 0;

  const handleShareLiveLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Live tracking link copied to clipboard!');
    } else {
      toast.info('Live tracking active at current URL');
    }
  };

  return (
    <div className="w-full bg-white border-2 border-black p-4 shadow-hard font-mono space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
        <div className="flex items-center gap-3">
          <img
            src={provider.driverAvatar}
            alt={provider.driverName}
            className="w-12 h-12 object-cover border-2 border-black shadow-hard-sm rounded-none"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm uppercase tracking-tight text-black">
                {provider.driverName}
              </span>
              <Badge variant="outline" className="rounded-none border-black bg-yellow-400 text-black font-bold text-[10px] px-1 py-0 uppercase">
                {provider.tier}
              </Badge>
            </div>
            <div className="text-xs text-neutral-600 flex items-center gap-2 mt-0.5">
              <span>{provider.companyName}</span>
              <span className="flex items-center text-black font-bold">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
                {provider.rating} ({provider.completedRescues} rescues)
              </span>
            </div>
          </div>
        </div>

        {/* Live ETA Box */}
        <div className="bg-black text-white p-2 border border-black text-right shrink-0">
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest flex items-center justify-end gap-1">
            <Clock className="w-3 h-3 text-red-500" /> LIVE ETA
          </div>
          <div className="text-xl font-black text-yellow-300 leading-none">
            {provider.currentEtaMinutes} MINS
          </div>
          <div className="text-[10px] text-neutral-300">
            {provider.distanceMiles} miles away
          </div>
        </div>
      </div>

      {/* Vehicle Specs & Masked Telephony Line */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-neutral-50 p-2.5 border border-black">
        <div className="space-y-0.5">
          <span className="text-[10px] text-neutral-500 uppercase block">Rescuer Vehicle:</span>
          <div className="font-bold flex items-center gap-1.5 text-black">
            <Truck className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{provider.vehicleType}</span>
          </div>
          <span className="inline-block bg-black text-white text-[10px] px-1 font-mono font-bold">
            PLATE: {provider.licensePlate}
          </span>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-black/30 sm:pl-3">
          <span className="text-[10px] text-neutral-500 uppercase block">In-App Masked Routing:</span>
          <div className="font-bold text-red-700 font-mono text-[11px]">
            {provider.phoneMasked}
          </div>
          <span className="text-[10px] text-neutral-600 block">
            Protects driver & rescuer private cell numbers
          </span>
        </div>
      </div>

      {/* Progress Stages Pipeline */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold text-neutral-700">
          <span>DISPATCH PIPELINE</span>
          <span className="text-red-600 uppercase font-black">{stages[currentStageIndex]?.label}</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
          {stages.map((st, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={st.key}
                className={`p-1.5 border border-black uppercase transition-colors ${
                  isCurrent
                    ? 'bg-red-600 text-white font-black shadow-hard-sm'
                    : isCompleted
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {st.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t-2 border-black">
        <Button
          onClick={onOpenCall}
          className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs h-10 border-2 border-black shadow-hard-sm flex items-center justify-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          MASKED CALL
        </Button>

        <Button
          onClick={onOpenChat}
          className="rounded-none bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs h-10 border-2 border-black shadow-hard-sm flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5 text-yellow-400" />
          DIRECT CHAT
        </Button>

        <Button
          variant="outline"
          onClick={handleShareLiveLink}
          className="rounded-none border-2 border-black font-mono font-bold text-xs h-10 hover:bg-neutral-100 flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          SHARE TRACKER
        </Button>

        {onStatusAdvance && currentStageIndex < 3 ? (
          <Button
            variant="outline"
            onClick={onStatusAdvance}
            className="rounded-none border-2 border-black font-mono font-bold text-xs h-10 bg-yellow-400 text-black hover:bg-yellow-500 flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            ADVANCE STAGE
          </Button>
        ) : onCancelIncident ? (
          <Button
            variant="outline"
            onClick={onCancelIncident}
            className="rounded-none border-2 border-black font-mono font-bold text-xs h-10 text-red-600 hover:bg-red-50 flex items-center justify-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            CANCEL SOS
          </Button>
        ) : null}
      </div>
    </div>
  );
};
