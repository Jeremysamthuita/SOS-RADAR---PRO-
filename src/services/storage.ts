import {
  SosIncident,
  VehicleProfile,
  EmergencyContact,
  TelemetryData,
  EmergencyCategory,
  ChatMessage,
  AuthUser,
  MedicalProfile,
} from '@/types/sos';
import {
  INITIAL_VEHICLES,
  INITIAL_CONTACTS,
  INITIAL_TELEMETRY,
  INITIAL_MEDICAL_PROFILE,
  MOCK_PRIMARY_PROVIDER,
  MOCK_BACKUP_PROVIDER,
  EMERGENCY_CATEGORIES,
} from './mockData';

const STORAGE_KEYS = {
  ACTIVE_INCIDENT: 'sos_radar_active_incident',
  VEHICLES: 'sos_radar_vehicles',
  CONTACTS: 'sos_radar_contacts',
  CHAT_MESSAGES: 'sos_radar_chat_messages',
  TELEMETRY: 'sos_radar_telemetry',
  AUTH_USER: 'sos_radar_auth_user',
  MEDICAL_PROFILE: 'sos_radar_medical_profile',
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setInStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const DEFAULT_AUTH_USER: AuthUser = {
  id: 'usr-driver-ke-01',
  name: 'Brian Mutua',
  email: 'brian.mutua@sosradar.co.ke',
  phone: '+254 722 849 102',
  role: 'driver',
  memberId: 'KE-AA-8849',
  plan: 'Kenya Motorist Emergency Shield',
};

export const storageService = {
  // --- Auth User ---
  getAuthUser(): AuthUser | null {
    return getFromStorage<AuthUser | null>(STORAGE_KEYS.AUTH_USER, DEFAULT_AUTH_USER);
  },

  setAuthUser(user: AuthUser | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } else {
      setInStorage(STORAGE_KEYS.AUTH_USER, user);
    }
  },

  // --- Medical Profile ---
  getMedicalProfile(): MedicalProfile {
    return getFromStorage<MedicalProfile>(STORAGE_KEYS.MEDICAL_PROFILE, INITIAL_MEDICAL_PROFILE);
  },

  saveMedicalProfile(profile: MedicalProfile): void {
    setInStorage(STORAGE_KEYS.MEDICAL_PROFILE, profile);
  },

  // --- Vehicles ---
  getVehicles(): VehicleProfile[] {
    const vehicles = getFromStorage<VehicleProfile[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    return vehicles.length > 0 ? vehicles : INITIAL_VEHICLES;
  },

  getDefaultVehicle(): VehicleProfile {
    const list = this.getVehicles();
    return list.find((v) => v.isDefault) || list[0] || INITIAL_VEHICLES[0];
  },

  saveVehicles(vehicles: VehicleProfile[]): void {
    setInStorage(STORAGE_KEYS.VEHICLES, vehicles);
  },

  addVehicle(vehicle: Omit<VehicleProfile, 'id'>): VehicleProfile {
    const list = this.getVehicles();
    const newVeh: VehicleProfile = {
      ...vehicle,
      id: `veh-${Date.now()}`,
    };
    if (newVeh.isDefault) {
      list.forEach((v) => (v.isDefault = false));
    }
    const updated = [...list, newVeh];
    this.saveVehicles(updated);
    return newVeh;
  },

  setDefaultVehicle(id: string): void {
    const list = this.getVehicles().map((v) => ({
      ...v,
      isDefault: v.id === id,
    }));
    this.saveVehicles(list);
  },

  // --- Contacts ---
  getContacts(): EmergencyContact[] {
    const contacts = getFromStorage<EmergencyContact[]>(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS);
    return contacts.length > 0 ? contacts : INITIAL_CONTACTS;
  },

  saveContacts(contacts: EmergencyContact[]): void {
    setInStorage(STORAGE_KEYS.CONTACTS, contacts);
  },

  addContact(contact: Omit<EmergencyContact, 'id'>): EmergencyContact {
    const list = this.getContacts();
    const newContact: EmergencyContact = {
      ...contact,
      id: `cont-${Date.now()}`,
    };
    const updated = [...list, newContact];
    this.saveContacts(updated);
    return newContact;
  },

  updateContact(id: string, updates: Partial<EmergencyContact>): void {
    const list = this.getContacts().map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.saveContacts(list);
  },

  deleteContact(id: string): void {
    const list = this.getContacts().filter((c) => c.id !== id);
    this.saveContacts(list);
  },

  // --- Telemetry ---
  getTelemetry(): TelemetryData {
    const data = getFromStorage<TelemetryData>(STORAGE_KEYS.TELEMETRY, INITIAL_TELEMETRY);
    return {
      ...data,
      timestamp: new Date().toISOString(),
    };
  },

  saveTelemetry(telemetry: TelemetryData): void {
    setInStorage(STORAGE_KEYS.TELEMETRY, telemetry);
  },

  // --- Active Incident Management ---
  getActiveIncident(): SosIncident | null {
    return getFromStorage<SosIncident | null>(STORAGE_KEYS.ACTIVE_INCIDENT, null);
  },

  saveActiveIncident(incident: SosIncident | null): void {
    if (!incident) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_INCIDENT);
    } else {
      setInStorage(STORAGE_KEYS.ACTIVE_INCIDENT, incident);
    }
  },

  createIncident(
    category: EmergencyCategory = 'towing',
    options?: {
      manualLocation?: string;
      notes?: string;
      selectedVehicle?: VehicleProfile;
      isSilentAlarm?: boolean;
      shareMedicalProfile?: boolean;
      directAudioLinkActive?: boolean;
    }
  ): SosIncident {
    const vehicle = options?.selectedVehicle || this.getDefaultVehicle();
    const telemetry = this.getTelemetry();
    const catConfig = EMERGENCY_CATEGORIES.find((c) => c.id === category) || EMERGENCY_CATEGORIES[0];

    const contacts = this.getContacts().filter((c) => c.notifyOnSos);
    const notified = contacts.map((c) => ({
      contactId: c.id,
      contactName: c.name,
      phone: c.phone,
      status: 'Delivered' as const,
      sentAt: new Date().toISOString(),
    }));

    const incident: SosIncident = {
      id: `KENYA-SOS-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'dispatching',
      category,
      categoryLabel: catConfig.label,
      vehicle,
      telemetry,
      manualLocation: options?.manualLocation,
      notes: options?.notes,
      isSilentAlarm: options?.isSilentAlarm || false,
      shareMedicalProfile: options?.shareMedicalProfile !== false,
      directAudioLinkActive: options?.directAudioLinkActive || false,
      primaryProvider: { ...MOCK_PRIMARY_PROVIDER },
      backupProvider: { ...MOCK_BACKUP_PROVIDER },
      assignedProviderId: MOCK_PRIMARY_PROVIDER.id,
      cascadeSecondsRemaining: 50,
      cascadeTriggered: false,
      coveragePlan: 'Kenya Motorist Emergency Shield (AA Kenya Relay)',
      dispatchGuarantee: '100% Covered • Zero Out of Pocket',
      notifiedContacts: notified,
    };

    this.saveActiveIncident(incident);

    const initialChats: ChatMessage[] = [
      {
        id: 'msg-sys-1',
        sender: 'system',
        senderName: 'Kenya Emergency Dispatch',
        text: `Distress beacon acknowledged. Live Kenyan coordinates transmitted to ${MOCK_PRIMARY_PROVIDER.companyName}. Medical data attached.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'msg-prov-1',
        sender: 'rescuer',
        senderName: MOCK_PRIMARY_PROVIDER.driverName,
        text: `Habari! Juma here with AA Kenya Unit 44 (${MOCK_PRIMARY_PROVIDER.licensePlate}). Rolling to your location on the corridor now. Stay inside the car with hazard flashers on!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    this.saveChatMessages(initialChats);

    // Haptic pulse confirmation on trigger
    this.triggerHapticPulse();

    return incident;
  },

  // --- Haptic Feedback ---
  triggerHapticPulse(pattern: number[] = [120, 60, 120]) {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      console.warn('Vibration API error:', e);
    }
  },

  // --- Masked In-App Chat ---
  getChatMessages(): ChatMessage[] {
    return getFromStorage<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, []);
  },

  saveChatMessages(messages: ChatMessage[]): void {
    setInStorage(STORAGE_KEYS.CHAT_MESSAGES, messages);
  },

  addChatMessage(
    sender: 'driver' | 'rescuer' | 'system',
    senderName: string,
    text: string,
    isQuickChip = false
  ): ChatMessage {
    const list = this.getChatMessages();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuickChip,
    };
    const updated = [...list, newMsg];
    this.saveChatMessages(updated);
    return newMsg;
  },

  playEmergencyAudioTone(frequency = 880, duration = 0.35, type: OscillatorType = 'square') {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone synthesis blocked:', e);
    }
  },
};
