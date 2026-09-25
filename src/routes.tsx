import React, { ReactNode } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { ActiveRescuePage } from './pages/ActiveRescuePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SosIncident } from './types/sos';
import { storageService } from './services/storage';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

export interface RouteProps {
  activeIncident: SosIncident | null;
  onIncidentUpdated: (inc: SosIncident | null) => void;
}

export const getRoutes = (props: RouteProps): RouteConfig[] => [
  {
    name: 'Dashboard',
    path: '/',
    element: (
      <DashboardPage
        activeIncident={props.activeIncident}
        onIncidentUpdated={props.onIncidentUpdated}
      />
    ),
    public: true,
  },
  {
    name: 'Active Rescue',
    path: '/tracking',
    element: (
      <ActiveRescuePage
        activeIncident={props.activeIncident}
        onIncidentUpdated={props.onIncidentUpdated}
      />
    ),
    public: true,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <SettingsPage />,
    public: true,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    public: true,
  },
];

// Static default routes array for RouteGuard and tooling compatibility
export const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/',
    element: (
      <DashboardPage
        activeIncident={storageService.getActiveIncident()}
        onIncidentUpdated={() => {}}
      />
    ),
    public: true,
  },
  {
    name: 'Active Rescue',
    path: '/tracking',
    element: (
      <ActiveRescuePage
        activeIncident={storageService.getActiveIncident()}
        onIncidentUpdated={() => {}}
      />
    ),
    public: true,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <SettingsPage />,
    public: true,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    public: true,
  },
];
