import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { DashboardPage } from '@/pages/DashboardPage';
import { LiveBiddingPage } from '@/pages/LiveBiddingPage';
import { ActiveRescuePage } from '@/pages/ActiveRescuePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LoginPage } from '@/pages/LoginPage';
import { DataUsagePage } from '@/pages/DataUsagePage';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { SosIncident } from '@/types/sos';
import { storageService } from '@/services/storage';
import { Toaster } from 'sonner';

export function App() {
  const [activeIncident, setActiveIncident] = useState<SosIncident | null>(() =>
    storageService.getActiveIncident()
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setActiveIncident(storageService.getActiveIncident());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-transparent text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
          <Navbar activeIncident={activeIncident} />

          <main className="flex-1 w-full pb-16 bg-transparent">
            <Routes>
              {/* Screen 1: "One-Tap Dispatch" Home Screen (Dominant map + 4 Large Diagnostic Tiles) */}
              <Route
                path="/"
                element={
                  <RouteGuard>
                    <DashboardPage
                      activeIncident={activeIncident}
                      onIncidentUpdated={setActiveIncident}
                    />
                  </RouteGuard>
                }
              />

              {/* Screen 2: "Live Bidding & Pricing" Comparison Matrix */}
              <Route
                path="/bidding"
                element={
                  <RouteGuard>
                    <LiveBiddingPage
                      onIncidentUpdated={setActiveIncident}
                    />
                  </RouteGuard>
                }
              />

              {/* Screen 3: "Anxiety-Reduction" Active Tracking Screen */}
              <Route
                path="/tracking"
                element={
                  <RouteGuard>
                    <ActiveRescuePage
                      activeIncident={activeIncident}
                      onIncidentUpdated={setActiveIncident}
                    />
                  </RouteGuard>
                }
              />

              {/* Garage & Settings */}
              <Route
                path="/settings"
                element={
                  <RouteGuard>
                    <SettingsPage />
                  </RouteGuard>
                }
              />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/privacy" element={<DataUsagePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="w-full border-t border-slate-800 bg-slate-950/90 py-4 px-4 text-xs text-slate-400 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div>
                <span className="font-extrabold text-white">ROADSIDE SOS</span> • High-Stress Highway Emergency Protocol
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span>National Hotlines: 999 • 112 • 1199</span>
                <span>AA Kenya +254 709 933 000</span>
              </div>
            </div>
          </footer>

          <Toaster position="top-right" richColors closeButton theme="dark" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
