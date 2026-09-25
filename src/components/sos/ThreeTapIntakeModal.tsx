import React, { useState } from 'react';
import {
  EmergencyCategory,
  VehicleProfile,
  TelemetryData,
} from '@/types/sos';
import { EMERGENCY_CATEGORIES } from '@/services/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Check,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Car,
  ShieldCheck,
  Clock,
  Radio,
  Truck,
  Disc,
  Zap,
  Fuel,
  Key,
  Anchor,
} from 'lucide-react';
import { toast } from 'sonner';

interface ThreeTapIntakeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  telemetry: TelemetryData;
  vehicles: VehicleProfile[];
  selectedVehicle: VehicleProfile;
  onSelectVehicle: (v: VehicleProfile) => void;
  onDispatchConfirmed: (
    category: EmergencyCategory,
    manualLocation?: string,
    notes?: string
  ) => void;
}

export const ThreeTapIntakeModal: React.FC<ThreeTapIntakeModalProps> = ({
  open,
  onOpenChange,
  telemetry,
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  onDispatchConfirmed,
}) => {
  // Step 1: Emergency Type -> Step 2: Vehicle & Location Verify -> Step 3: Instant Dispatch
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [chosenCategory, setChosenCategory] = useState<EmergencyCategory>('towing');
  const [manualLocation, setManualLocation] = useState('');
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [emergencyNotes, setEmergencyNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-6 h-6" />;
      case 'Disc':
        return <Disc className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Fuel':
        return <Fuel className="w-6 h-6" />;
      case 'Key':
        return <Key className="w-6 h-6" />;
      case 'Anchor':
        return <Anchor className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const handleSelectCategory = (cat: EmergencyCategory) => {
    setChosenCategory(cat);
    // Tap 1 completed! Automatically advance to Step 2
    setStep(2);
  };

  const handleConfirmDispatch = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onDispatchConfirmed(
        chosenCategory,
        useManualLocation ? manualLocation : undefined,
        emergencyNotes
      );
      setIsSubmitting(false);
      onOpenChange(false);
      setStep(1);
    }, 600);
  };

  const activeCategoryConfig =
    EMERGENCY_CATEGORIES.find((c) => c.id === chosenCategory) || EMERGENCY_CATEGORIES[0];

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) setStep(1);
      }}
    >
      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-2xl bg-white border-4 border-black text-black font-mono shadow-hard p-0 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-black text-white p-4 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-red-600 border border-white animate-pulse" />
            <DialogTitle className="text-base font-black tracking-tight uppercase text-white font-mono">
              RAPID 3-TAP SOS DISPATCH
            </DialogTitle>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-6 h-6 border text-xs font-black flex items-center justify-center ${
                  step === s
                    ? 'bg-yellow-400 text-black border-white'
                    : step > s
                    ? 'bg-emerald-600 text-white border-white'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: TAP 1 - SELECT BREAKDOWN TYPE */}
        {step === 1 && (
          <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="font-black text-xs uppercase tracking-wider text-black">
                [TAP 1 OF 3] SELECT BREAKDOWN SCENARIO:
              </span>
              <Badge variant="outline" className="rounded-none border-black font-mono text-[10px] uppercase font-bold bg-neutral-100">
                1-TAP CONFIRMATION
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EMERGENCY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`p-3.5 border-2 border-black text-left flex items-start gap-3 transition-all hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 shadow-hard-sm ${
                    chosenCategory === cat.id ? 'bg-yellow-50 border-black ring-2 ring-black' : 'bg-white'
                  }`}
                >
                  <div className="p-2 border border-black bg-black text-white shrink-0">
                    {getIcon(cat.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xs uppercase text-black truncate">{cat.label}</div>
                    <div className="text-[11px] text-neutral-600 line-clamp-1">{cat.sublabel}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10px]">
                      <span className="font-bold text-emerald-700">{cat.coverageStatus}</span>
                      <span>•</span>
                      <span className="text-neutral-500">~{cat.estimatedArrivalMins}m ETA</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: TAP 2 - VERIFY VEHICLE & GPS LOCATION */}
        {step === 2 && (
          <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="font-black text-xs uppercase tracking-wider text-black">
                [TAP 2 OF 3] VERIFY VEHICLE & CORRIDOR
              </span>
              <span className="text-xs text-neutral-500">Selected: {activeCategoryConfig.label}</span>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase flex items-center gap-1.5 text-neutral-800">
                <Car className="w-3.5 h-3.5" />
                Select Stranded Vehicle:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => onSelectVehicle(v)}
                    className={`p-2.5 border-2 border-black cursor-pointer flex items-center justify-between text-xs ${
                      selectedVehicle.id === v.id ? 'bg-yellow-100 font-bold' : 'bg-neutral-50 hover:bg-neutral-100'
                    }`}
                  >
                    <div>
                      <div className="font-black text-black">
                        {v.year} {v.make} {v.model} ({v.licensePlate})
                      </div>
                      <div className="text-[10px] text-neutral-600">
                        {v.drivetrain} • {v.type} {v.notes ? `• ${v.notes}` : ''}
                      </div>
                    </div>
                    {selectedVehicle.id === v.id && (
                      <span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Location / Manual Fallback */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-300">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase flex items-center gap-1.5 text-neutral-800">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  GPS Staging Point:
                </label>
                <button
                  type="button"
                  onClick={() => setUseManualLocation(!useManualLocation)}
                  className="text-[11px] underline text-blue-700 hover:text-black font-semibold"
                >
                  {useManualLocation ? 'Use Auto GPS Fix' : 'Weak Signal? Enter Road/Exit'}
                </button>
              </div>

              {useManualLocation ? (
                <div className="space-y-1">
                  <Input
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="e.g. I-70 Mile Marker 259 westbound right shoulder near exit"
                    className="rounded-none border-2 border-black font-mono text-xs h-10"
                  />
                  <div className="text-[10px] text-neutral-500">
                    Rescuers will cross-reference this text with CAD highway coordinates.
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-neutral-100 border border-black text-xs space-y-0.5">
                  <div className="font-bold text-black">{telemetry.highwayMarker}</div>
                  <div className="text-[11px] text-neutral-600">
                    Lat: {telemetry.latitude.toFixed(5)}, Lng: {telemetry.longitude.toFixed(5)} (±{telemetry.accuracyMeters}m accuracy)
                  </div>
                </div>
              )}
            </div>

            {/* Step 2 Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-black">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="rounded-none border-2 border-black font-mono text-xs h-10 font-bold uppercase"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="rounded-none bg-black text-white hover:bg-neutral-800 font-mono text-xs h-10 px-5 font-black uppercase flex items-center gap-2 shadow-hard-sm"
              >
                Proceed to Review & Dispatch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: TAP 3 - CONFIRM & DISPATCH RESCUE */}
        {step === 3 && (
          <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="font-black text-xs uppercase tracking-wider text-black">
                [TAP 3 OF 3] CONFIRM EMERGENCY DISPATCH
              </span>
              <span className="text-xs bg-red-600 text-white font-bold px-1.5 py-0.5">
                PRIORITY QUEUE
              </span>
            </div>

            {/* Incident Summary Card */}
            <div className="p-3.5 bg-neutral-50 border-2 border-black space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 uppercase">Emergency Category:</span>
                <span className="font-black text-black uppercase">{activeCategoryConfig.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 uppercase">Dispatched Unit:</span>
                <span className="font-bold text-black">Apex Heavy Towing & Rescue</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 uppercase">Vehicle:</span>
                <span className="font-bold text-black">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.licensePlate})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 uppercase">Location:</span>
                <span className="font-bold text-black truncate max-w-[240px]">
                  {useManualLocation ? manualLocation : telemetry.highwayMarker}
                </span>
              </div>
              <div className="border-t border-neutral-300 pt-2 flex items-center justify-between font-black text-sm">
                <span className="uppercase text-black">Emergency Coverage:</span>
                <span className="text-emerald-700">100% COVERED ($0 DUE)</span>
              </div>
            </div>

            {/* Optional Hazard Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-neutral-800">
                Additional Notes / Hazards (Optional):
              </label>
              <Input
                value={emergencyNotes}
                onChange={(e) => setEmergencyNotes(e.target.value)}
                placeholder="e.g. Dog inside vehicle, heavy snow berm on shoulder"
                className="rounded-none border-2 border-black font-mono text-xs h-9"
              />
            </div>

            {/* 45-60s Automated Cascade Notice */}
            <div className="p-2.5 bg-yellow-50 border-l-4 border-black text-[11px] text-neutral-800 space-y-1">
              <div className="font-bold uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-black" />
                AUTOMATED 45–60S CASCADE SLA GUARANTEE
              </div>
              <div>
                If primary responder does not confirm within 60 seconds, dispatch cascades automatically to Titan Rapid Fleet without delay.
              </div>
            </div>

            {/* Step 3 Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-black">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="rounded-none border-2 border-black font-mono text-xs h-10 font-bold uppercase"
              >
                Back
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={handleConfirmDispatch}
                className="rounded-none bg-red-600 hover:bg-red-700 text-white font-mono text-xs sm:text-sm h-12 px-6 font-black uppercase flex items-center gap-2 shadow-hard border-2 border-black animate-pulse"
              >
                <Radio className="w-4 h-4 text-white" />
                {isSubmitting ? 'DISPATCHING...' : 'DISPATCH SOS RESCUE NOW'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
