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
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CollapsibleBentoCardsProps {
  vehicle: VehicleProfile;
  medical: MedicalProfile;
  contacts: EmergencyContact[];
  onOpenVehicleModal?: () => void;
  onOpenContactsModal?: () => void;
}

export const CollapsibleBentoCards: React.FC<CollapsibleBentoCardsProps> = ({
  vehicle,
  medical,
  contacts,
  onOpenVehicleModal,
  onOpenContactsModal,
}) => {
  // Collapsible accordion states to prevent crowding the main crisis screen
  const [hotlinesOpen, setHotlinesOpen] = useState(true);
  const [medicalOpen, setMedicalOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  const handleDial = (hotline: KenyaHotline) => {
    toast.success(`Dialing ${hotline.name} (${hotline.number})`);
    window.location.href = `tel:${hotline.number.replace(/\s+/g, '')}`;
  };

  return (
    <div className="w-full space-y-3 font-mono text-xs">
      {/* CARD 1: KENYAN EMERGENCY HOTLINES DIRECT DIAL */}
      <div className="bg-white border-2 border-black shadow-hard">
        <button
          type="button"
          onClick={() => setHotlinesOpen(!hotlinesOpen)}
          className="w-full p-3.5 bg-neutral-900 text-white flex items-center justify-between font-black uppercase text-xs"
        >
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-yellow-400" />
            <span>KENYA DIRECT EMERGENCY HOTLINES</span>
            <Badge className="rounded-none bg-red-600 text-white text-[9px] px-1 py-0 uppercase">
              ONE-TOUCH DIAL
            </Badge>
          </div>
          {hotlinesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {hotlinesOpen && (
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-neutral-50 border-t-2 border-black">
            {KENYA_EMERGENCY_HOTLINES.map((item) => (
              <button
                key={item.number}
                type="button"
                onClick={() => handleDial(item)}
                className="p-2.5 bg-white border-2 border-black shadow-hard-sm hover:bg-yellow-50 text-left transition-all active:translate-x-0.5 active:translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-black">{item.badge}</span>
                    <span className="text-[10px] bg-black text-white px-1 font-bold">
                      {item.number}
                    </span>
                  </div>
                  <div className="font-bold text-[11px] text-neutral-800 mt-1 truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </div>
                </div>

                <div className="mt-2 pt-1 border-t border-neutral-200 flex items-center justify-between text-[10px] font-bold text-red-600">
                  <span>TAP TO CALL</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* BENTO ROW: VEHICLE, MEDICAL & CONTACTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* CARD 2: VEHICLE PROFILE */}
        <div className="bg-white border-2 border-black shadow-hard flex flex-col">
          <button
            type="button"
            onClick={() => setVehicleOpen(!vehicleOpen)}
            className="p-3 bg-neutral-100 hover:bg-neutral-200 border-b-2 border-black flex items-center justify-between font-black uppercase text-xs text-black"
          >
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-black" />
              <span>VEHICLE DATA</span>
            </div>
            <span className="text-[11px] font-bold text-neutral-600">
              {vehicle.licensePlate} {vehicleOpen ? '▲' : '▼'}
            </span>
          </button>

          <div className={`p-3 space-y-1.5 text-[11px] ${vehicleOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Registration:</span>
              <span className="font-black text-black text-xs bg-yellow-300 px-1">
                {vehicle.licensePlate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Make & Model:</span>
              <span className="font-bold text-black">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Type / Drive:</span>
              <span className="font-bold text-black">{vehicle.type} ({vehicle.drivetrain})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Color:</span>
              <span className="font-bold text-black">{vehicle.color}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: MEDICAL PROFILE SHARING */}
        <div className="bg-white border-2 border-black shadow-hard flex flex-col">
          <button
            type="button"
            onClick={() => setMedicalOpen(!medicalOpen)}
            className="p-3 bg-neutral-100 hover:bg-neutral-200 border-b-2 border-black flex items-center justify-between font-black uppercase text-xs text-black"
          >
            <div className="flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>MEDICAL PROFILE</span>
            </div>
            <span className="text-[11px] font-bold text-neutral-600">
              Blood {medical.bloodType} {medicalOpen ? '▲' : '▼'}
            </span>
          </button>

          <div className={`p-3 space-y-1.5 text-[11px] ${medicalOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Blood Type:</span>
              <span className="font-black text-red-600 text-xs bg-red-100 px-1">
                {medical.bloodType}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Known Allergies:</span>
              <span className="font-bold text-black">{medical.allergies}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Condition:</span>
              <span className="font-bold text-black">{medical.chronicConditions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">NHIF/SHIF ID:</span>
              <span className="font-bold text-black">{medical.nhifShifNumber}</span>
            </div>
          </div>
        </div>

        {/* CARD 4: KENYAN EMERGENCY CONTACTS (+254) */}
        <div className="bg-white border-2 border-black shadow-hard flex flex-col">
          <button
            type="button"
            onClick={() => setContactsOpen(!contactsOpen)}
            className="p-3 bg-neutral-100 hover:bg-neutral-200 border-b-2 border-black flex items-center justify-between font-black uppercase text-xs text-black"
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>EMERGENCY CONTACTS</span>
            </div>
            <span className="text-[11px] font-bold text-neutral-600">
              {contacts.length} Linked {contactsOpen ? '▲' : '▼'}
            </span>
          </button>

          <div className={`p-3 space-y-2 text-[11px] ${contactsOpen ? 'block' : 'hidden md:block'}`}>
            {contacts.slice(0, 2).map((c) => (
              <div key={c.id} className="p-1.5 bg-neutral-50 border border-black flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">{c.name}</div>
                  <div className="text-[10px] text-neutral-500">{c.relationship}</div>
                </div>
                <div className="font-mono font-bold text-black">{c.phone}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
