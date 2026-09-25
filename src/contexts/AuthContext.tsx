import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '@/types/sos';
import { storageService, DEFAULT_AUTH_USER } from '@/services/storage';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginAsDriver: () => void;
  loginAsFleet: () => void;
  quickSignIn: (role: 'driver' | 'fleet_manager') => void;
  signIn: (phoneOrEmail: string, pass: string) => boolean;
  register: (name: string, phone: string, pass: string, role?: 'driver' | 'fleet_manager') => void;
  signOut: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => storageService.getAuthUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    storageService.setAuthUser(user);
  }, [user]);

  const loginAsDriver = () => {
    const driverUser: AuthUser = {
      id: 'usr-driver-ke-01',
      name: 'Brian Mutua',
      email: 'brian.mutua@sosradar.co.ke',
      phone: '+254 722 849 102',
      role: 'driver',
      memberId: 'KE-AA-8849',
      plan: 'Kenya Motorist Emergency Shield',
    };
    setUser(driverUser);
  };

  const loginAsFleet = () => {
    const fleetUser: AuthUser = {
      id: 'usr-fleet-ke-02',
      name: 'David Kiprono',
      email: 'david.kiprono@transkenya.co.ke',
      phone: '+254 711 554 990',
      role: 'fleet_manager',
      memberId: 'FLT-NAI-901',
      plan: 'Safaricom Fleet Assurance',
    };
    setUser(fleetUser);
  };

  const quickSignIn = (role: 'driver' | 'fleet_manager') => {
    if (role === 'driver') loginAsDriver();
    else loginAsFleet();
  };

  const signIn = (phoneOrEmail: string, _pass: string): boolean => {
    if (!phoneOrEmail) return false;
    const isFleet = phoneOrEmail.toLowerCase().includes('fleet');
    const existing = storageService.getAuthUser();
    const newUser: AuthUser = {
      id: existing?.id || `usr-${Date.now()}`,
      name: existing?.name || (isFleet ? 'David Kiprono' : 'Brian Mutua'),
      email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail.replace(/\s+/g, '')}@sosradar.co.ke`,
      phone: phoneOrEmail.startsWith('+254') ? phoneOrEmail : `+254 ${phoneOrEmail}`,
      role: isFleet ? 'fleet_manager' : 'driver',
      memberId: `KE-${Math.floor(1000 + Math.random() * 9000)}`,
      plan: isFleet ? 'Safaricom Fleet Assurance' : 'Kenya Motorist Emergency Shield',
    };
    setUser(newUser);
    return true;
  };

  const register = (name: string, phone: string, _pass: string, role: 'driver' | 'fleet_manager' = 'driver') => {
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name,
      email: `${phone.replace(/[^0-9]/g, '')}@sosradar.co.ke`,
      phone: phone.startsWith('+254') ? phone : `+254 ${phone}`,
      role,
      memberId: `KE-${Math.floor(1000 + Math.random() * 9000)}`,
      plan: role === 'fleet_manager' ? 'Safaricom Fleet Assurance' : 'Kenya Motorist Emergency Shield',
    };
    setUser(newUser);
  };

  const signOut = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAsDriver,
        loginAsFleet,
        quickSignIn,
        signIn,
        register,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
