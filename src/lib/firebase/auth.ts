import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	type User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './app';

/*
 * Who may use the app is decided by the `allowedUsers` collection in Firestore: one document
 * per email address (the document ID). firestore.rules enforces it for all data; this check
 * only lets the app show a clear message instead of failing on the first read.
 */
async function isAllowed(user: User): Promise<boolean> {
	if (!user.email) return false;
	const entry = await getDoc(doc(db, 'allowedUsers', user.email.toLowerCase()));
	return entry.exists();
}

export async function signInWithGoogle(): Promise<{ user: User | null; error: string | null }> {
	try {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		if (!(await isAllowed(result.user))) {
			await signOut(auth);
			return { user: null, error: 'not_allowed' };
		}
		return { user: result.user, error: null };
	} catch (e: unknown) {
		console.error(e);
		return { user: null, error: 'general' };
	}
}

export async function signOutUser(): Promise<void> {
	await signOut(auth);
}

export { onAuthStateChanged };
