import { EmergencyCategory } from '@/types/sos';

export interface EmergencyPricingOption {
  id: string;
  label: string;
  description: string;
  price: number;
}

export interface EmergencyEstimate {
  basePrice: number;
  modifierTotal: number;
  total: number;
  selectedLabels: string[];
  selectedOptions: string[];
  requiredChecksComplete: boolean;
}

export const EMERGENCY_BASE_PRICING: Record<EmergencyCategory, number> = {
  towing: 2900,
  flat_tire: 2200,
  dead_battery: 1200,
  fuel_out: 1800,
  lockout: 2200,
  accident: 4200,
  stuck_winch: 2600,
};

export const EMERGENCY_PRICE_OPTIONS: Record<EmergencyCategory, EmergencyPricingOption[]> = {
  towing: [
    { id: 'winch', label: 'Winch / Recovery', description: 'Vehicle extraction from shoulder or ditch', price: 450 },
    { id: 'roadside_assist', label: 'Roadside assistance', description: 'Safe checkpoint and on-site vehicle support', price: 250 },
    { id: 'escort', label: 'Escort to safe bay', description: 'Driver escort to nearest garage or service station', price: 300 },
  ],
  flat_tire: [
    { id: 'flat_tire_change', label: 'Tire change / puncture repair', description: 'Spare wheel swap or puncture repair', price: 500 },
    { id: 'sealant', label: 'Sealant + inflation', description: 'Air refill and tire sealant service', price: 180 },
    { id: 'battery_check', label: 'Battery health check', description: '12V/24V system diagnostic after tire fix', price: 150 },
  ],
  dead_battery: [
    { id: 'jump_start', label: 'Jump start', description: 'Boosted start for a stalled vehicle', price: 220 },
    { id: 'battery_swap', label: 'Battery swap', description: 'Battery replacement at the roadside', price: 650 },
    { id: 'alternator_test', label: 'Alternator test', description: 'Electrical system diagnostic', price: 180 },
  ],
  fuel_out: [
    { id: 'fuel_delivery', label: 'Fuel delivery', description: 'Emergency delivery of required fuel type', price: 350 },
    { id: 'mobile_assist', label: 'Roadside escort', description: 'Escort to pump or safe stop', price: 200 },
  ],
  lockout: [
    { id: 'unlock_service', label: 'Unlock service', description: 'Lockout entry and key retrieval', price: 420 },
    { id: 'key_replacement', label: 'Key replacement', description: 'Emergency key programming or spare key support', price: 520 },
  ],
  accident: [
    { id: 'scene_clearance', label: 'Scene clearance', description: 'Safe-site cleanup and hazard support', price: 650 },
    { id: 'medical_support', label: 'Medical support', description: 'Paramedic check and trauma response', price: 900 },
    { id: 'tow_recovery', label: 'Tow recovery', description: 'Recovery to police-approved garage', price: 750 },
  ],
  stuck_winch: [
    { id: 'recovery_pull', label: 'Recovery pull', description: 'Mud or ditch extraction winch', price: 600 },
    { id: 'safety_escort', label: 'Safety escort', description: 'Escort after extraction to safe stop', price: 260 },
  ],
};

export const REQUIRED_TriageChecks = [
  'safe_location',
  'conscious_and_breathing',
  'hazards_visible',
  'vehicle_secure',
] as const;

export const REQUIRED_TriageLabels: Record<(typeof REQUIRED_TriageChecks)[number], string> = {
  safe_location: 'I am in a safe, visible location',
  conscious_and_breathing: 'I am conscious and breathing normally',
  hazards_visible: 'My hazard lights / warning indicators are on',
  vehicle_secure: 'The vehicle is stable and not in immediate danger',
};

export function calculateEmergencyEstimate(
  category: EmergencyCategory,
  selectedOptionIds: string[] = [],
  checks: Partial<Record<(typeof REQUIRED_TriageChecks)[number], boolean>> = {},
  customAdjustment = 0
): EmergencyEstimate {
  const basePrice = EMERGENCY_BASE_PRICING[category] ?? 0;
  const catalog = EMERGENCY_PRICE_OPTIONS[category] ?? [];
  const optionMap = new Map(catalog.map((option) => [option.id, option]));

  const selectedOptions = selectedOptionIds.filter((optionId) => optionMap.has(optionId));
  const selectedLabels = selectedOptions.map((optionId) => optionMap.get(optionId)?.label ?? optionId);
  const modifierTotal = selectedOptions.reduce(
    (total, optionId) => total + (optionMap.get(optionId)?.price ?? 0),
    0
  );

  const requiredChecksComplete = REQUIRED_TriageChecks.every(
    (check) => checks[check] === true
  );

  return {
    basePrice,
    modifierTotal,
    total: basePrice + modifierTotal + customAdjustment,
    selectedLabels,
    selectedOptions,
    requiredChecksComplete,
  };
}
