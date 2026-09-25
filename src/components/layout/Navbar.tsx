import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Radar,
  Navigation,
  Settings,
  Menu,
  Radio,
  User,
  LogOut,
  LogIn,
  Satellite,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SosIncident } from '@/types/sos';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  activeIncident: SosIncident | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeIncident }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'DASHBOARD & RADAR', icon: Radar },
    {
      path: '/tracking',
      label: 'ACTIVE TRACKING',
      icon: Navigation,
      badge: activeIncident ? 'LIVE' : undefined,
    },
    { path: '/settings', label: 'GARAGE & CONTACTS', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white border-b-4 border-black font-mono">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        {/* Logo Brand */}
        <Link to="/" className="flex items-center gap-2.5 text-white no-underline group">
          <div className="w-9 h-9 border-2 border-white bg-red-600 flex items-center justify-center shadow-hard-sm group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-black tracking-tight leading-none uppercase flex items-center gap-1.5">
              SOS RADAR
              <span className="text-[10px] bg-yellow-400 text-black px-1 font-bold">SENTINEL-1</span>
            </div>
            <div className="text-[9px] text-neutral-400 tracking-widest uppercase">
              HIGH-SPEED CRISIS ROAD RESCUE
            </div>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`h-10 px-3 flex items-center gap-2 border-2 text-xs font-bold uppercase transition-all ${
                  isActive
                    ? 'bg-white text-black border-white shadow-hard-sm'
                    : 'bg-black text-white border-transparent hover:border-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.badge ? 'text-red-500 animate-pulse' : ''}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-600 text-white text-[9px] font-black px-1 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: User Profile / Login & Active Incident Warning */}
        <div className="flex items-center gap-2">
          {/* Active Incident Warning Chip */}
          {activeIncident && (
            <Link
              to="/tracking"
              className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white border-2 border-white px-2.5 py-1 text-xs font-black uppercase tracking-wider animate-pulse no-underline"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>DISPATCH ACTIVE</span>
            </Link>
          )}

          {/* User Profile or Login CTA */}
          {user ? (
            <div className="hidden sm:flex items-center gap-1.5 bg-neutral-900 border-2 border-white px-2.5 h-10 text-xs">
              <User className="w-3.5 h-3.5 text-yellow-400" />
              <div className="text-left">
                <div className="font-bold text-white text-[11px] leading-tight truncate max-w-[120px]">
                  {user.name}
                </div>
                <div className="text-[9px] text-neutral-400 uppercase leading-none">
                  {user.role === 'fleet_manager' ? 'Fleet Command' : 'VIP Driver'}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="h-7 w-7 p-0 ml-1 rounded-none text-neutral-400 hover:text-white hover:bg-neutral-800"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="h-10 rounded-none bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-white shadow-hard-sm font-mono font-black text-xs px-3 uppercase flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              SIGN IN
            </Button>
          )}

          {/* Mobile Menu Hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 p-0 rounded-none border-2 border-white bg-black text-white hover:bg-neutral-900"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-black text-white border-l-4 border-white p-5 font-mono">
                <div className="flex flex-col gap-6 mt-4">
                  <div className="border-b-2 border-white pb-3">
                    <div className="font-black text-base uppercase">SOS RADAR COMMAND</div>
                    <div className="text-xs text-neutral-400 mt-1">NASA Sentinel-1 Road Assist</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {navLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`p-3 border-2 text-xs font-black uppercase flex items-center justify-between no-underline ${
                            isActive
                              ? 'bg-white text-black border-white'
                              : 'bg-black text-white border-white/40 hover:border-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="bg-red-600 text-white text-[9px] px-1 font-bold">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-auto border-t-2 border-white/40 pt-4 space-y-3">
                    {user ? (
                      <div className="space-y-2">
                        <div className="text-xs text-neutral-400">Signed in as:</div>
                        <div className="font-bold text-sm text-yellow-300">{user.name}</div>
                        <div className="text-[11px] text-neutral-300">{user.plan}</div>
                        <Button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            signOut();
                          }}
                          className="w-full rounded-none bg-neutral-800 hover:bg-neutral-700 text-white font-mono font-bold text-xs h-9 uppercase border border-white"
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/login');
                        }}
                        className="w-full rounded-none bg-yellow-400 hover:bg-yellow-500 text-black font-mono font-bold text-xs h-10 uppercase"
                      >
                        Sign In / Register
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
