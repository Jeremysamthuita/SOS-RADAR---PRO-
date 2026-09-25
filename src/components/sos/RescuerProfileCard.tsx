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
    <div className="w-full glass-panel rounded-2xl p-5 shadow-xl text-xs space-y-4 border border-white/10">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span>{provider.companyName}</span>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                AA Verified
              </span>
            </div>
            <div className="text-slate-400 text-xs mt-0.5">
              Unit Plate: <span className="text-white font-mono font-semibold">{provider.licensePlate}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Current ETA</div>
          <div className="text-xl font-extrabold text-amber-300 font-mono">
            {provider.currentEtaMinutes} mins
          </div>
        </div>
      </div>

      {/* Progress Milestone Line */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>Mission Progress</span>
          <span className="text-white capitalize">{incidentStatus.replace('_', ' ')}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {stages.map((st, i) => {
            const isDone = i <= currentStageIndex;
            return (
              <div key={st.key} className="space-y-1 text-center">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isDone ? 'bg-gradient-to-r from-red-600 to-rose-500' : 'bg-slate-800'
                  }`}
                />
                <span className={`text-[10px] block ${isDone ? 'text-white font-bold' : 'text-slate-500'}`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rescuer Operator Data */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
        <div>
          <span className="text-slate-400 text-[11px] block">Assigned Responder</span>
          <span className="font-bold text-white text-xs mt-0.5 block">{provider.driverName}</span>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-1 rounded-lg text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{provider.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Action Buttons: Chat, Call, Share, Cancel */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          onClick={onOpenChat}
          className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs h-10 font-semibold flex items-center justify-center gap-2 border border-white/5"
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          <span>Masked Chat</span>
        </Button>

        <Button
          onClick={onOpenCall}
          className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs h-10 font-semibold flex items-center justify-center gap-2 border border-white/5"
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Call</span>
        </Button>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShareLiveLink}
          className="text-slate-400 hover:text-white hover:bg-white/5 text-xs h-8 px-2.5 rounded-lg flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share Live Link
        </Button>

        {onStatusAdvance && (
          <Button
            size="sm"
            onClick={onStatusAdvance}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs h-8 px-3 font-semibold"
          >
            Next Stage
          </Button>
        )}

        {onCancelIncident && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelIncident}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs h-8 px-2.5 rounded-lg"
          >
            Cancel Request
          </Button>
        )}
      </div>
    </div>
  );
};
