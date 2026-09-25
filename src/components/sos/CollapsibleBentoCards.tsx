import React, { useState } from 'react';
import {
  VehicleProfile,
  MedicalProfile,
  EmergencyContact,
  KenyaHotline,
} from '@/types/sos';
import { KENYA_EMERGENCY_HOTLINES } from '@/services/mockData';
import {
  PhoneCall,
  Car,
  HeartPulse,
  Users,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface CollapsibleBentoCardsProps {
  vehicle: VehicleProfile;
  medical: MedicalProfile;
  contacts: EmergencyContact[];
}

export const CollapsibleBentoCards: React.FC<CollapsibleBentoCardsProps> = ({
  vehicle,
  medical,
  contacts,
}) => {
  const [hotlinesOpen, setHotlinesOpen] = useState(true);
  const [medicalOpen, setMedicalOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  const handleDial = (hotline: KenyaHotline) => {
    toast.success(`Calling ${hotline.name} (${hotline.number})`);
    window.location.href = `tel:${hotline.number.replace(/\s+/g, '')}`;
  };

  return (
    <div className="w-full space-y-3">
      {/* BENTO CARD 1: KENYAN DIRECT EMERGENCY HOTLINES */}
      <div className="glass-panel rounded-2xl p-4 shadow-lg border border-white/5">
        <button
          type="button"
          onClick={() => setHotlinesOpen(!hotlinesOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">Kenya Emergency Hotlines</div>
              <div className="text-xs text-slate-400">Direct one-tap toll-free and rescue dialers</div>
            </div>
          </div>
          <div className="text-slate-400 p-1 rounded-lg hover:bg-white/5">
            {hotlinesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {hotlinesOpen && (
          <div className="mt-3.5 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {KENYA_EMERGENCY_HOTLINES.map((item) => (
              <button
                key={item.number}
                type="button"
                onClick={() => handleDial(item)}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-white/10 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white group-hover:text-red-400 transition-colors">
                      {item.badge}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full border border-white/5">
                      {item.number}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-300 mt-1.5 truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {item.description}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-red-400">
                  <span>Call Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* BENTO ROW: VEHICLE, MEDICAL & CONTACTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* CARD 2: VEHICLE DATA */}
        <div className="glass-panel rounded-2xl p-4 shadow-lg border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-white">Vehicle Spec</span>
            </div>
            <span className="text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">
              {vehicle.licensePlate}
            </span>
          </div>

          <div className="mt-2 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Model:</span>
              <span className="font-medium text-white">{vehicle.year} {vehicle.make} {vehicle.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Type:</span>
              <span className="font-medium text-white">{vehicle.type} ({vehicle.drivetrain})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Color:</span>
              <span className="font-medium text-white">{vehicle.color}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: MEDICAL PROFILE */}
        <div className="glass-panel rounded-2xl p-4 shadow-lg border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-white">Medical Card</span>
            </div>
            <span className="text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
              Blood {medical.bloodType}
            </span>
          </div>

          <div className="mt-2 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Allergies:</span>
              <span className="font-medium text-white truncate max-w-[140px]">{medical.allergies}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Condition:</span>
              <span className="font-medium text-white truncate max-w-[140px]">{medical.chronicConditions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">SHIF ID:</span>
              <span className="font-medium text-white">{medical.nhifShifNumber}</span>
            </div>
          </div>
        </div>

        {/* CARD 4: CONTACTS (+254) */}
        <div className="glass-panel rounded-2xl p-4 shadow-lg border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-white">Emergency Contacts</span>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {contacts.length} Linked
            </span>
          </div>

          <div className="mt-2 space-y-1.5 text-xs">
            {contacts.slice(0, 2).map((c) => (
              <div key={c.id} className="flex justify-between items-center text-slate-300">
                <span className="truncate max-w-[110px] text-slate-400">{c.name}:</span>
                <span className="font-medium text-white">{c.phone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
