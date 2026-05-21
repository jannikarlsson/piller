import { writable } from 'svelte/store';
import type { Medication } from '$lib/firebase';

export const medicationsStore = writable<Medication[]>([]);
export const medicationsLoading = writable(true);
export const medicationsError = writable<string | null>(null);

let unsubscribe: (() => void) | null = null;

export function startMedicationsSync(userId: string) {
	stopMedicationsSync();
	medicationsLoading.set(true);
	medicationsError.set(null);

	import('$lib/firebase').then(({ subscribeMedications }) => {
		unsubscribe = subscribeMedications(
			userId,
			(meds) => {
				medicationsStore.set(meds);
				medicationsLoading.set(false);
			}
		);
	}).catch((e) => {
		console.error(e);
		medicationsError.set('load_failed');
		medicationsLoading.set(false);
	});
}

export function stopMedicationsSync() {
	if (unsubscribe) {
		unsubscribe();
		unsubscribe = null;
	}
}
