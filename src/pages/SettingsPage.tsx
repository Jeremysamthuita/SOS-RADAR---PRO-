import React, { useState } from 'react';
import { VehicleProfileManager } from '@/components/settings/VehicleProfileManager';
import { EmergencyContactsManager } from '@/components/settings/EmergencyContactsManager';
import { VehicleProfile, EmergencyContact, TelemetryData, MedicalProfile } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  Settings,
  MapPin,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleProfile[]>(storageService.getVehicles());
  const [contacts, setContacts] = useState<EmergencyContact[]>(storageService.getContacts());
  const [telemetry, setTelemetry] = useState<TelemetryData>(storageService.getTelemetry());
  const [medical, setMedical] = useState<MedicalProfile>(storageService.getMedicalProfile());

  const handleSimulateNewLocation = () => {
    const locations = [
      {
        marker: 'A104 Nairobi-Nakuru Corridor @ Kinungi Escarpment Mile 72',
        intersection: 'Naivasha Flyover / Mai Mahiu Junction',
        lat: -0.7850,
        lng: 36.5200,
      },
      {
        marker: 'A109 Mombasa Road @ Salama - Makindu Blackspot',
        intersection: 'Sultan Hamud Weighbridge',
        lat: -1.8700,
        lng: 37.2800,
      },
      {
        marker: 'A2 Thika Superhighway @ Juja Flyover',
        intersection: 'Exit 14 toward JKUAT Main Gate',
        lat: -1.1020,
        lng: 37.0140,
      },
      {
        marker: 'Nairobi Southern Bypass @ Langata Interchange',
        intersection: 'National Park Fence Corridor',
        lat: -1.3320,
        lng: 36.7550,
      },
      {
        marker: 'Nairobi Expressway @ Museum Hill Exit',
        intersection: 'Uhuru Highway / Westlands Viaduct',
        lat: -1.2750,
        lng: 36.8120,
      },
    ];

    const pick = locations[Math.floor(Math.random() * locations.length)];
    const updated: TelemetryData = {
      ...telemetry,
      latitude: pick.lat,
      longitude: pick.lng,
      highwayMarker: pick.marker,
      nearestIntersection: pick.intersection,
      timestamp: new Date().toISOString(),
    };
    storageService.saveTelemetry(updated);
    setTelemetry(updated);
    toast.success(`Kenyan Corridor Recalibrated: ${pick.marker}`);
  };

  const handleSaveMedical = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveMedicalProfile(medical);
    toast.success('Medical profile updated and linked to emergency responders.');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-2 space-y-5">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-300">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold text-white">
              Emergency Profile & Vehicle Garage
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Manage Kenyan vehicle registration, emergency medical card, and +254 contact alerts
          </p>
        </div>

        <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
          Kenya Relay Protocol Active
        </span>
      </div>

      {/* GPS Corridor Calibration Panel */}
      <div className="glass-panel rounded-2xl p-4 shadow-lg text-xs space-y-3 border border-white/5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2 font-semibold text-white">
            <MapPin className="w-4 h-4 text-rose-400" />
            Kenyan Highway Corridor Telemetry
          </div>
          <Button
            size="sm"
            onClick={handleSimulateNewLocation}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs h-8 px-3 font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            Simulate Corridor Shift
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Current Highway:</span>
            <span className="font-semibold text-white mt-0.5 block">{telemetry.highwayMarker}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">GPS Coordinates:</span>
            <span className="font-semibold text-white mt-0.5 block">
              {telemetry.latitude.toFixed(5)}, {telemetry.longitude.toFixed(5)} (±{telemetry.accuracyMeters}m)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Nearest Exit / Landmark:</span>
            <span className="font-semibold text-white mt-0.5 block">{telemetry.nearestIntersection}</span>
          </div>
        </div>
      </div>

      {/* Medical Emergency Profile Card */}
      <div className="glass-panel rounded-2xl p-5 shadow-lg text-xs space-y-3 border border-white/5">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2 font-semibold text-white">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            Emergency Medical Card & SHIF/NHIF
          </div>
          <span className="text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
            Auto-Attached on SOS
          </span>
        </div>

        <form onSubmit={handleSaveMedical} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Blood Type</Label>
            <Input
              value={medical.bloodType}
              onChange={(e) => setMedical({ ...medical, bloodType: e.target.value as any })}
              className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9 font-bold"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Allergies</Label>
            <Input
              value={medical.allergies}
              onChange={(e) => setMedical({ ...medical, allergies: e.target.value })}
              className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Conditions</Label>
            <Input
              value={medical.chronicConditions}
              onChange={(e) => setMedical({ ...medical, chronicConditions: e.target.value })}
              className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label className="text-xs text-slate-300">Preferred Hospital / SHIF ID</Label>
            <Input
              value={`${medical.emergencyCareHospital} • ${medical.nhifShifNumber}`}
              onChange={(e) => setMedical({ ...medical, nhifShifNumber: e.target.value })}
              className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs h-9"
            >
              Save Medical Card
            </Button>
          </div>
        </form>
      </div>

      {/* Vehicle Profile Manager */}
      <VehicleProfileManager
        vehicles={vehicles}
        onVehiclesChanged={setVehicles}
      />

      {/* Emergency Contacts Manager */}
      <EmergencyContactsManager
        contacts={contacts}
        onContactsChanged={setContacts}
      />

      {/* Plan Coverage Overview */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl text-xs space-y-3 border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Kenya Motorist Roadside Protection Plan
          </div>
          <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
            Active • 100% Covered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              AA Kenya Heavy Towing
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Up to 100km free flatbed carry to certified garage on all national A-class corridors.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Escarpment Mud & Winching
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Specialized heavy 4x4 rig extraction on Kinungi, Mai Mahiu, and Salama drop-offs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              45–60s Automated Cascade
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Guaranteed escalation to secondary certified responder if unacknowledged within 60s.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
