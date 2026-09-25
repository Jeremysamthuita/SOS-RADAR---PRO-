import React, { useState } from 'react';
import { TelemetryData, VehicleProfile } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  ShieldAlert,
  Radio,
  CheckCircle2,
  AlertOctagon,
  Volume2,
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
  statusText = 'SINGLE TAP TO DISPATCH RESCUE',
  isDispatching = false,
}) => {
  const [pressed, setPressed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSingleTap = () => {
    if (disabled || isDispatching) return;
    setPressed(true);

    // Haptic vibration feedback for instant physical confirmation
    storageService.triggerHapticPulse([150, 60, 150]);
    storageService.playEmergencyAudioTone(920, 0.25, 'sawtooth');

    setConfirmed(true);
    setTimeout(() => {
      setPressed(false);
      onTrigger();
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-5 w-full font-mono select-none">
      {/* Massive Front-and-Center Emergency Touch Target */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Concentric Warning Rings (Zero Glare Crimson) */}
        <span className="absolute -inset-4 sm:-inset-6 rounded-full border-4 border-red-600/30 animate-ping pointer-events-none" />
        <span className="absolute -inset-8 sm:-inset-10 rounded-full border-2 border-dashed border-red-600/20 pointer-events-none" />

        <button
          type="button"
          disabled={disabled || isDispatching}
          onClick={handleSingleTap}
          aria-label="Activate Emergency SOS"
          className={`relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full border-8 border-black flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-150 ${
            pressed || isDispatching
              ? 'scale-95 bg-red-900 shadow-none'
              : 'bg-red-600 hover:bg-red-700 shadow-hard hover:scale-[1.02]'
          } active:scale-90 touch-manipulation`}
        >
          {/* Inner Safety Ring */}
          <div className="w-[86%] h-[86%] rounded-full border-4 border-dashed border-white/80 flex flex-col items-center justify-center p-2 text-center bg-red-600/90">
            {isDispatching ? (
              <div className="flex flex-col items-center justify-center space-y-1">
                <Radio className="w-12 h-12 text-yellow-300 animate-spin" />
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  TRANSMITTING
                </span>
                <span className="text-[10px] bg-black text-yellow-300 font-bold px-2 py-0.5">
                  GPS + SENTINEL-1
                </span>
              </div>
            ) : (
              <>
                <ShieldAlert className="w-12 h-12 sm:w-16 sm:h-16 mb-1 text-white animate-pulse" />
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none uppercase drop-shadow-md">
                  SOS
                </span>
                <span className="text-xs sm:text-sm font-black tracking-widest uppercase mt-1 text-yellow-300">
                  PRESS FOR HELP
                </span>
                <span className="text-[9px] uppercase tracking-wider text-white/90 mt-1 font-semibold">
                  KENYA HIGHWAY RELAY
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Zero-Jargon Instant Status Readout Banner */}
      <div className="mt-5 w-full max-w-sm flex flex-col items-center text-center space-y-1.5">
        <div
          className={`w-full py-2 px-3 text-xs sm:text-sm font-black uppercase tracking-wide border-2 border-black flex items-center justify-center gap-2 ${
            isDispatching
              ? 'bg-yellow-400 text-black shadow-hard-sm animate-pulse'
              : 'bg-black text-white shadow-hard-sm'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{isDispatching ? 'HELP IS DISPATCHING TO YOUR GPS' : statusText}</span>
        </div>

        <div className="text-[11px] text-neutral-600 font-bold flex items-center gap-2">
          <span>Staging: {vehicle.licensePlate} ({vehicle.model})</span>
          <span>•</span>
          <span className="text-emerald-700">100% Free Roadside Relay</span>
        </div>
      </div>
    </div>
  );
};
