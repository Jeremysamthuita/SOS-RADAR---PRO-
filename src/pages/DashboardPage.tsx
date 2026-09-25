import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeafletRadarMap } from '@/components/map/LeafletRadarMap';
import { SosOneTouchButton } from '@/components/sos/SosOneTouchButton';
import { OneTouchPresets } from '@/components/sos/OneTouchPresets';
import { CollapsibleBentoCards } from '@/components/sos/CollapsibleBentoCards';
import { EmergencySafetyTools } from '@/components/sos/EmergencySafetyTools';
import {
  HotspotZone,
  VehicleProfile,
  TelemetryData,
  SosIncident,
  EmergencyCategory,
  MedicalProfile,
  EmergencyContact,
} from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  Radio,
  Battery,
  CloudRain,
  Compass,
  AlertTriangle,
  Car,
  ArrowRight,
  MapPin,
  Satellite,
  ShieldAlert,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DashboardPageProps {
  activeIncident: SosIncident | null;
  onIncidentUpdated: (inc: SosIncident | null) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  activeIncident,
  onIncidentUpdated,
}) => {
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState<TelemetryData>(storageService.getTelemetry());
  const [vehicles, setVehicles] = useState<VehicleProfile[]>(storageService.getVehicles());
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile>(
    storageService.getDefaultVehicle()
  );
  const [medical, setMedical] = useState<MedicalProfile>(storageService.getMedicalProfile());
  const [contacts, setContacts] = useState<EmergencyContact[]>(storageService.getContacts());
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotZone | null>(null);

  // One-Touch Presets State
  const [isSilentAlarm, setIsSilentAlarm] = useState(false);
  const [shareMedicalProfile, setShareMedicalProfile] = useState(true);
  const [directAudioLinkActive, setDirectAudioLinkActive] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  // Selected breakdown category quick tag
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('towing');

  // Sync active incident
  useEffect(() => {
    const inc = storageService.getActiveIncident();
    onIncidentUpdated(inc);
  }, [onIncidentUpdated]);

  // SINGLE-TAP SOS TRIGGER: Immediate execution with zero nested menus
  const handleSingleTapSos = () => {
    setIsDispatching(true);

    setTimeout(() => {
      const newIncident = storageService.createIncident(selectedCategory, {
        selectedVehicle,
        isSilentAlarm,
        shareMedicalProfile,
        directAudioLinkActive,
      });

      onIncidentUpdated(newIncident);
      setIsDispatching(false);
      toast.error('EMERGENCY DISTRESS BEACON ACTIVE: HELP IS DISPATCHING');
      navigate('/tracking');
    }, 400);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 md:py-5 space-y-4 font-mono">
      {/* Active Incident Warning Bar (if active) */}
      {activeIncident && (
        <div className="p-3 bg-red-600 text-white border-4 border-black shadow-hard flex flex-wrap items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-yellow-300 animate-spin" />
            <div>
              <div className="font-black text-sm uppercase tracking-wide">
                HELP IS DISPATCHING TO YOUR KENYA CORRIDOR: {activeIncident.id}
              </div>
              <div className="text-xs text-white/90">
                Assigned: {activeIncident.primaryProvider.companyName} • ETA: {activeIncident.primaryProvider.currentEtaMinutes} mins
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate('/tracking')}
            className="rounded-none bg-black hover:bg-neutral-900 text-white font-mono font-black text-xs h-9 px-3 border border-white flex items-center gap-1.5 uppercase tracking-wider"
          >
            VIEW LIVE RESCUE TRACKER
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Live Location Stream & Situational Sensor Readout */}
      <div className="w-full bg-neutral-950 text-white border-2 border-black p-3 shadow-hard flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <div>
            <span className="font-black text-yellow-300">LIVE KENYAN CORRIDOR:</span>{' '}
            <span className="text-white font-bold">{telemetry.highwayMarker}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-300">
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            {telemetry.cellularSignal}
          </span>
          <span className="flex items-center gap-1">
            <Battery className="w-3.5 h-3.5 text-yellow-400" />
            {telemetry.batteryLevel}% Battery
          </span>
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            {telemetry.heading}
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-neutral-400" />
            {telemetry.weatherCondition}
          </span>
        </div>
      </div>

      {/* Main Crisis Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Massive Single-Tap SOS Button & One-Touch Presets */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border-4 border-black p-4 sm:p-6 shadow-hard flex flex-col items-center justify-center text-center">
            {/* Header info */}
            <div className="w-full flex items-center justify-between border-b-2 border-black pb-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                SINGLE-TAP CRISIS DISPATCH
              </span>
              <Badge variant="outline" className="rounded-none border-black font-mono text-[10px] uppercase font-bold bg-yellow-400 text-black">
                ZERO MENU DELAYS
              </Badge>
            </div>

            {/* Quick Emergency Scenario Selector (Optional 1-touch tags) */}
            <div className="w-full my-2 flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
              {[
                { id: 'towing', label: 'TOWING' },
                { id: 'accident', label: 'ACCIDENT' },
                { id: 'flat_tire', label: 'FLAT TIRE' },
                { id: 'dead_battery', label: 'BATTERY BOOST' },
                { id: 'fuel_out', label: 'FUEL OUT' },
                { id: 'stuck_winch', label: 'MUD WINCH' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCategory(item.id as EmergencyCategory)}
                  className={`px-2 py-1 border font-bold uppercase transition-all ${
                    selectedCategory === item.id
                      ? 'bg-black text-white border-black shadow-hard-sm'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* THE MASSIVE SINGLE-TAP EMERGENCY BUTTON */}
            <SosOneTouchButton
              onTrigger={handleSingleTapSos}
              telemetry={telemetry}
              vehicle={selectedVehicle}
              isDispatching={isDispatching}
              statusText="TAP ONCE TO DISPATCH KENYA ROAD RESCUE"
            />

            {/* Active Vehicle Bar */}
            <div className="w-full mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-neutral-800">
                <Car className="w-3.5 h-3.5" />
                <span className="font-bold">Active Vehicle:</span>
              </div>
              <select
                value={selectedVehicle.id}
                onChange={(e) => {
                  const v = vehicles.find((x) => x.id === e.target.value);
                  if (v) setSelectedVehicle(v);
                }}
                className="bg-neutral-100 border border-black text-xs font-bold font-mono px-2 py-1 rounded-none"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.licensePlate} ({v.make} {v.model})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* One-Touch Presets (Silent Alarm, Medical Sharing, Audio Link) */}
          <OneTouchPresets
            isSilentAlarm={isSilentAlarm}
            onToggleSilentAlarm={setIsSilentAlarm}
            shareMedicalProfile={shareMedicalProfile}
            onToggleMedicalProfile={setShareMedicalProfile}
            directAudioLinkActive={directAudioLinkActive}
            onToggleAudioLink={setDirectAudioLinkActive}
          />

          {/* Emergency Safety Tools (Strobe, Decibel Horn, Direct 999/112 Call) */}
          <EmergencySafetyTools />
        </div>

        {/* Right Column: Tactical Leaflet Map & Collapsible Bento Hierarchy */}
        <div className="lg:col-span-6 space-y-4">
          {/* Tactical Leaflet Map with NASA Sentinel-1 SAR imagery and Kenyan Corridors */}
          <LeafletRadarMap
            userTelemetry={telemetry}
            activeProvider={activeIncident?.primaryProvider}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
            className="h-[400px] md:h-[440px]"
          />

          {/* Clean Data Hierarchy: Collapsible Bento Cards for secondary details */}
          <CollapsibleBentoCards
            vehicle={selectedVehicle}
            medical={medical}
            contacts={contacts}
          />
        </div>
      </div>
    </div>
  );
};
