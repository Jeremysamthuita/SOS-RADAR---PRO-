import React, { useState } from 'react';
import { TelemetryData, VehicleProfile } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  ShieldAlert,
  Radio,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';

interface SosOneTouchButtonProps {
  onTrigger: () => void;
  telemetry: TelemetryData;
  vehicle: VehicleProfile;
  disabled?: boolean;
  statusText?: string;
  isDispatching?: boolean;
}

export const SosOneTouchButton: React.FC<SosOneTouchButtonProps> = ({
  onTrigger,
  telemetry,
  vehicle,
  disabled = false,
  statusText = 'One-Touch Distress Beacon',
  isDispatching = false,
}) => {
  const [pressed, setPressed] = useState(false);

  const handleSingleTap = () => {
    if (disabled || isDispatching) return;
    setPressed(true);

    // Haptic vibration feedback
    storageService.triggerHapticPulse([150, 60, 150]);
    storageService.playEmergencyAudioTone(920, 0.25, 'sawtooth');

    setTimeout(() => {
      setPressed(false);
      onTrigger();
    }, 220);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full select-none">
      {/* Massive Glowing Circular Dial */}
      <div className="relative flex items-center justify-center my-3">
        {/* Ambient Gradient Glow Layers */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-red-600/30 via-rose-500/20 to-amber-500/10 blur-2xl animate-pulse pointer-events-none" />
        <div className="absolute -inset-4 rounded-full border border-red-500/20 animate-pulse-ring pointer-events-none" />
        <div className="absolute -inset-8 rounded-full border border-red-500/10 pointer-events-none" />

        <button
          type="button"
          disabled={disabled || isDispatching}
          onClick={handleSingleTap}
          aria-label="Activate Emergency SOS"
          className={`relative w-52 h-52 sm:w-60 sm:h-60 rounded-full flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-300 ${
            pressed || isDispatching
              ? 'scale-95 shadow-lg shadow-red-900/50'
              : 'hover:scale-[1.03] shadow-2xl shadow-red-600/40 hover:shadow-red-500/50'
          } bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 p-3.5 border-4 border-white/20 touch-manipulation`}
        >
          {/* Inner Frosted Glass Ring */}
          <div className="w-full h-full rounded-full bg-slate-950/40 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center p-3 text-center transition-all">
            {isDispatching ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Radio className="w-10 h-10 text-amber-300 animate-spin" />
                <span className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white">
                  Transmitting
                </span>
                <span className="text-[10px] bg-red-500/30 text-white font-medium px-2 py-0.5 rounded-full border border-red-500/30">
                  GPS + Highway Cad
                </span>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-white/10 mb-1 backdrop-blur-md">
                  <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none uppercase drop-shadow-md">
                  SOS
                </span>
                <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase mt-1 text-rose-200">
                  Tap For Help
                </span>
                <span className="text-[10px] text-white/70 mt-0.5 font-normal">
                  Kenya Highway Relay
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Modern Status Readout Pill */}
      <div className="mt-4 w-full max-w-sm flex flex-col items-center text-center space-y-2">
        <div
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 border transition-all ${
            isDispatching
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
              : 'glass-panel text-slate-200'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{isDispatching ? 'Emergency unit dispatching to your GPS' : statusText}</span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2 font-medium">
          <span>Staging: {vehicle.licensePlate}</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">100% Free Roadside Relay</span>
        </div>
      </div>
    </div>
  );
};
