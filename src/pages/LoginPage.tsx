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
  Sparkles,
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
    <div className="w-full max-w-lg mx-auto px-4 py-8 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white shadow-xl shadow-red-500/20 mb-2">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          SOS RADAR KENYA
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Rapid Motorist Highway Relay • 24/7 Roadside Assistance
        </p>
      </div>

      {/* 1-Tap Emergency Quick Access Card */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-4 border border-white/10">
        <div className="border-b border-white/5 pb-3 flex items-center justify-between">
          <span className="font-bold text-xs uppercase text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            1-Tap Emergency Access
          </span>
          <span className="text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full">
            Fast Bypass
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          In an urgent breakdown? Skip manual sign-in to immediately lock your vehicle coordinates and trigger emergency roadside dispatch:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleQuickLogin('driver')}
            className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800/80 hover:from-slate-800 hover:to-slate-700/80 border border-white/10 hover:border-white/20 text-left transition-all shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-amber-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Kenyan Driver
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  1-Tap
                </span>
              </div>
              <div className="font-bold text-sm text-white mt-2">Brian Mutua</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">+254 722 849 102</div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
              <span>Prado KDA 849X</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('fleet_manager')}
            className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800/80 hover:from-slate-800 hover:to-slate-700/80 border border-white/10 hover:border-white/20 text-left transition-all shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-rose-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Fleet Ops
                </span>
                <span className="text-[10px] bg-rose-400/20 text-rose-300 font-bold px-2 py-0.5 rounded-full">
                  1-Tap
                </span>
              </div>
              <div className="font-bold text-sm text-white mt-2">David Kiprono</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">+254 711 554 990</div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
              <span>Multi-Rig Fleet</span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Standard Credential Form */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-4 border border-white/10">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="font-semibold text-xs text-slate-200">
            {mode === 'register' ? 'Register Kenyan Mobile' : 'Or Sign In with Mobile'}
          </span>
          <div className="text-xs">
            {mode === 'register' ? (
              <button
                type="button"
                onClick={() => setMode('credentials')}
                className="underline text-slate-400 hover:text-white"
              >
                Existing Account?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('register')}
                className="underline text-slate-400 hover:text-white"
              >
                Create Account
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-300">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samuel Kariuki"
                className="rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-10"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-300">
              Kenyan Mobile Number (+254)
            </Label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="pl-9 rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-300">Password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs h-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs h-10 mt-2 shadow-md shadow-red-500/20"
          >
            {mode === 'register' ? 'Register & Enter Command' : 'Sign In & Access SOS'}
          </Button>
        </form>
      </div>
    </div>
  );
};
