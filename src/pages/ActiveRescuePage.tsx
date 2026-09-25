import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeafletRadarMap } from '@/components/map/LeafletRadarMap';
import { CascadingDispatchTimer } from '@/components/sos/CascadingDispatchTimer';
import { RescuerProfileCard } from '@/components/sos/RescuerProfileCard';
import { MaskedCommunicationModal } from '@/components/sos/MaskedCommunicationModal';
import { EmergencySafetyTools } from '@/components/sos/EmergencySafetyTools';
import { CollapsibleBentoCards } from '@/components/sos/CollapsibleBentoCards';
import { SosIncident, MedicalProfile, EmergencyContact } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  Navigation,
  Car,
  Bell,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Radio,
  PhoneCall,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ActiveRescuePageProps {
  activeIncident: SosIncident | null;
  onIncidentUpdated: (inc: SosIncident | null) => void;
}

export const ActiveRescuePage: React.FC<ActiveRescuePageProps> = ({
  activeIncident,
  onIncidentUpdated,
}) => {
  const navigate = useNavigate();
  const [commModalOpen, setCommModalOpen] = useState(false);
  const [commModalTab, setCommModalTab] = useState<'chat' | 'call'>('chat');
  const [medical, setMedical] = useState<MedicalProfile>(storageService.getMedicalProfile());
  const [contacts, setContacts] = useState<EmergencyContact[]>(storageService.getContacts());

  // If no incident, provide sample creation or redirect
  const handleCreateSampleIncident = () => {
    const inc = storageService.createIncident('towing');
    onIncidentUpdated(inc);
    toast.success('Emergency rescue dispatched for Kenyan highway corridor!');
  };

  // Simulating rescuer moving closer over time
  useEffect(() => {
    if (!activeIncident || activeIncident.status === 'completed' || activeIncident.status === 'cancelled') {
      return;
    }

    const interval = setInterval(() => {
      onIncidentUpdated({
        ...activeIncident,
        primaryProvider: {
          ...activeIncident.primaryProvider,
          currentEtaMinutes: Math.max(1, activeIncident.primaryProvider.currentEtaMinutes - 1),
          currentCoordinates: [
            activeIncident.primaryProvider.currentCoordinates[0] +
              (activeIncident.telemetry.latitude - activeIncident.primaryProvider.currentCoordinates[0]) * 0.1,
            activeIncident.primaryProvider.currentCoordinates[1] +
              (activeIncident.telemetry.longitude - activeIncident.primaryProvider.currentCoordinates[1]) * 0.1,
          ],
        },
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [activeIncident, onIncidentUpdated]);

  const handleCascadeTrigger = () => {
    if (!activeIncident) return;
    const backup = activeIncident.backupProvider;
    if (!backup) return;

    const updated: SosIncident = {
      ...activeIncident,
      status: 'cascading',
      cascadeTriggered: true,
      cascadeSecondsRemaining: 0,
      assignedProviderId: backup.id,
      primaryProvider: backup,
    };
    storageService.saveActiveIncident(updated);
    onIncidentUpdated(updated);
    toast.warning(`Incident cascaded! Reassigned to ${backup.companyName}`);
  };

  const handleProviderAccepted = () => {
    if (!activeIncident) return;
    const updated: SosIncident = {
      ...activeIncident,
      status: 'en_route',
    };
    storageService.saveActiveIncident(updated);
    onIncidentUpdated(updated);
    toast.success('Rescue unit confirmed assignment and is now EN ROUTE!');
  };

  const handleStatusAdvance = () => {
    if (!activeIncident) return;
    let nextStatus: SosIncident['status'] = 'en_route';
    if (activeIncident.status === 'dispatching' || activeIncident.status === 'cascading') nextStatus = 'en_route';
    else if (activeIncident.status === 'en_route') nextStatus = 'arrived';
    else if (activeIncident.status === 'arrived') nextStatus = 'completed';

    const updated: SosIncident = {
      ...activeIncident,
      status: nextStatus,
    };
    storageService.saveActiveIncident(updated);
    onIncidentUpdated(updated);
    toast.info(`Rescue milestone updated: ${nextStatus.toUpperCase()}`);
  };

  const handleCancelIncident = () => {
    if (!activeIncident) return;
    storageService.saveActiveIncident(null);
    onIncidentUpdated(null);
    toast.info('Emergency request cancelled.');
    navigate('/');
  };

  const handleCompleteService = () => {
    if (!activeIncident) return;
    storageService.saveActiveIncident(null);
    onIncidentUpdated(null);
    toast.success('Emergency assistance complete. Stay safe on Kenyan roads!');
    navigate('/');
  };

  if (!activeIncident) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-12 text-center font-mono space-y-4">
        <div className="border-4 border-black p-8 bg-white shadow-hard space-y-4">
          <Navigation className="w-16 h-16 mx-auto text-neutral-400 stroke-[1.5]" />
          <h2 className="text-xl font-black uppercase text-black">NO ACTIVE RESCUE IN PROGRESS</h2>
          <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
            There is currently no active dispatched emergency request. Trigger a single-tap SOS from the dashboard or initiate a simulated dispatch below.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              onClick={() => navigate('/')}
              className="rounded-none bg-black text-white hover:bg-neutral-800 font-mono font-bold text-xs h-10 px-4 uppercase"
            >
              Go to SOS Dashboard
            </Button>
            <Button
              onClick={handleCreateSampleIncident}
              className="rounded-none bg-red-600 text-white hover:bg-red-700 font-mono font-black text-xs h-10 px-4 uppercase shadow-hard-sm"
            >
              Simulate Kenya Highway SOS
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeProvider = activeIncident.primaryProvider;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 md:py-5 space-y-4 font-mono">
      {/* Zero-Jargon Ultra-Legible Status Banner */}
      <div className="w-full bg-neutral-950 text-white border-4 border-black p-4 shadow-hard flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-red-600 border border-white animate-pulse shrink-0" />
          <div>
            <div className="text-xs text-yellow-300 font-bold uppercase tracking-wider">
              CRISIS DISPATCH STATUS
            </div>
            <div className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight">
              {activeIncident.status === 'dispatching' && 'HELP IS DISPATCHING'}
              {activeIncident.status === 'cascading' && 'REASSIGNING TO BACKUP UNIT'}
              {activeIncident.status === 'en_route' && `RESCUE EN ROUTE - ETA ${activeProvider.currentEtaMinutes} MINS`}
              {activeIncident.status === 'arrived' && 'RESCUER CONFIRMED ON SCENE'}
              {activeIncident.status === 'completed' && 'RESCUE ASSISTANCE RESOLVED'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="rounded-none bg-red-600 text-white text-xs uppercase font-black px-2 py-1">
            {activeIncident.id}
          </Badge>
          <Badge className="rounded-none bg-emerald-600 text-white text-xs uppercase font-black px-2 py-1">
            KENYA RELAY
          </Badge>
        </div>
      </div>

      {/* Main Grid: Live Tracking & Rescuer Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Rescuer Info, 45-60s Cascading Timer & Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Automated Cascading Dispatch SLA Component */}
          <CascadingDispatchTimer
            initialSeconds={activeIncident.cascadeSecondsRemaining}
            primaryProvider={activeIncident.primaryProvider}
            backupProvider={activeIncident.backupProvider}
            cascadeTriggered={activeIncident.cascadeTriggered}
            onCascadeTrigger={handleCascadeTrigger}
            onProviderAccepted={handleProviderAccepted}
            status={activeIncident.status}
          />

          {/* Rescuer Profile Card */}
          <RescuerProfileCard
            provider={activeProvider}
            incidentStatus={activeIncident.status}
            onOpenChat={() => {
              setCommModalTab('chat');
              setCommModalOpen(true);
            }}
            onOpenCall={() => {
              setCommModalTab('call');
              setCommModalOpen(true);
            }}
            onCancelIncident={handleCancelIncident}
            onStatusAdvance={handleStatusAdvance}
          />

          {/* Emergency Contact Broadcast Receipts Card */}
          <div className="bg-white border-2 border-black p-3.5 shadow-hard text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-black pb-1.5 font-black uppercase text-black">
              <span className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-red-600" />
                KENYA CONTACTS BROADCAST (+254)
              </span>
              <span className="text-[10px] text-neutral-500 font-normal">
                {activeIncident.notifiedContacts.length} Contacts Alerted
              </span>
            </div>

            <div className="space-y-1.5">
              {activeIncident.notifiedContacts.map((c) => (
                <div
                  key={c.contactId}
                  className="p-1.5 bg-neutral-50 border border-black flex items-center justify-between text-[11px]"
                >
                  <div className="font-bold text-black">{c.contactName}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500 font-mono">{c.phone}</span>
                    <span className="bg-emerald-600 text-white px-1.5 py-0.2 font-bold text-[9px] uppercase">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Rescue / Resolve CTA */}
          <div className="p-3 bg-neutral-100 border-2 border-black flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-black">Rescue Completed?</div>
              <div className="text-[10px] text-neutral-600">Close incident and confirm safety</div>
            </div>
            <Button
              onClick={handleCompleteService}
              className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-black text-xs h-9 px-3 uppercase"
            >
              CONFIRM SAFE RECOVERY
            </Button>
          </div>
        </div>

        {/* Right Column: Real-Time Live Rescuer Movement Map & Bento Cards */}
        <div className="lg:col-span-7 space-y-4">
          <LeafletRadarMap
            userTelemetry={activeIncident.telemetry}
            activeProvider={activeProvider}
            className="h-[460px] md:h-[500px]"
          />

          {/* Secondary Details Bento Cards */}
          <CollapsibleBentoCards
            vehicle={activeIncident.vehicle}
            medical={medical}
            contacts={contacts}
          />

          {/* Emergency Safety Tools Component */}
          <EmergencySafetyTools />
        </div>
      </div>

      {/* Masked Communication Modal */}
      <MaskedCommunicationModal
        open={commModalOpen}
        onOpenChange={setCommModalOpen}
        initialTab={commModalTab}
        provider={activeProvider}
      />
    </div>
  );
};
