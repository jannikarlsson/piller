import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, isFeatureOn } from './settings';

describe('isFeatureOn', () => {
	it('has every feature on by default', () => {
		expect(isFeatureOn(DEFAULT_SETTINGS, 'prescriptions')).toBe(true);
		expect(isFeatureOn(DEFAULT_SETTINGS, 'pillOrganizer')).toBe(true);
	});

	it('follows each feature’s own setting', () => {
		const settings = { ...DEFAULT_SETTINGS, showPrescriptions: false };
		expect(isFeatureOn(settings, 'prescriptions')).toBe(false);
		expect(isFeatureOn(settings, 'pillOrganizer')).toBe(true);
	});
});
