import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '#lib/models/index.ts';
import { NAV_LINKS, isLinkVisible, isPathOff, isUnder } from './navigation';

describe('isUnder', () => {
	it('matches the page itself and pages below it', () => {
		expect(isUnder('/profile', '/profile')).toBe(true);
		expect(isUnder('/profile/medications', '/profile')).toBe(true);
	});

	it('does not match pages that only start with the same letters', () => {
		expect(isUnder('/profiles', '/profile')).toBe(false);
		expect(isUnder('/inventory', '/profile')).toBe(false);
	});
});

describe('isLinkVisible and isPathOff', () => {
	const noOrganizer = { ...DEFAULT_SETTINGS, showPillOrganizer: false };

	it('shows every tab by default', () => {
		expect(NAV_LINKS.every((link) => isLinkVisible(link, DEFAULT_SETTINGS))).toBe(true);
	});

	it('hides only the switched-off feature’s tab', () => {
		const hidden = NAV_LINKS.filter((link) => !isLinkVisible(link, noOrganizer));
		expect(hidden.map((link) => link.href)).toEqual(['/picking']);
	});

	it('treats a switched-off feature’s page as unreachable, and nothing else', () => {
		expect(isPathOff('/picking', noOrganizer)).toBe(true);
		expect(isPathOff('/inventory', noOrganizer)).toBe(false);
		expect(isPathOff('/picking', DEFAULT_SETTINGS)).toBe(false);
	});
});
