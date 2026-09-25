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
    <div className="w-full glass-panel rounded-2xl p-4 shadow-xl text-xs space-y-3 border border-white/10">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white uppercase tracking-tight">
            Cascading Dispatch Protocol
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            cascadeTriggered
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}
        >
          {cascadeTriggered ? 'Fallback Engaged' : 'Primary Lock'}
        </span>
      </div>

      {/* Timer Bar */}
      {!isAccepted && status !== 'arrived' && status !== 'completed' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Provider Acceptance Timeout:</span>
            <span className="font-mono font-bold text-amber-300 bg-slate-900/60 px-2.5 py-0.5 rounded-lg border border-white/5">
              {secondsLeft}s
            </span>
          </div>
          <Progress value={progressPercent} className="h-2 rounded-full bg-slate-800" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            If unconfirmed within {initialSeconds}s, the call will automatically cascade to backup rig:{' '}
            <span className="font-semibold text-white">{backupProvider?.companyName || 'Regional Recovery Depot'}</span>.
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="font-semibold text-xs">
            Unit Confirmed: {currentProvider.licensePlate} ({currentProvider.driverName})
          </span>
        </div>
      )}

      {/* Manual Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {!isAccepted && (
          <Button
            size="sm"
            onClick={() => {
              setIsAccepted(true);
              onProviderAccepted();
            }}
            className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8"
          >
            Simulate Acceptance
          </Button>
        )}
        {!cascadeTriggered && backupProvider && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onCascadeTrigger}
            className="rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs h-8"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
            Force Cascade
          </Button>
        )}
      </div>
    </div>
  );
};
