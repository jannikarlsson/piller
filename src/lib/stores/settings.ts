import { writable, get } from 'svelte/store';
import { DEFAULT_SETTINGS, type UserSettings } from '#lib/models/index.ts';

/*
 * The user's settings, synced with Firestore. A copy is kept in the browser so that
 * the right theme (and later language) applies immediately on start-up and on the
 * login page, before Firestore has answered.
 */

const STORAGE_KEY = 'piller.settings';

function readLocal(): UserSettings {
	if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
	try {
		return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') };
	} catch {
		return DEFAULT_SETTINGS;
	}
}

function writeLocal(settings: UserSettings) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch {
		// Private browsing or storage full: the setting still works for this session
	}
}

export const settingsStore = writable<UserSettings>(readLocal());

let unsubscribe: (() => void) | null = null;
let userId: string | null = null;

export function startSettingsSync(uid: string) {
	stopSettingsSync();
	userId = uid;
	import('#lib/firebase/index.ts').then(({ subscribeSettings }) => {
		unsubscribe = subscribeSettings(uid, (settings) => {
			settingsStore.set(settings);
			writeLocal(settings);
		});
	});
}

export function stopSettingsSync() {
	unsubscribe?.();
	unsubscribe = null;
	userId = null;
}

/**
 * Change settings: applied immediately on this device, then saved to Firestore.
 * Throws if saving fails (the local change is kept and will be overwritten by the
 * next sync), so callers can show an error.
 */
export async function updateSettings(changes: Partial<UserSettings>) {
	const next = { ...get(settingsStore), ...changes };
	settingsStore.set(next);
	writeLocal(next);
	if (!userId) return;
	const { saveSettings } = await import('#lib/firebase/index.ts');
	await saveSettings(userId, changes);
}
