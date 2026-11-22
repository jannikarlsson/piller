import type { LanguageSetting } from '../i18n';

export type ThemeSetting = 'system' | 'light' | 'dark';

/** What the reset button on Cabinet and Prescriptions does: ask, or reset all or only "out" at once. */
export type ResetMode = 'ask' | 'all' | 'out';

export interface UserSettings {
	/** `system` follows the phone's light/dark setting. */
	theme: ThemeSetting;
	/** `system` follows the phone's language (Swedish, otherwise English). */
	language: LanguageSetting;
	/** Optional parts of the app. Turning one off only hides it; saved data is kept. */
	showPrescriptions: boolean;
	showPillOrganizer: boolean;
	resetMode: ResetMode;
	/** Offer to add a medication to To do when it's marked out but has no automatic reminder. */
	askToAddToTodo: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
	theme: 'system',
	language: 'system',
	showPrescriptions: true,
	showPillOrganizer: true,
	resetMode: 'ask',
	askToAddToTodo: true
};

export type Feature = 'prescriptions' | 'pillOrganizer';

export function isFeatureOn(settings: UserSettings, feature: Feature): boolean {
	return feature === 'prescriptions' ? settings.showPrescriptions : settings.showPillOrganizer;
}
