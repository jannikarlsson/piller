import { writable } from 'svelte/store';
import { sortByName, type Medication } from '#lib/models/index.ts';

export const medicationsStore = writable<Medication[]>([]);
export const medicationsLoading = writable(true);

let unsubscribe: (() => void) | null = null;

export function startMedicationsSync(userId: string) {
	stopMedicationsSync();
	medicationsLoading.set(true);

	import('#lib/firebase/index.ts')
		.then(({ subscribeMedications }) => {
			unsubscribe = subscribeMedications(userId, (meds) => {
				medicationsStore.set(sortByName(meds));
				medicationsLoading.set(false);
			});
		})
		.catch((e) => {
			console.error(e);
			medicationsLoading.set(false);
		});
}

export function stopMedicationsSync() {
	if (unsubscribe) {
		unsubscribe();
		unsubscribe = null;
	}
}
