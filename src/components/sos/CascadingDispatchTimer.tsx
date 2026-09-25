import React, { useEffect, useState } from 'react';
import { RescueProvider } from '@/types/sos';
import {
  RotateCcw,
  ShieldAlert,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { storageService } from '@/services/storage';

interface CascadingDispatchTimerProps {
  initialSeconds?: number;
  primaryProvider: RescueProvider;
  backupProvider?: RescueProvider;
  cascadeTriggered: boolean;
  onCascadeTrigger: () => void;
  onProviderAccepted: () => void;
  status: string;
}

export const CascadingDispatchTimer: React.FC<CascadingDispatchTimerProps> = ({
  initialSeconds = 55,
  primaryProvider,
  backupProvider,
  cascadeTriggered,
  onCascadeTrigger,
  onProviderAccepted,
  status,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isAccepted, setIsAccepted] = useState<boolean>(status !== 'dispatching' && status !== 'cascading');

  useEffect(() => {
    if (isAccepted || status === 'en_route' || status === 'arrived' || status === 'completed') {
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!cascadeTriggered) {
            storageService.playEmergencyAudioTone(660, 0.4, 'triangle');
            onCascadeTrigger();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAccepted, cascadeTriggered, onCascadeTrigger, status]);

  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / initialSeconds) * 100));

  const currentProvider = cascadeTriggered && backupProvider ? backupProvider : primaryProvider;

  return (
    <div className="w-full bg-white border-2 border-black p-3.5 shadow-hard font-mono text-xs space-y-3">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 border border-black ${cascadeTriggered ? 'bg-amber-500 animate-pulse' : 'bg-red-600 animate-ping'}`} />
          <span className="font-black text-sm uppercase tracking-wider">
            {cascadeTriggered ? 'TIER-2 BACKUP RESCUE ENGAGED' : 'AUTOMATED CASCADE DISPATCH'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-bold">
          <Clock className="w-3.5 h-3.5 text-red-600" />
          <span className="bg-black text-white px-2 py-0.5 text-xs">
            {secondsLeft > 0 ? `${secondsLeft}s CASCADE WINDOW` : 'CASCADE TRIGGERED'}
          </span>
        </div>
      </div>

      {/* Countdown Visual & Description */}
      {!isAccepted && secondsLeft > 0 && (
        <div className="space-y-1.5 bg-neutral-50 p-2 border border-black">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-bold text-neutral-800">
              Provider Acceptance Timeout (45–60s SLA):
            </span>
            <span className="font-black text-red-600">{secondsLeft} seconds</span>
          </div>

          <div className="w-full bg-neutral-200 h-3 border border-black overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                secondsLeft <= 15 ? 'bg-red-600' : secondsLeft <= 30 ? 'bg-amber-400' : 'bg-black'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[10px] text-neutral-600 leading-tight pt-1">
            If {primaryProvider.companyName} does not acknowledge within the response window, ticket automatically transfers to backup unit ({backupProvider?.companyName || 'Titan Fleet'}).
          </p>
        </div>
      )}

      {/* Cascaded Alert Notice */}
      {cascadeTriggered && (
        <div className="p-2.5 bg-amber-100 border-2 border-black text-amber-950 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <span className="font-black uppercase">Auto-Cascaded to Backup Provider: </span>
            Primary provider response window expired. Rerouted to <strong>{backupProvider?.companyName}</strong>. Unit is rolling out with ETA {backupProvider?.currentEtaMinutes} mins.
          </div>
        </div>
      )}

      {/* Manual testing action controls */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-dashed border-black">
        {!cascadeTriggered && secondsLeft > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={onCascadeTrigger}
            className="rounded-none border border-black text-[11px] h-7 px-2 font-bold uppercase hover:bg-neutral-100 flex items-center gap-1"
          >
            <ArrowRightLeft className="w-3 h-3" />
            Test Immediate Cascade to Backup
          </Button>
        )}

        {!isAccepted && (
          <Button
            size="sm"
            onClick={() => {
              setIsAccepted(true);
              onProviderAccepted();
            }}
            className="rounded-none bg-black hover:bg-neutral-800 text-white text-[11px] h-7 px-2 font-bold uppercase ml-auto flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3 text-green-400" />
            Simulate Provider Acceptance
          </Button>
        )}
      </div>
    </div>
  );
};
