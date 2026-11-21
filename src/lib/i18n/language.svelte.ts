import { sv, type Translations } from './sv';
import { en } from './en';

/*
 * The app's texts in the current language. Components import `t` from here and use it
 * as before (`t.profile.title`); reading it inside markup or $derived updates
 * automatically when the language changes.
 */

const dictionaries = { sv, en } satisfies Record<string, Translations>;

export type Language = keyof typeof dictionaries;
export type LanguageSetting = Language | 'system';

/** Each language's name in itself, so people can find their own in the list. */
export const LANGUAGE_NAMES: Record<Language, string> = {
	sv: 'Svenska',
	en: 'English'
};

// Start in the saved (or phone) language, so the first screen is already right.
// Same browser copy of the settings as src/lib/stores/settings.ts.
function initialLanguage(): Language {
	try {
		const saved = JSON.parse(localStorage.getItem('piller.settings') ?? '{}').language;
		return resolveLanguage(saved === 'sv' || saved === 'en' ? saved : 'system');
	} catch {
		return resolveLanguage('system');
	}
}

let current = $state<Language>(initialLanguage());

export function getLanguage(): Language {
	return current;
}

export function setLanguage(language: Language) {
	current = language;
}

/** `system` picks Swedish for Swedish phones and English for everyone else. */
export function resolveLanguage(setting: LanguageSetting): Language {
	if (setting !== 'system') return setting;
	const preferred = typeof navigator === 'undefined' ? 'sv' : navigator.language;
	return preferred.toLowerCase().startsWith('sv') ? 'sv' : 'en';
}

// Every top-level read (t.profile, t.nav, …) goes through the current language
export const t = new Proxy({} as Translations, {
	get(_, section: string) {
		return dictionaries[current][section as keyof Translations];
	}
});
