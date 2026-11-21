import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	type User
} from 'firebase/auth';
import { ALLOWED_EMAILS } from '../config';
import { auth } from './app';

function isEmailAllowed(email: string | null): boolean {
	if (!email) return false;
	return ALLOWED_EMAILS.includes(email.toLowerCase());
}

export async function signInWithGoogle(): Promise<{ user: User | null; error: string | null }> {
	try {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		if (!isEmailAllowed(result.user.email)) {
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
