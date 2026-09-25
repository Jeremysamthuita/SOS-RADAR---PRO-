import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Flashlight,
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  X,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storageService } from '@/services/storage';

export const EmergencySafetyTools: React.FC = () => {
  const [strobeActive, setStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState<'amber' | 'red' | 'white'>('amber');
  const [hornActive, setHornActive] = useState(false);

  // Strobe effect interval
  useEffect(() => {
    if (!strobeActive) return;
    const colors: ('amber' | 'red' | 'white')[] = ['amber', 'white', 'red', 'white'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % colors.length;
      setStrobeColor(colors[idx]);
    }, 180);

    return () => clearInterval(interval);
  }, [strobeActive]);

  // Siren horn loop
  useEffect(() => {
    if (!hornActive) return;
    const interval = setInterval(() => {
      storageService.playEmergencyAudioTone(920, 0.35, 'sawtooth');
    }, 600);

    return () => clearInterval(interval);
  }, [hornActive]);

  return (
    <>
      {/* Safety Tools Action Bar */}
      <div className="w-full bg-white border-2 border-black p-3 shadow-hard font-mono">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
          <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            CRISIS SAFETY TOOLKIT
          </div>
          <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-bold uppercase">
            STRESS PROTOCOL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Strobe Beacon Button */}
          <Button
            type="button"
            onClick={() => setStrobeActive(true)}
            className="rounded-none border-2 border-black bg-amber-400 hover:bg-amber-500 text-black font-mono font-bold text-xs h-10 shadow-hard-sm flex items-center justify-center gap-1.5"
          >
            <Flashlight className="w-4 h-4 animate-bounce" />
            SCREEN HAZARD STROBE
          </Button>

          {/* Audio Horn Siren */}
          <Button
            type="button"
            onClick={() => {
              const next = !hornActive;
              setHornActive(next);
              if (next) {
                storageService.playEmergencyAudioTone(880, 0.5, 'square');
              }
            }}
            className={`rounded-none border-2 border-black font-mono font-bold text-xs h-10 shadow-hard-sm flex items-center justify-center gap-1.5 ${
              hornActive ? 'bg-red-600 text-white animate-pulse' : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            {hornActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {hornActive ? 'STOP SIREN HORN' : 'AUDIO SOS SIREN'}
          </Button>

          {/* Direct 911 Call Bypass */}
          <a
            href="tel:911"
            className="rounded-none border-2 border-black bg-red-600 hover:bg-red-700 text-white font-mono font-black text-xs h-10 shadow-hard-sm flex items-center justify-center gap-1.5 no-underline"
          >
            <PhoneCall className="w-4 h-4" />
            CALL 911 DIRECT
          </a>
        </div>

        {/* Rapid Roadside Survival Rule Checklist */}
        <div className="mt-2.5 pt-2 border-t border-black/30 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-neutral-800">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Turn wheels away from roadway</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Exit only via passenger door</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Remain behind barrier/guardrail</span>
          </div>
        </div>
      </div>

      {/* Full-Screen Traffic Warning Strobe Overlay */}
      {strobeActive && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 cursor-pointer select-none transition-colors duration-100 ${
            strobeColor === 'amber'
              ? 'bg-amber-400 text-black'
              : strobeColor === 'red'
              ? 'bg-red-600 text-white'
              : 'bg-white text-black'
          }`}
          onClick={() => setStrobeActive(false)}
        >
          <div className="w-full flex justify-between items-center font-mono font-black text-sm">
            <span className="border-2 border-current px-2 py-1 uppercase tracking-widest bg-black text-white">
              HAZARD BEACON ACTIVE
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setStrobeActive(false);
              }}
              className="rounded-none border-2 border-white font-mono font-bold bg-black text-white text-xs h-9 px-3 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> CLOSE STROBE
            </Button>
          </div>

          <div className="text-center font-mono space-y-4 max-w-lg">
            <AlertTriangle className="w-24 h-24 mx-auto stroke-[2.5] animate-bounce" />
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
              EMERGENCY STOP
            </h1>
            <p className="text-lg sm:text-xl font-bold uppercase tracking-wider">
              PLACE PHONE AGAINST REAR WINDOW FACING TRAFFIC
            </p>
          </div>

          <div className="text-center font-mono text-xs font-bold border-t-2 border-current pt-2 w-full">
            TAP ANYWHERE ON SCREEN TO TURN OFF
          </div>
        </div>
      )}
    </>
  );
};
