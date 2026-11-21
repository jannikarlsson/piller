import type { Translations } from '#lib/i18n/index.ts';
import type { IconName } from '#lib/components/ui/Icon.svelte';
import { isFeatureOn, type Feature, type UserSettings } from '#lib/models/index.ts';

export interface NavLink {
	href: string;
	/** Key in `t.nav`, looked up when shown so it follows the language. */
	label: keyof Translations['nav'];
	/** `null` shows the user's photo. */
	icon: IconName | null;
	/** Hidden, and its page unreachable, while this feature is switched off. */
	feature?: Feature;
}

export const NAV_LINKS: NavLink[] = [
	{ href: '/inventory', label: 'inventory', icon: 'cabinet' },
	{ href: '/prescription', label: 'prescription', icon: 'prescription', feature: 'prescriptions' },
	{ href: '/picking', label: 'picking', icon: 'organizer', feature: 'pillOrganizer' },
	{ href: '/actions', label: 'actions', icon: 'checklist' },
	{ href: '/profile', label: 'profile', icon: null }
];

/** Where to go when the current page isn't available. */
export const HOME_PATH = '/inventory';

/** The link's own page or any page below it. */
export function isUnder(path: string, href: string): boolean {
	return path === href || path.startsWith(`${href}/`);
}

export function isLinkVisible(link: NavLink, settings: UserSettings): boolean {
	return !link.feature || isFeatureOn(settings, link.feature);
}

/** True when the path belongs to a feature that is switched off. */
export function isPathOff(path: string, settings: UserSettings): boolean {
	return NAV_LINKS.some((link) => !isLinkVisible(link, settings) && isUnder(path, link.href));
}
