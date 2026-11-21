import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

export const userStore = writable<User | null>(null);
export const authStateStore = writable<AuthState>('loading');

export function initAuth() {
	if (typeof window === 'undefined') return;
	import('#lib/firebase/index.ts').then(({ auth, onAuthStateChanged }) => {
		onAuthStateChanged(auth, (firebaseUser) => {
			userStore.set(firebaseUser);
			authStateStore.set(firebaseUser ? 'authenticated' : 'unauthenticated');
		});
	});
}
