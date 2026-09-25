import React, { useState } from 'react';
import { EmergencyContact } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  Users,
  Bell,
  BellOff,
  Plus,
  Send,
  Phone,
  Mail,
  CheckCircle2,
  Trash2,
  Smartphone,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface EmergencyContactsManagerProps {
  contacts: EmergencyContact[];
  onContactsChanged: (contacts: EmergencyContact[]) => void;
}

export const EmergencyContactsManager: React.FC<EmergencyContactsManagerProps> = ({
  contacts,
  onContactsChanged,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [testSimModalOpen, setTestSimModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<EmergencyContact['relationship']>('Spouse');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [alertChannel, setAlertChannel] = useState<EmergencyContact['alertChannel']>('SMS + Call');
  const [testAlertRecipient, setTestAlertRecipient] = useState<EmergencyContact | null>(null);

  const handleToggleNotify = (id: string, current: boolean) => {
    storageService.updateContact(id, { notifyOnSos: !current });
    const updated = storageService.getContacts();
    onContactsChanged(updated);
    toast.success(`SOS notification setting updated`);
  };

  const handleDelete = (id: string) => {
    storageService.deleteContact(id);
    const updated = storageService.getContacts();
    onContactsChanged(updated);
    toast.info('Emergency contact removed');
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Name and phone number are required');
      return;
    }

    storageService.addContact({
      name: name.trim(),
      relationship,
      phone: phone.trim(),
      email: email.trim() || undefined,
      notifyOnSos: true,
      alertChannel,
      lastAlertStatus: 'Acknowledged',
    });

    onContactsChanged(storageService.getContacts());
    setAddModalOpen(false);
    toast.success(`Emergency contact ${name} added!`);

    setName('');
    setPhone('');
    setEmail('');
  };

  const handleSendTestAlert = (contact: EmergencyContact) => {
    setTestAlertRecipient(contact);
    setTestSimModalOpen(true);
    storageService.playEmergencyAudioTone(800, 0.2, 'sine');
  };

  return (
    <div className="w-full bg-white border-2 border-black p-4 shadow-hard font-mono space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-black" />
            <h2 className="text-sm font-black uppercase tracking-wider text-black">
              EMERGENCY CONTACTS & FLEET BROADCAST
            </h2>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Automatically sends live GPS coordinates and telemetry link to family & fleet upon 1-tap SOS activation
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="rounded-none bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs h-9 px-3 border border-black shadow-hard-sm flex items-center gap-1.5 uppercase"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD CONTACT
        </Button>
      </div>

      {/* Contacts List */}
      <div className="space-y-2.5">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-3 border-2 border-black bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-hard-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase text-black">{contact.name}</span>
                <Badge variant="outline" className="rounded-none border-black text-[10px] font-bold bg-white text-black">
                  {contact.relationship}
                </Badge>
                {contact.notifyOnSos ? (
                  <Badge className="rounded-none bg-red-600 text-white font-mono text-[9px] uppercase font-bold">
                    AUTO-NOTIFY ON SOS
                  </Badge>
                ) : (
                  <Badge variant="outline" className="rounded-none border-neutral-400 text-neutral-500 text-[9px] uppercase">
                    MUTED
                  </Badge>
                )}
              </div>

              <div className="text-xs text-neutral-600 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-black">
                  <Phone className="w-3 h-3 text-red-600" /> {contact.phone}
                </span>
                {contact.email && (
                  <span className="flex items-center gap-1 text-neutral-700">
                    <Mail className="w-3 h-3" /> {contact.email}
                  </span>
                )}
                <span className="bg-neutral-200 text-black px-1.5 py-0.2 text-[10px] font-bold">
                  CHANNEL: {contact.alertChannel}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-black/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendTestAlert(contact)}
                className="rounded-none border border-black font-mono font-bold text-[11px] h-8 px-2.5 hover:bg-neutral-200 flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                Test Dispatch SMS
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleToggleNotify(contact.id, contact.notifyOnSos)}
                className={`rounded-none border border-black font-mono font-bold text-[11px] h-8 px-2.5 ${
                  contact.notifyOnSos ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black'
                }`}
              >
                {contact.notifyOnSos ? 'Auto Alert: ON' : 'Auto Alert: OFF'}
              </Button>

              <button
                type="button"
                onClick={() => handleDelete(contact.id)}
                className="p-1.5 text-neutral-500 hover:text-red-600 transition-colors"
                title="Remove contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md border-4 border-black p-0 rounded-none bg-white shadow-hard text-black font-mono">
          <DialogHeader className="bg-black text-white p-3 border-b-2 border-black">
            <DialogTitle className="text-sm font-black uppercase tracking-wider text-white">
              ADD EMERGENCY RECIPIENT
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddContact} className="p-4 space-y-3 text-xs">
            <div>
              <label className="block font-bold mb-1">Contact Name:</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins (Spouse)"
                required
                className="rounded-none border-2 border-black h-8 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">Relationship:</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full rounded-none border-2 border-black h-8 text-xs font-mono px-2 bg-white"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Mobile Phone:</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (303) 555-0192"
                  required
                  className="rounded-none border-2 border-black h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Email / Fleet Webhook (Optional):</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="rounded-none border-2 border-black h-8 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Notification Priority:</label>
              <select
                value={alertChannel}
                onChange={(e) => setAlertChannel(e.target.value as any)}
                className="w-full rounded-none border-2 border-black h-8 text-xs font-mono px-2 bg-white"
              >
                <option value="SMS + Call">SMS + Automated Voice Call</option>
                <option value="SMS">High Priority SMS</option>
                <option value="Fleet Webhook">Fleet Telemetry Webhook</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
                className="rounded-none border border-black text-xs h-8 px-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-none bg-black hover:bg-neutral-800 text-white text-xs h-8 px-4 font-bold uppercase"
              >
                Save Recipient
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Test Alert Simulator Modal */}
      <Dialog open={testSimModalOpen} onOpenChange={setTestSimModalOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md border-4 border-black p-0 rounded-none bg-white shadow-hard text-black font-mono">
          <DialogHeader className="bg-red-600 text-white p-3 border-b-2 border-black">
            <DialogTitle className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              EMERGENCY BROADCAST SIMULATOR
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-3 text-xs">
            <div className="bg-neutral-900 text-white p-3 border-2 border-black space-y-2">
              <div className="flex justify-between items-center text-[10px] text-neutral-400 border-b border-neutral-700 pb-1">
                <span>SMS MESSAGE SENT TO: {testAlertRecipient?.phone}</span>
                <span className="text-emerald-400 font-bold">DELIVERED NOW</span>
              </div>
              <p className="text-xs font-mono leading-relaxed text-yellow-300">
                🚨 <strong>[SOS RADAR ALERT]</strong>: Your contact triggered an Emergency Roadside Dispatch at I-70 W @ Mile Marker 258.4. Rescuer matched with 12m ETA. Live Radar Tracking Link: https://sos-radar.app/track/SOS-9182
              </p>
            </div>

            <div className="p-2 bg-emerald-50 border border-emerald-600 text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px]">
                Broadcast channel verified. Delivery receipt acknowledged by gateway.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={() => setTestSimModalOpen(false)}
                className="rounded-none bg-black hover:bg-neutral-800 text-white text-xs h-8 px-4 font-bold uppercase"
              >
                Dismiss Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
