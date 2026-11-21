import { browser } from '$app/environment';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import {
	getFirestore,
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
	type Firestore
} from 'firebase/firestore';
import { firebaseConfig } from '../config';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

/*
 * Firestore keeps a copy of the data in the browser (IndexedDB), so the app shows the last known
 * lists without a connection, and changes made offline are sent when it's back. Shared between
 * tabs. On the server (dev rendering) there's no IndexedDB, so it uses the default memory cache.
 */
function createFirestore(): Firestore {
	if (!browser) return getFirestore(app);
	try {
		return initializeFirestore(app, {
			localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
		});
	} catch {
		// Already set up, e.g. after a hot reload in development
		return getFirestore(app);
	}
}

export const db = createFirestore();

setPersistence(auth, browserLocalPersistence).catch(console.error);

export function currentUid(): string {
	const uid = auth.currentUser?.uid;
	if (!uid) throw new Error('Not signed in');
	return uid;
}

/**
 * Wait for a write, except when offline. Firestore applies a change locally at once and sends it
 * when the connection is back, but its promise only settles then, which would leave save buttons
 * spinning. Offline we return straight away; a failure on reconnect is only logged.
 */
export async function save(write: Promise<unknown>): Promise<void> {
	if (browser && !navigator.onLine) {
		write.catch((e) => console.error('A change made offline could not be saved', e));
		return;
	}
	await write;
}
