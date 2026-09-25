import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/layout/Navbar';
import { getRoutes } from './routes';
import { storageService } from '@/services/storage';
import { SosIncident } from '@/types/sos';
import { AuthProvider } from '@/contexts/AuthContext';

const App: React.FC = () => {
  const [activeIncident, setActiveIncident] = useState<SosIncident | null>(
    storageService.getActiveIncident()
  );

  useEffect(() => {
    // Sync active incident on mount
    const inc = storageService.getActiveIncident();
    setActiveIncident(inc);
  }, []);

  const routeList = getRoutes({
    activeIncident,
    onIncidentUpdated: setActiveIncident,
  });

  return (
    <AuthProvider>
      <Router>
        <IntersectObserver />
        <div className="flex flex-col min-h-screen bg-neutral-100 text-foreground selection:bg-black selection:text-white">
          <Navbar activeIncident={activeIncident} />
          <main className="flex-grow pb-12">
            <Routes>
              {routeList.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global High-Glanceability Tactical Footer */}
          <footer className="w-full bg-black text-white border-t-4 border-black py-4 px-4 font-mono text-xs">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 border border-white animate-pulse" />
                <span className="font-black uppercase tracking-wider">
                  SOS RADAR - NASA SENTINEL-1 SAR ROAD RESCUE
                </span>
              </div>
              <div className="text-neutral-400 text-[11px]">
                NASA Sentinel-1 SAR Geolocation • 45–60s Cascaded Dispatch • 100% Emergency Motorist Assurance
              </div>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" richColors />
      </Router>
    </AuthProvider>
  );
};

export default App;
