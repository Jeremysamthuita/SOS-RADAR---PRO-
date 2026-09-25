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
  PhoneCall,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-6 font-mono">
      {/* Top Banner */}
      <div className="bg-black text-white border-2 border-black p-4 shadow-hard flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-yellow-300" />
            <h1 className="text-sm font-black uppercase tracking-wider text-white">
              KENYA EMERGENCY CONFIGURATION & PROFILE COMMAND
            </h1>
          </div>
          <p className="text-neutral-400 text-xs mt-0.5">
            Configure vehicle specs (Kenyan plates), medical emergency cards, and contacts (+254)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-none border-white text-white font-mono text-xs">
            KENYA RELAY PROTOCOL
          </Badge>
        </div>
      </div>

      {/* GPS & Corridor Calibration Panel */}
      <div className="bg-white border-2 border-black p-4 shadow-hard text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2">
          <div className="flex items-center gap-2 font-black uppercase text-black">
            <MapPin className="w-4 h-4 text-red-600" />
            KENYAN HIGHWAY TELEMETRY CORRIDOR
          </div>
          <Button
            size="sm"
            onClick={handleSimulateNewLocation}
            className="rounded-none bg-black text-white hover:bg-neutral-800 text-[11px] h-8 px-2.5 font-bold uppercase flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Simulate Kenya Corridor Shift
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-neutral-50 p-2.5 border border-black text-[11px]">
          <div>
            <span className="text-neutral-500 uppercase block">Active Highway Marker:</span>
            <span className="font-bold text-black">{telemetry.highwayMarker}</span>
          </div>
          <div>
            <span className="text-neutral-500 uppercase block">Coordinates:</span>
            <span className="font-bold text-black">
              {telemetry.latitude.toFixed(5)}, {telemetry.longitude.toFixed(5)} (±{telemetry.accuracyMeters}m)
            </span>
          </div>
          <div>
            <span className="text-neutral-500 uppercase block">Nearest Intersection / Junction:</span>
            <span className="font-bold text-black">{telemetry.nearestIntersection}</span>
          </div>
        </div>
      </div>

      {/* Medical Emergency Profile Card */}
      <div className="bg-white border-2 border-black p-4 shadow-hard text-xs space-y-3">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2 font-black uppercase text-black">
            <HeartPulse className="w-4 h-4 text-red-600" />
            EMERGENCY MEDICAL PROFILE & SHIF/NHIF
          </div>
          <Badge className="rounded-none bg-red-600 text-white font-bold text-[10px]">
            DISPATCH PAYLOAD READY
          </Badge>
        </div>

        <form onSubmit={handleSaveMedical} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-[11px] font-bold uppercase text-black">Blood Type</Label>
            <Input
              value={medical.bloodType}
              onChange={(e) => setMedical({ ...medical, bloodType: e.target.value as any })}
              className="rounded-none border-2 border-black font-mono text-xs h-9 bg-neutral-50 font-bold"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-bold uppercase text-black">Allergies</Label>
            <Input
              value={medical.allergies}
              onChange={(e) => setMedical({ ...medical, allergies: e.target.value })}
              className="rounded-none border-2 border-black font-mono text-xs h-9 bg-neutral-50"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-bold uppercase text-black">Conditions</Label>
            <Input
              value={medical.chronicConditions}
              onChange={(e) => setMedical({ ...medical, chronicConditions: e.target.value })}
              className="rounded-none border-2 border-black font-mono text-xs h-9 bg-neutral-50"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label className="text-[11px] font-bold uppercase text-black">Hospital / SHIF Number</Label>
            <Input
              value={`${medical.emergencyCareHospital} • ${medical.nhifShifNumber}`}
              onChange={(e) => setMedical({ ...medical, nhifShifNumber: e.target.value })}
              className="rounded-none border-2 border-black font-mono text-xs h-9 bg-neutral-50"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full rounded-none bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs h-9 uppercase"
            >
              SAVE MEDICAL DATA
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

      {/* Kenyan Motorist Emergency Protection Plan Status */}
      <div className="bg-white border-2 border-black p-5 shadow-hard text-black space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2">
          <div className="flex items-center gap-2 font-black text-base uppercase">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            KENYA MOTORIST ROADSIDE PROTECTION PLAN
          </div>
          <Badge className="rounded-none bg-emerald-600 text-white font-mono text-xs uppercase font-bold">
            ACTIVE • 100% COVERED
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-neutral-50 border border-black space-y-1">
            <div className="font-bold text-black uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              AA KENYA HEAVY TOWING
            </div>
            <p className="text-[11px] text-neutral-600">
              Free towing up to 100km to nearest certified garage along all primary A-class corridors.
            </p>
          </div>

          <div className="p-3 bg-neutral-50 border border-black space-y-1">
            <div className="font-bold text-black uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ESCARPMENT WINCHING & MUD
            </div>
            <p className="text-[11px] text-neutral-600">
              Heavy 4x4 recovery on Kinungi, Mai Mahiu, and Salama steep ditch drop-offs.
            </p>
          </div>

          <div className="p-3 bg-neutral-50 border border-black space-y-1">
            <div className="font-bold text-black uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              45–60S CASCADE SLA
            </div>
            <p className="text-[11px] text-neutral-600">
              Automatic failover to Kenya Red Cross or secondary heavy rig if primary is delayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
