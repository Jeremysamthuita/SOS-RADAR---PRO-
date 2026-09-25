import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SosIncident, TelemetryData } from '@/types/sos';
import { storageService } from '@/services/storage';
import { LeafletRadarMap } from '@/components/map/LeafletRadarMap';
import { MaskedCommunicationModal } from '@/components/sos/MaskedCommunicationModal';
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Flashlight,
  Volume2,
  VolumeX,
  X,
  Star,
  MapPin,
  Car,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ActiveRescuePageProps {
  activeIncident: SosIncident | null;
  onIncidentUpdated: (incident: SosIncident | null) => void;
}

export const ActiveRescuePage: React.FC<ActiveRescuePageProps> = ({
  activeIncident,
  onIncidentUpdated,
}) => {
  const navigate = useNavigate();

  // If no incident, generate or load fallback active incident so screen can be previewed immediately
  const incident: SosIncident =
    activeIncident ||
    storageService.getActiveIncident() ||
    storageService.createIncident('towing');

  const [telemetry, setTelemetry] = useState<TelemetryData>(incident.telemetry);
  const [provider, setProvider] = useState(incident.primaryProvider);
  const [commModalOpen, setCommModalOpen] = useState(false);
  const [commTab, setCommTab] = useState<'chat' | 'call'>('call');

  // Anxiety-Reduction Digital Countdown Clock
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    incident.primaryProvider.currentEtaMinutes * 60
  );

  // Fullscreen Hazard Phone Strobe
  const [strobeActive, setStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState<'amber' | 'white'>('amber');

  // Sirens
  const [sirenActive, setSirenActive] = useState(false);

  // Live countdown timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format countdown mm:ss
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Strobe beacon flash interval
  useEffect(() => {
    if (!strobeActive) return;
    const interval = setInterval(() => {
      setStrobeColor((c) => (c === 'amber' ? 'white' : 'amber'));
    }, 200);
    return () => clearInterval(interval);
  }, [strobeActive]);

  // Siren horn sound effect
  useEffect(() => {
    if (!sirenActive) return;
    const interval = setInterval(() => {
      storageService.playEmergencyAudioTone(940, 0.35, 'sawtooth');
    }, 600);
    return () => clearInterval(interval);
  }, [sirenActive]);

  const handleShareTracking = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Live rescue tracking link copied to clipboard.');
    }
  };

  const handleCancelRescue = () => {
    storageService.cancelIncident(incident.id);
    onIncidentUpdated(null);
    toast.info('Roadside rescue cancelled.');
    navigate('/');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 space-y-3.5">
      {/* 1. ANXIETY-REDUCTION COUNTDOWN CLOCK HEADER (High-Visibility Safety Amber) */}
      <div className="safety-card rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Rescue Rig En Route • Live Tracking Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Help is on the way. Remain calm and stay safe.
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Location: <strong>{telemetry.highwayMarker}</strong></span>
            </p>
          </div>

          {/* Prominent Digital Countdown Timer */}
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-400/40 safety-amber-glow flex items-center gap-4 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Estimated Arrival In
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 tracking-tight">
                {timeFormatted}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 block">
                {(provider.distanceMiles * 1.60934).toFixed(1)} km away
              </span>
              <span className="text-[10px] text-slate-400">Speed: ~45 km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN SPLIT: Real-Time Map & Provider Verification / Safety Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left: Real-Time Provider Location Map */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/10 shadow-2xl safety-card min-h-[340px] lg:min-h-[560px] flex flex-col">
          <LeafletRadarMap
            userTelemetry={telemetry}
            activeProvider={provider}
            className="w-full flex-1 min-h-[340px] lg:min-h-[560px]"
          />
        </div>

        {/* Right: Driver Verification Card & Safety Protocols */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5">
          {/* Driver & Vehicle Plate Verification Card (Anti-Impersonation) */}
          <div className="safety-card rounded-3xl p-5 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-black uppercase text-white tracking-wide">
                  Verified Responder Identification
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
                AA Kenya Verified
              </span>
            </div>

            {/* Responder Profile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {provider.companyName}
                  </h3>
                  <div className="text-xs text-slate-300">
                    Operator: <strong className="text-white">{provider.driverName}</strong>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400">Rating</div>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {provider.rating.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Prominent Vehicle Plate Display (Matches strictly for driver safety) */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-400/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Verify License Plate On Arrival
                </span>
                <span className="text-xl font-black font-mono text-amber-400 tracking-wider">
                  {provider.licensePlate}
                </span>
              </div>
              <span className="text-xs text-slate-300 font-medium">
                {provider.vehicleType}
              </span>
            </div>

            {/* Direct Contact Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                type="button"
                onClick={() => {
                  setCommTab('call');
                  setCommModalOpen(true);
                }}
                className="h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
              >
                <PhoneCall className="w-4 h-4 text-slate-950" />
                <span>Call Driver</span>
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setCommTab('chat');
                  setCommModalOpen(true);
                }}
                className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/5"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Message</span>
              </Button>
            </div>
          </div>

          {/* Roadside Safety Protocols Checklist */}
          <div className="safety-card rounded-3xl p-5 border border-white/10 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-black uppercase text-white tracking-wide">
                  Roadside Safety Protocols
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                High-Speed Zone
              </span>
            </div>

            {/* Safety Items */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">Stay Inside Your Vehicle</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    Keep your seatbelt fastened while parked on highway shoulders. Never stand on the traffic side.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">Hazard Warning Triangles</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    If safe to exit, place reflective triangles 50 meters behind your vehicle.
                  </span>
                </div>
              </div>
            </div>

            {/* Safety Actions: Phone Strobe Beacon & Siren Horn */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                onClick={() => setStrobeActive(true)}
                className="h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/30 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Flashlight className="w-4 h-4 text-amber-400" />
                <span>Screen Strobe</span>
              </Button>

              <Button
                type="button"
                onClick={() => setSirenActive(!sirenActive)}
                className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 ${
                  sirenActive
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5'
                }`}
              >
                {sirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{sirenActive ? 'Stop Siren' : 'Siren Horn'}</span>
              </Button>
            </div>
          </div>

          {/* Quick Share Link & Cancellation */}
          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShareTracking}
              className="text-slate-400 hover:text-white text-xs h-8 flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Live Link</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelRescue}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs h-8"
            >
              Cancel Request
            </Button>
          </div>
        </div>
      </div>

      {/* Fullscreen High-Intensity Roadside Hazard Phone Strobe */}
      {strobeActive && (
        <div
          onClick={() => setStrobeActive(false)}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer transition-colors duration-100 ${
            strobeColor === 'amber' ? 'bg-amber-400 text-black' : 'bg-white text-black'
          }`}
        >
          <div className="p-6 rounded-3xl bg-black/80 text-white text-center backdrop-blur-md max-w-sm mx-4 space-y-3 border border-white/20">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-black uppercase tracking-tight">
              Emergency Roadside Warning Strobe
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Place phone facing approaching highway traffic through rear window. Tap anywhere to close.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStrobeActive(false)}
              className="rounded-xl border border-white/60 text-white hover:bg-white/10 text-xs"
            >
              <X className="w-4 h-4 mr-1" />
              Exit Beacon
            </Button>
          </div>
        </div>
      )}

      {/* Direct Communication Modal */}
      <MaskedCommunicationModal
        open={commModalOpen}
        onOpenChange={setCommModalOpen}
        initialTab={commTab}
        provider={provider}
      />
    </div>
  );
};
