import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import type { LanguageSetting } from '../i18n';
import { db } from './app';

export type ThemeSetting = 'system' | 'light' | 'dark';

export interface UserSettings {
	/** `system` follows the phone's light/dark setting. */
	theme: ThemeSetting;
	/** `system` follows the phone's language (Swedish, otherwise English). */
	language: LanguageSetting;
	/** Optional parts of the app. Turning one off only hides it; saved data is kept. */
	showPrescriptions: boolean;
	showPillOrganizer: boolean;
}

/** Used for anything not saved yet, so new settings need no migration. */
export const DEFAULT_SETTINGS: UserSettings = {
	theme: 'system',
	language: 'system',
	showPrescriptions: true,
	showPillOrganizer: true
};

function settingsRef(userId: string) {
	return doc(db, 'users', userId, 'settings', 'preferences');
}

export function subscribeSettings(
	userId: string,
	callback: (settings: UserSettings) => void
): () => void {
	return onSnapshot(settingsRef(userId), (snap) => {
		callback({ ...DEFAULT_SETTINGS, ...(snap.data() as Partial<UserSettings> | undefined) });
	});
}

/** Save only the changed settings; other saved settings are kept. */
export async function saveSettings(userId: string, changes: Partial<UserSettings>): Promise<void> {
	await setDoc(settingsRef(userId), { ...changes, updatedAt: serverTimestamp() }, { merge: true });
}
