import React, { useState } from 'react';
import { VehicleProfile } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  Car,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  Fuel,
  Shield,
  Layers,
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

interface VehicleProfileManagerProps {
  vehicles: VehicleProfile[];
  onVehiclesChanged: (vehicles: VehicleProfile[]) => void;
}

export const VehicleProfileManager: React.FC<VehicleProfileManagerProps> = ({
  vehicles,
  onVehiclesChanged,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [type, setType] = useState<VehicleProfile['type']>('SUV / 4WD');
  const [drivetrain, setDrivetrain] = useState<VehicleProfile['drivetrain']>('AWD / 4WD');
  const [notes, setNotes] = useState('');

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim() || !licensePlate.trim()) {
      toast.error('Make, model, and Kenyan license plate are required.');
      return;
    }

    const newVeh = storageService.addVehicle({
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      color: color.trim() || 'Silver',
      licensePlate: licensePlate.trim().toUpperCase(),
      type,
      drivetrain,
      notes: notes.trim() || undefined,
      isDefault: vehicles.length === 0,
    });

    const updated = storageService.getVehicles();
    onVehiclesChanged(updated);
    toast.success(`Vehicle ${newVeh.licensePlate} added to your Kenyan garage!`);
    setModalOpen(false);
    resetForm();
  };

  const handleSetDefault = (id: string) => {
    storageService.setDefaultVehicle(id);
    const updated = storageService.getVehicles();
    onVehiclesChanged(updated);
    toast.success('Default emergency vehicle updated');
  };

  const handleDelete = (id: string) => {
    if (vehicles.length <= 1) {
      toast.error('You must keep at least one registered emergency vehicle.');
      return;
    }
    storageService.deleteVehicle(id);
    const updated = storageService.getVehicles();
    onVehiclesChanged(updated);
    toast.info('Vehicle removed.');
  };

  const resetForm = () => {
    setMake('');
    setModel('');
    setColor('');
    setLicensePlate('');
    setNotes('');
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 shadow-xl text-xs space-y-4 border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Kenyan Motorist Garage</h2>
            <div className="text-[11px] text-slate-400">
              Vehicle specs help dispatchers choose flatbeds vs 4x4 winches
            </div>
          </div>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs h-9 px-3.5 flex items-center gap-1.5 border border-white/5"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md p-6 rounded-2xl glass-panel border border-white/10 text-white">
            <DialogHeader className="border-b border-white/5 pb-3">
              <DialogTitle className="text-base font-bold text-white">
                Register Vehicle Profile
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddVehicle} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Make</Label>
                  <Input
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Toyota"
                    className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Model</Label>
                  <Input
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Land Cruiser Prado"
                    className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Year</Label>
                  <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Color</Label>
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Pearl White"
                    className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Kenyan Number Plate</Label>
                <Input
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="KDA 849X"
                  className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9 uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Body Type</Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9 px-2"
                  >
                    <option value="SUV / 4WD">SUV / 4WD</option>
                    <option value="Saloon">Saloon</option>
                    <option value="Commercial Truck">Commercial Truck</option>
                    <option value="Matatu / Van">Matatu / Van</option>
                    <option value="EV / Hybrid">EV / Hybrid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Drivetrain</Label>
                  <select
                    value={drivetrain}
                    onChange={(e) => setDrivetrain(e.target.value as any)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-9 px-2"
                  >
                    <option value="AWD / 4WD">AWD / 4WD</option>
                    <option value="2WD">2WD</option>
                    <option value="Heavy Commercial">Heavy Commercial</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl text-slate-400 hover:text-white text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs h-9 px-4 font-semibold shadow-md shadow-red-500/20"
                >
                  Save Vehicle
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {vehicles.map((veh) => (
          <div
            key={veh.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              veh.isDefault
                ? 'bg-slate-900/80 border-amber-500/30 shadow-lg'
                : 'bg-slate-900/40 border-white/5 hover:border-white/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">
                  {veh.year} {veh.make} {veh.model}
                </span>
                <span className="font-mono font-bold text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  {veh.licensePlate}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div>Type: <span className="text-white">{veh.type}</span></div>
                <div>Drive: <span className="text-white">{veh.drivetrain}</span></div>
                <div>Color: <span className="text-white">{veh.color}</span></div>
                <div>Staging: <span className="text-emerald-400 font-medium">Ready</span></div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
              {veh.isDefault ? (
                <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Primary Staged Vehicle
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSetDefault(veh.id)}
                  className="text-slate-400 hover:text-white text-[11px] h-7 px-2"
                >
                  Set as Primary
                </Button>
              )}

              {vehicles.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(veh.id)}
                  className="text-slate-500 hover:text-rose-400 text-xs h-7 w-7 p-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
