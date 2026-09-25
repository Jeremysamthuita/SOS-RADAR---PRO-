import React, { useState } from 'react';
import { VehicleProfile } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  Car,
  Plus,
  CheckCircle2,
  Trash2,
  Shield,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2023');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [type, setType] = useState<VehicleProfile['type']>('SUV / 4WD');
  const [drivetrain, setDrivetrain] = useState<VehicleProfile['drivetrain']>('AWD / 4WD');
  const [notes, setNotes] = useState('');

  const handleSetDefault = (id: string) => {
    storageService.setDefaultVehicle(id);
    const updated = storageService.getVehicles();
    onVehiclesChanged(updated);
    toast.success('Default emergency vehicle updated');
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim() || !licensePlate.trim()) {
      toast.error('Make, model, and license plate are required');
      return;
    }

    const newV = storageService.addVehicle({
      make: make.trim(),
      model: model.trim(),
      year: parseInt(year, 10) || 2023,
      color: color.trim() || 'Black',
      licensePlate: licensePlate.trim().toUpperCase(),
      type,
      drivetrain,
      isDefault: vehicles.length === 0,
      notes: notes.trim(),
    });

    onVehiclesChanged(storageService.getVehicles());
    setAddModalOpen(false);
    toast.success(`Vehicle ${newV.make} ${newV.model} added to garage!`);

    // Reset fields
    setMake('');
    setModel('');
    setColor('');
    setLicensePlate('');
    setNotes('');
  };

  return (
    <div className="w-full bg-white border-2 border-black p-4 shadow-hard font-mono space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-black" />
            <h2 className="text-sm font-black uppercase tracking-wider text-black">
              REGISTERED VEHICLE PROFILES
            </h2>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Auto-fills dispatch telemetry so tow operators arrive with correct flatbed or winch specs
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="rounded-none bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs h-9 px-3 border border-black shadow-hard-sm flex items-center gap-1.5 uppercase"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD VEHICLE
        </Button>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {vehicles.map((veh) => {
          return (
            <div
              key={veh.id}
              className={`p-3.5 border-2 border-black transition-all flex flex-col justify-between ${
                veh.isDefault ? 'bg-yellow-50 shadow-hard' : 'bg-white hover:bg-neutral-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-black text-sm uppercase text-black">
                      {veh.year} {veh.make} {veh.model}
                    </div>
                    <div className="text-xs text-neutral-600 mt-0.5 font-bold">
                      Color: {veh.color} • {veh.type}
                    </div>
                  </div>

                  {veh.isDefault ? (
                    <Badge className="rounded-none bg-black text-white font-mono text-[10px] uppercase font-bold shrink-0">
                      PRIMARY (SOS)
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(veh.id)}
                      className="rounded-none border border-black text-[10px] h-6 px-2 font-bold uppercase hover:bg-black hover:text-white"
                    >
                      Set As Default
                    </Button>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="bg-black text-white px-2 py-0.5 font-bold text-xs uppercase tracking-widest">
                    {veh.licensePlate}
                  </span>
                  <Badge variant="outline" className="rounded-none border-black text-[10px] font-bold uppercase">
                    {veh.drivetrain}
                  </Badge>
                </div>

                {veh.notes && (
                  <div className="mt-2.5 p-2 bg-neutral-100 border-l-2 border-black text-[11px] text-neutral-800">
                    <span className="font-bold text-black uppercase">Towing Requirement: </span>
                    {veh.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md border-4 border-black p-0 rounded-none bg-white shadow-hard text-black font-mono">
          <DialogHeader className="bg-black text-white p-3 border-b-2 border-black">
            <DialogTitle className="text-sm font-black uppercase tracking-wider text-white">
              ADD VEHICLE PROFILE
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddVehicle} className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">Make:</label>
                <Input
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Subaru"
                  required
                  className="rounded-none border-2 border-black h-8 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Model:</label>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Outback"
                  required
                  className="rounded-none border-2 border-black h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">Year:</label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2023"
                  className="rounded-none border-2 border-black h-8 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Color:</label>
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Blue"
                  className="rounded-none border-2 border-black h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">License Plate:</label>
                <Input
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="e.g. SOS-7729"
                  required
                  className="rounded-none border-2 border-black h-8 text-xs font-mono uppercase"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Drivetrain:</label>
                <select
                  value={drivetrain}
                  onChange={(e) => setDrivetrain(e.target.value as any)}
                  className="w-full rounded-none border-2 border-black h-8 text-xs font-mono px-2 bg-white"
                >
                  <option value="AWD / 4WD">AWD / 4WD (Flatbed Required)</option>
                  <option value="FWD">FWD</option>
                  <option value="RWD">RWD</option>
                  <option value="Dual Motor EV">Dual Motor EV</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Tow Operator Instructions / Notes:</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Flatbed required only, low ground clearance"
                className="rounded-none border-2 border-black h-8 text-xs font-mono"
              />
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
                Save Vehicle
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
