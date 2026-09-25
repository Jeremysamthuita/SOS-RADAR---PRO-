import React, { useState } from 'react';
import { VolumeX, Heart, PhoneForwarded, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="w-full bg-white border-2 border-black p-3 shadow-hard font-mono text-xs">
      <div className="flex items-center justify-between border-b border-black pb-2 mb-2 font-black uppercase text-black">
        <span className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          ONE-TOUCH CRISIS PRESETS
        </span>
        <span className="text-[10px] text-neutral-500 font-normal">
          Instant swipe toggles before or during dispatch
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Silent Alarm Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !isSilentAlarm;
            onToggleSilentAlarm(next);
            toast.info(next ? 'Covert Silent Alarm Activated: zero loud UI sounds' : 'Silent Alarm Deactivated');
          }}
          className={`p-2.5 border-2 border-black text-left flex items-center justify-between transition-all ${
            isSilentAlarm ? 'bg-red-600 text-white font-bold' : 'bg-neutral-50 hover:bg-neutral-100 text-black'
          }`}
        >
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 shrink-0" />
            <div>
              <div className="font-black text-xs uppercase leading-tight">Silent Alarm</div>
              <div className="text-[10px] opacity-80">Covert alert / No horn</div>
            </div>
          </div>
          <span className="text-xs font-black">{isSilentAlarm ? 'ON' : 'OFF'}</span>
        </button>

        {/* Medical Profile Auto-Share */}
        <button
          type="button"
          onClick={() => {
            const next = !shareMedicalProfile;
            onToggleMedicalProfile(next);
            toast.info(next ? 'Medical Profile attached to responder payload' : 'Medical Profile hidden');
          }}
          className={`p-2.5 border-2 border-black text-left flex items-center justify-between transition-all ${
            shareMedicalProfile ? 'bg-emerald-600 text-white font-bold' : 'bg-neutral-50 hover:bg-neutral-100 text-black'
          }`}
        >
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 shrink-0" />
            <div>
              <div className="font-black text-xs uppercase leading-tight">Medical Share</div>
              <div className="text-[10px] opacity-80">Blood / Allergies / SHIF</div>
            </div>
          </div>
          <span className="text-xs font-black">{shareMedicalProfile ? 'ON' : 'OFF'}</span>
        </button>

        {/* Direct Audio Link */}
        <button
          type="button"
          onClick={() => {
            const next = !directAudioLinkActive;
            onToggleAudioLink(next);
            toast.info(next ? 'Direct voice channel opened with responder' : 'Direct voice channel standby');
          }}
          className={`p-2.5 border-2 border-black text-left flex items-center justify-between transition-all ${
            directAudioLinkActive ? 'bg-yellow-400 text-black font-black' : 'bg-neutral-50 hover:bg-neutral-100 text-black'
          }`}
        >
          <div className="flex items-center gap-2">
            <PhoneForwarded className="w-4 h-4 shrink-0" />
            <div>
              <div className="font-black text-xs uppercase leading-tight">Live Audio Link</div>
              <div className="text-[10px] opacity-80">Open direct responder mic</div>
            </div>
          </div>
          <span className="text-xs font-black">{directAudioLinkActive ? 'ACTIVE' : 'STANDBY'}</span>
        </button>
      </div>
    </div>
  );
};
