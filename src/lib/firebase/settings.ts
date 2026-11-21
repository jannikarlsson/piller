import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { DEFAULT_SETTINGS, type UserSettings } from '../models';
import { db, save } from './app';

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
	await save(
		setDoc(settingsRef(userId), { ...changes, updatedAt: serverTimestamp() }, { merge: true })
	);
}
