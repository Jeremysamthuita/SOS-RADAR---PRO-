import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ShieldAlert,
  Zap,
  User,
  Truck,
  ArrowRight,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, quickSignIn, register } = useAuth();

  const [mode, setMode] = useState<'quick' | 'credentials' | 'register'>('quick');
  const [phoneOrEmail, setPhoneOrEmail] = useState('+254 722 849 102');
  const [password, setPassword] = useState('sos123');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'driver' | 'fleet_manager'>('driver');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      if (!name.trim()) {
        toast.error('Please enter your full name');
        return;
      }
      register(name, phoneOrEmail, password, selectedRole);
      toast.success('Account registered successfully! Access granted.');
      navigate('/');
    } else {
      const ok = signIn(phoneOrEmail, password);
      if (ok) {
        toast.success('Welcome back! Verified for emergency dispatch.');
        navigate('/');
      } else {
        toast.error('Invalid credentials. Use Quick Login for immediate bypass.');
      }
    }
  };

  const handleQuickLogin = (role: 'driver' | 'fleet_manager') => {
    quickSignIn(role);
    toast.success(
      role === 'driver'
        ? 'Quick Access: Signed in as Kenyan Motorist'
        : 'Quick Access: Signed in as Fleet Command'
    );
    navigate('/');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 font-mono space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-600 border-4 border-black text-white shadow-hard mb-2">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          SOS RADAR KENYA
        </h1>
        <p className="text-xs text-neutral-600 font-bold uppercase tracking-wider">
          Rapid Motorist Highway Relay • 24/7 Roadside Assistance
        </p>
      </div>

      {/* High-Glanceability Quick 1-Tap Emergency Access Container */}
      <div className="bg-white border-4 border-black p-5 shadow-hard space-y-4">
        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
          <span className="font-black text-xs uppercase flex items-center gap-1.5 text-black">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            1-TAP EMERGENCY ACCESS (FOR DRIVERS IN A HURRY)
          </span>
          <Badge className="rounded-none bg-red-600 text-white font-mono text-[9px] font-bold uppercase">
            BYPASS LOGIN
          </Badge>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">
          Stranded on the road? Do not lose seconds typing passwords. Use 1-tap fast access to immediately load your vehicle coordinates and dispatch emergency assistance:
        </p>

        {/* 1-Tap Motorist & Fleet Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleQuickLogin('driver')}
            className="p-3.5 bg-yellow-400 hover:bg-yellow-500 border-2 border-black shadow-hard-sm text-left font-mono transition-all active:translate-x-0.5 active:translate-y-0.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-black text-xs uppercase text-black flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Kenyan Driver
                </span>
                <span className="text-[9px] bg-black text-white font-bold px-1 uppercase">1-TAP</span>
              </div>
              <div className="font-black text-sm text-black mt-1">Brian Mutua</div>
              <div className="text-[11px] text-neutral-800 font-mono mt-0.5">+254 722 849 102</div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase text-black pt-2 border-t border-black/40">
              <span>PRADO KDA 849X</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('fleet_manager')}
            className="p-3.5 bg-black hover:bg-neutral-900 border-2 border-black shadow-hard-sm text-left font-mono transition-all active:translate-x-0.5 active:translate-y-0.5 text-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-black text-xs uppercase text-yellow-400 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Fleet Ops Command
                </span>
                <span className="text-[9px] bg-yellow-400 text-black font-bold px-1 uppercase">1-TAP</span>
              </div>
              <div className="font-black text-sm text-white mt-1">David Kiprono</div>
              <div className="text-[11px] text-neutral-300 font-mono mt-0.5">+254 711 554 990</div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase text-yellow-300 pt-2 border-t border-white/30">
              <span>MULTI-VEHICLE FLEET</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>

      {/* Standard Credential Form (Collapsible/Toggle) */}
      <div className="bg-neutral-50 border-2 border-black p-5 shadow-hard space-y-4">
        <div className="flex items-center justify-between border-b border-black pb-2">
          <span className="font-bold text-xs uppercase text-black">
            {mode === 'register' ? 'CREATE KENYA MOTORIST ACCOUNT' : 'OR SIGN IN WITH KENYAN MOBILE NUMBER'}
          </span>
          <div className="flex items-center gap-2 text-xs">
            {mode === 'register' ? (
              <button
                type="button"
                onClick={() => setMode('credentials')}
                className="underline font-bold text-black"
              >
                Existing Account?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('register')}
                className="underline font-bold text-black"
              >
                Register
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="space-y-3">
          {mode === 'register' && (
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase text-black">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samuel Kariuki"
                className="rounded-none border-2 border-black font-mono text-xs h-10 bg-white"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs font-bold uppercase text-black">
              Kenyan Mobile Number or Email
            </Label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <Input
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="pl-9 rounded-none border-2 border-black font-mono text-xs h-10 bg-white"
              />
            </div>
            <div className="text-[10px] text-neutral-500">
              Supports all Kenyan carriers (Safaricom, Airtel, Telkom)
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold uppercase text-black">Password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 rounded-none border-2 border-black font-mono text-xs h-10 bg-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-none bg-black hover:bg-neutral-800 text-white font-mono font-black text-xs h-10 uppercase mt-2 shadow-hard-sm"
          >
            {mode === 'register' ? 'COMPLETE REGISTRATION & ENTER' : 'SIGN IN & ACTIVATE SOS'}
          </Button>
        </form>
      </div>
    </div>
  );
};
