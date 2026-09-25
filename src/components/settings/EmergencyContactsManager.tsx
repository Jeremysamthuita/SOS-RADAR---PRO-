import React, { useState } from 'react';
import { EmergencyContact } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  Users,
  Plus,
  Trash2,
  Bell,
  BellOff,
  Phone,
  Mail,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
    toast.info('Emergency contact deleted.');
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Contact name and phone number are required.');
      return;
    }

    const newContact: EmergencyContact = {
      id: `cnt-${Date.now()}`,
      name: name.trim(),
      relationship,
      phone: phone.trim(),
      email: email.trim() || undefined,
      notifyOnSos: true,
      alertChannel,
    };

    storageService.addContact(newContact);
    const updated = storageService.getContacts();
    onContactsChanged(updated);
    toast.success(`${newContact.name} added to Kenya SOS notification list.`);
    setAddModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
  };

  const handleSimulateTestAlert = (contact: EmergencyContact) => {
    setTestAlertRecipient(contact);
    setTestSimModalOpen(true);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 shadow-xl text-xs space-y-4 border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Emergency Contacts (+254 Relay)</h2>
            <div className="text-[11px] text-slate-400">
              Automated SMS broadcast dispatched upon SOS button activation
            </div>
          </div>
        </div>

        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs h-9 px-3.5 flex items-center gap-1.5 border border-white/5"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md p-6 rounded-2xl glass-panel border border-white/10 text-white">
            <DialogHeader className="border-b border-white/5 pb-3">
              <DialogTitle className="text-base font-bold text-white">
                Add Emergency Contact
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddContact} className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Contact Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grace Mutua"
                  className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Relationship</Label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9 px-2"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Mechanic">Mechanic</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Kenyan Mobile Number</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Alert Mode</Label>
                <select
                  value={alertChannel}
                  onChange={(e) => setAlertChannel(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9 px-2"
                >
                  <option value="SMS">SMS Only</option>
                  <option value="SMS + Call">SMS + Automated Voice Call</option>
                  <option value="Fleet Radio">Fleet Radio Channel</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-xl text-slate-400 hover:text-white text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs h-9 px-4 font-semibold shadow-md shadow-red-500/20"
                >
                  Save Contact
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2.5">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{c.name}</span>
                <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-white/5">
                  {c.relationship}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {c.phone} • {c.alertChannel}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSimulateTestAlert(c)}
                className="text-xs text-slate-300 hover:text-white hover:bg-white/5 h-8 px-2.5 rounded-xl border border-white/5"
              >
                <Send className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Test SMS
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleToggleNotify(c.id, c.notifyOnSos)}
                className={`h-8 px-2.5 rounded-xl text-xs font-semibold ${
                  c.notifyOnSos
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {c.notifyOnSos ? 'Active' : 'Muted'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(c.id)}
                className="text-slate-500 hover:text-rose-400 h-8 w-8 p-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Test SMS Modal */}
      <Dialog open={testSimModalOpen} onOpenChange={setTestSimModalOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md p-6 rounded-2xl glass-panel border border-white/10 text-white">
          <DialogHeader className="border-b border-white/5 pb-3">
            <DialogTitle className="text-base font-bold text-white">
              Simulated SOS SMS Payload
            </DialogTitle>
          </DialogHeader>

          {testAlertRecipient && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 font-mono text-[11px] leading-relaxed text-slate-300 space-y-1">
                <div className="text-rose-400 font-bold">[KENYA SOS RADAR ALERT]</div>
                <div>Motorist: Brian Mutua (Toyota Prado KDA 849X)</div>
                <div>Status: CRITICAL ROADSIDE DISTRESS BEACON ACTIVE</div>
                <div>Location: A104 Kinungi Escarpment Mile 72 (-0.7850, 36.5200)</div>
                <div>Dispatching Unit: AA Kenya Recovery Unit #884</div>
                <div>Live Radar Stream: https://sosradar.co.ke/tracking/inc-8849</div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setTestSimModalOpen(false)}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs h-9 px-4 font-semibold"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
