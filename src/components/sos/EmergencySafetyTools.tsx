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
      <div className="w-full glass-panel rounded-2xl p-4 shadow-lg text-xs border border-white/5">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
          <div className="flex items-center gap-2 font-semibold text-white">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Highway Hazard Safety Tools
          </div>
          <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full font-medium border border-white/5">
            Night / Fog Assist
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Strobe Beacon Button */}
          <Button
            type="button"
            onClick={() => setStrobeActive(!strobeActive)}
            className={`h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              strobeActive
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-white/5'
            }`}
          >
            <Flashlight className="w-4 h-4" />
            <span>{strobeActive ? 'Stop Strobe' : 'Screen Strobe Flasher'}</span>
          </Button>

          {/* Distress Siren Horn */}
          <Button
            type="button"
            onClick={() => setHornActive(!hornActive)}
            className={`h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              hornActive
                ? 'bg-rose-600 text-white font-bold animate-pulse shadow-lg shadow-rose-600/30'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-white/5'
            }`}
          >
            {hornActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{hornActive ? 'Silence Siren' : '920Hz Distress Siren'}</span>
          </Button>

          {/* Direct 999 Police Hotkey */}
          <a
            href="tel:999"
            className="h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-500/20 no-underline transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Dial Kenya Police 999</span>
          </a>
        </div>
      </div>

      {/* Fullscreen Strobe Modal Overlay */}
      {strobeActive && (
        <div
          onClick={() => setStrobeActive(false)}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer transition-colors duration-100 ${
            strobeColor === 'amber'
              ? 'bg-amber-400 text-black'
              : strobeColor === 'red'
              ? 'bg-red-600 text-white'
              : 'bg-white text-black'
          }`}
        >
          <div className="p-6 rounded-3xl bg-black/60 text-white text-center backdrop-blur-md max-w-sm mx-4 space-y-3">
            <AlertTriangle className="w-12 h-12 text-amber-300 mx-auto animate-bounce" />
            <h2 className="text-xl font-extrabold uppercase">High-Intensity Roadside Hazard Strobe</h2>
            <p className="text-xs text-slate-300">
              Face phone toward oncoming traffic behind vehicle warning triangle. Tap anywhere to close.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStrobeActive(false)}
              className="rounded-xl border border-white/60 text-white hover:bg-white/10 text-xs"
            >
              <X className="w-4 h-4 mr-1" />
              Close Strobe
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
