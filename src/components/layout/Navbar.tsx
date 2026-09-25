import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SosIncident } from '@/types/sos';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShieldAlert,
  Radio,
  MapPin,
  Settings,
  PhoneCall,
  LogOut,
  Car,
  Layers,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavbarProps {
  activeIncident: SosIncident | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeIncident }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'One-Tap Dispatch' },
    { to: '/bidding', label: 'Live Bids & Pricing' },
    { to: '/tracking', label: 'Active Tracking' },
    { to: '/settings', label: 'Garage & Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 py-2.5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo: Roadside SOS */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm text-white tracking-wider flex items-center gap-1.5 uppercase">
              Roadside SOS
            </span>
            <span className="text-[10px] text-amber-400 font-bold tracking-tight">
              Emergency Response • Kenya
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-white/5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all no-underline ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Status Actions & Emergency Hotline Hotkey */}
        <div className="flex items-center gap-2">
          {/* Active Incident Pulsing Badge */}
          {activeIncident ? (
            <Link
              to="/tracking"
              className="flex items-center gap-1.5 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl text-xs font-black uppercase no-underline animate-pulse"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Rig En Route</span>
            </Link>
          ) : (
            <a
              href="tel:999"
              className="hidden sm:flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-xl text-xs font-bold no-underline transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>Kenya Police 999</span>
            </a>
          )}

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-bold hidden sm:inline">
                {user.name.split(' ')[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                className="h-8 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black border border-amber-300 shadow-sm"
              >
                Log in
              </Button>
            </Link>
          )}

          {/* Mobile Navigation Trigger */}
          <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-8 w-8 p-0 text-slate-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-950 border-white/10 text-white p-5 space-y-4">
              <SheetHeader className="border-b border-white/5 pb-3">
                <SheetTitle className="text-base font-black text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  Roadside SOS Kenya
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-2 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileDrawerOpen(false)}
                    className="block p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-white font-bold text-xs border border-white/5 no-underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <a
                  href="tel:999"
                  className="block p-3 rounded-xl bg-rose-600 text-white font-bold text-xs text-center no-underline"
                >
                  Dial Kenya Emergency 999
                </a>
                <a
                  href="tel:+254709933000"
                  className="block p-3 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs text-center border border-amber-400/30 no-underline"
                >
                  Call AA Kenya Hotline
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
