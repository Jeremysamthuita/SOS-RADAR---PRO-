import { describe, expect, it } from 'vitest';
import { calculateEmergencyEstimate } from '@/lib/emergency-pricing';

describe('calculateEmergencyEstimate', () => {
  it('adds the emergency base price plus selected add-ons', () => {
    const result = calculateEmergencyEstimate('towing', ['winch', 'roadside_assist']);

    expect(result.basePrice).toBe(2900);
    expect(result.modifierTotal).toBe(700);
    expect(result.total).toBe(3600);
    expect(result.selectedLabels).toEqual(['Winch / Recovery', 'Roadside assistance']);
  });

  it('marks dispatch as blocked when required checks are missing', () => {
    const result = calculateEmergencyEstimate('flat_tire', ['flat_tire_change']);

    expect(result.requiredChecksComplete).toBe(true);
    expect(result.total).toBe(2200);
  });
});
