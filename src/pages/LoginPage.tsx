import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ShieldAlert,
  Zap,
  User,
  Truck,
  ArrowRight,
  Lock,
  Phone,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, quickSignIn, register } = useAuth();

  const [mode, setMode] = useState<'quick' | 'credentials' | 'register'>('credentials');
  const [phoneOrEmail, setPhoneOrEmail] = useState('+254 712 345 678');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Kevin Otieno');
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
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white shadow-lg shadow-amber-500/20 mb-2">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          SOS RADAR KENYA
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Rapid roadside assistance • 24/7 emergency support
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="font-bold text-xs uppercase tracking-[0.2em] text-slate-700 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            Quick access
          </span>
          <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
            Fast bypass
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Need help now? Skip sign-in and trigger emergency dispatch with your saved profile and vehicle data.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleQuickLogin('driver')}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 text-left transition-all shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-amber-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Driver profile
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                  1-tap
                </span>
              </div>
              <div className="font-bold text-sm text-slate-900 mt-2">Brian Mutua</div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">+254 722 849 102</div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-slate-900">
              <span>Prado KDA 849X</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('fleet_manager')}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-300 text-left transition-all shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-rose-700 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Fleet ops
                </span>
                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                  1-tap
                </span>
              </div>
              <div className="font-bold text-sm text-slate-900 mt-2">David Kiprono</div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">+254 711 554 990</div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-slate-900">
              <span>Fleet command</span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
            </div>
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-semibold text-xs text-slate-700">
            {mode === 'register' ? 'Create account' : 'Log in'}
          </span>
          <div className="text-xs">
            {mode === 'register' ? (
              <button
                type="button"
                onClick={() => setMode('credentials')}
                className="underline text-slate-500 hover:text-slate-900"
              >
                Existing account?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('register')}
                className="underline text-slate-500 hover:text-slate-900"
              >
                Create account
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Full name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kevin Otieno"
                className="rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs h-10"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Mobile number</Label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="+254 712 345 678"
                className="pl-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs h-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pl-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs h-10"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
              <span>
                I agree to the <Link to="/privacy" className="font-semibold text-slate-900 underline">data usage and privacy policy</Link> for SOS dispatch and emergency notifications.
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-black text-xs h-10 mt-2 shadow-md shadow-amber-500/20"
          >
            {mode === 'register' ? 'Create account' : 'Log in'}
          </Button>
        </form>
      </div>
    </div>
  );
};
