import React, { useState } from 'react';
import { VolumeX, Heart, PhoneForwarded, Radio } from 'lucide-react';
import { toast } from 'sonner';

interface OneTouchPresetsProps {
  isSilentAlarm: boolean;
  onToggleSilentAlarm: (val: boolean) => void;
  shareMedicalProfile: boolean;
  onToggleMedicalProfile: (val: boolean) => void;
  directAudioLinkActive: boolean;
  onToggleAudioLink: (val: boolean) => void;
}

export const OneTouchPresets: React.FC<OneTouchPresetsProps> = ({
  isSilentAlarm,
  onToggleSilentAlarm,
  shareMedicalProfile,
  onToggleMedicalProfile,
  directAudioLinkActive,
  onToggleAudioLink,
}) => {
  return (
    <div className="w-full glass-panel rounded-2xl p-4 shadow-lg text-xs">
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
        <span className="font-semibold text-xs text-slate-200 flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-rose-500" />
          Emergency Presets
        </span>
        <span className="text-[10px] text-slate-400">
          One-touch quick toggles
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Silent Alarm Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !isSilentAlarm;
            onToggleSilentAlarm(next);
            toast.info(next ? 'Silent Alarm Enabled: Dispatches quietly' : 'Silent Alarm Disabled');
          }}
          className={`p-3 rounded-xl text-left flex items-center justify-between border transition-all ${
            isSilentAlarm
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-semibold'
              : 'bg-slate-900/40 border-white/5 hover:border-white/10 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${isSilentAlarm ? 'bg-rose-500/30' : 'bg-white/5'}`}>
              <VolumeX className="w-4 h-4 shrink-0 text-rose-400" />
            </div>
            <div>
              <div className="font-semibold text-xs leading-tight">Silent Alarm</div>
              <div className="text-[10px] text-slate-400">Covert dispatch</div>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${isSilentAlarm ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {isSilentAlarm ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Medical Profile Auto-Share */}
        <button
          type="button"
          onClick={() => {
            const next = !shareMedicalProfile;
            onToggleMedicalProfile(next);
            toast.info(next ? 'Medical Profile attached to rescue' : 'Medical Profile hidden');
          }}
          className={`p-3 rounded-xl text-left flex items-center justify-between border transition-all ${
            shareMedicalProfile
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
              : 'bg-slate-900/40 border-white/5 hover:border-white/10 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${shareMedicalProfile ? 'bg-emerald-500/30' : 'bg-white/5'}`}>
              <Heart className="w-4 h-4 shrink-0 text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold text-xs leading-tight">Medical Share</div>
              <div className="text-[10px] text-slate-400">Blood & Allergies</div>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${shareMedicalProfile ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {shareMedicalProfile ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Direct Audio Link */}
        <button
          type="button"
          onClick={() => {
            const next = !directAudioLinkActive;
            onToggleAudioLink(next);
            toast.info(next ? 'Live responder audio line opened' : 'Audio line standby');
          }}
          className={`p-3 rounded-xl text-left flex items-center justify-between border transition-all ${
            directAudioLinkActive
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
              : 'bg-slate-900/40 border-white/5 hover:border-white/10 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${directAudioLinkActive ? 'bg-amber-500/30' : 'bg-white/5'}`}>
              <PhoneForwarded className="w-4 h-4 shrink-0 text-amber-400" />
            </div>
            <div>
              <div className="font-semibold text-xs leading-tight">Live Audio</div>
              <div className="text-[10px] text-slate-400">Direct mic line</div>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${directAudioLinkActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
            {directAudioLinkActive ? 'ACTIVE' : 'STANDBY'}
          </span>
        </button>
      </div>
    </div>
  );
};
