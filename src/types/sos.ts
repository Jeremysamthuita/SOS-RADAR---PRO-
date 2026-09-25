export type EmergencyCategory =
  | 'towing'
  | 'flat_tire'
  | 'dead_battery'
  | 'fuel_out'
  | 'lockout'
  | 'accident'
  | 'stuck_winch';

export interface EmergencyTypeOption {
  id: EmergencyCategory;
  label: string;
  sublabel: string;
  iconName: string;
  estimatedArrivalMins: number;
  coverageStatus: string;
  requiresSpecialEquipment?: boolean;
}

export interface TelemetryData {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  altitudeMeters: number;
  speedMph: number;
  heading: string;
  batteryLevel: number;
  cellularSignal: 'Safaricom 4G/5G' | 'Airtel 4G' | 'Edge/2G Degraded' | 'Offline Cache';
  weatherCondition: string;
  timestamp: string;
  highwayMarker: string;
  nearestIntersection: string;
}

export interface VehicleProfile {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string; // e.g. KDA 849X
  vinLast4?: string;
  type: 'Saloon' | 'SUV / 4WD' | 'Matatu / Van' | 'Commercial Truck' | 'EV / Hybrid';
  drivetrain: '2WD' | 'AWD / 4WD' | 'Heavy Commercial';
  isDefault: boolean;
  notes?: string;
}

export interface MedicalProfile {
  bloodType: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
  allergies: string;
  chronicConditions: string;
  emergencyCareHospital: string;
  donorStatus: boolean;
  nhifShifNumber: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: 'Next of Kin' | 'Spouse' | 'Fleet Manager' | 'Parent' | 'Colleague';
  phone: string; // Kenyan format +254 7XX XXX XXX
  email?: string;
  notifyOnSos: boolean;
  alertChannel: 'SMS' | 'SMS + Call' | 'Fleet Radio';
  lastAlertStatus?: 'Delivered' | 'Pending' | 'Acknowledged';
}

export interface KenyaHotline {
  name: string;
  number: string;
  category: 'Police' | 'Medical' | 'Road Rescue' | 'Traffic';
  description: string;
  tollFree: boolean;
  badge: string;
}

export interface HotspotZone {
  id: string;
  name: string;
  type: 'accident_cluster' | 'icy_grade' | 'low_signal_deadzone' | 'flood_zone' | 'patrol_depot';
  severity: 'high' | 'medium' | 'caution' | 'safe_haven';
  coordinates: [number, number]; // [lat, lng]
  radiusMeters: number;
  description: string;
  historicalIncidents: number;
  recommendedPrecaution: string;
}

export interface RescueProvider {
  id: string;
  companyName: string;
  driverName: string;
  driverAvatar: string;
  phoneMasked: string; // Kenyan number e.g. +254 709 933 000
  rating: number;
  completedRescues: number;
  vehicleType: string;
  licensePlate: string;
  currentCoordinates: [number, number];
  distanceMiles: number;
  initialEtaMinutes: number;
  currentEtaMinutes: number;
  tier: 'Primary Responder' | 'Backup Heavy Rig' | 'Air / Fast Patrol';
  status: 'matched' | 'en_route' | 'arriving' | 'on_scene' | 'in_progress' | 'completed';
}

export interface SosIncident {
  id: string;
  createdAt: string;
  status: 'initiating' | 'dispatching' | 'cascading' | 'accepted' | 'en_route' | 'arrived' | 'completed' | 'cancelled';
  category: EmergencyCategory;
  categoryLabel: string;
  vehicle: VehicleProfile;
  telemetry: TelemetryData;
  manualLocation?: string;
  notes?: string;
  isSilentAlarm: boolean;
  shareMedicalProfile: boolean;
  directAudioLinkActive: boolean;
  primaryProvider: RescueProvider;
  backupProvider?: RescueProvider;
  assignedProviderId: string;
  cascadeSecondsRemaining: number;
  cascadeTriggered: boolean;
  coveragePlan: string;
  dispatchGuarantee: string;
  notifiedContacts: {
    contactId: string;
    contactName: string;
    phone: string;
    status: 'Sent' | 'Delivered' | 'Acknowledged';
    sentAt: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'driver' | 'rescuer' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isQuickChip?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string; // e.g. +254 712 345 678
  role: 'driver' | 'fleet_manager';
  memberId: string;
  plan: 'Kenya Motorist Emergency Shield' | 'Safaricom Fleet Assurance';
}
