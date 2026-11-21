import { initializeApp, getApps } from 'firebase/app';
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	setPersistence,
	browserLocalPersistence,
	onAuthStateChanged,
	type User
} from 'firebase/auth';
import {
	getFirestore,
	collection,
	doc,
	getDocs,
	setDoc,
	updateDoc,
	deleteDoc,
	writeBatch,
	serverTimestamp,
	onSnapshot,
	query,
	orderBy
} from 'firebase/firestore';
import { firebaseConfig, ALLOWED_EMAILS } from './config';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch(console.error);

export function isEmailAllowed(email: string | null): boolean {
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

// ─── Medications CRUD ─────────────────────────────────────────────────────────

export type TileState = 'neutral' | 'available' | 'out';

export interface Medication {
	id: string;
	name: string;
	concentration: string;
	alternativeNames: string[];
	inventoryState: TileState;
	prescriptionState: TileState;
	/** Checked off on the "Plocka" checklist while filling the pill organizer. */
	picked: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface MedicationInput {
	name: string;
	concentration: string;
	alternativeNames: string[];
}

function medicationsRef(userId: string) {
	return collection(db, 'users', userId, 'medications');
}

export function subscribeMedications(
	userId: string,
	callback: (meds: Medication[]) => void
): () => void {
	const q = query(medicationsRef(userId), orderBy('createdAt', 'asc'));
	return onSnapshot(q, (snap) => {
		const meds: Medication[] = snap.docs.map((d) => {
			const data = d.data();
			return {
				id: d.id,
				name: data.name,
				concentration: data.concentration,
				alternativeNames: data.alternativeNames ?? [],
				inventoryState: data.inventoryState ?? 'neutral',
				prescriptionState: data.prescriptionState ?? 'neutral',
				picked: data.picked ?? false,
				createdAt: data.createdAt?.toDate() ?? new Date(),
				updatedAt: data.updatedAt?.toDate() ?? new Date()
			};
		});
		callback(meds);
	});
}

export async function addMedication(userId: string, input: MedicationInput): Promise<void> {
	const ref = doc(medicationsRef(userId));
	await setDoc(ref, {
		...input,
		inventoryState: 'neutral',
		prescriptionState: 'neutral',
		picked: false,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});
}

export async function updateMedication(
	userId: string,
	id: string,
	input: MedicationInput
): Promise<void> {
	await updateDoc(doc(medicationsRef(userId), id), {
		...input,
		updatedAt: serverTimestamp()
	});
}

export async function deleteMedication(userId: string, id: string): Promise<void> {
	await deleteDoc(doc(medicationsRef(userId), id));
}

export async function updateTileState(
	userId: string,
	id: string,
	field: 'inventoryState' | 'prescriptionState',
	state: TileState
): Promise<void> {
	await updateDoc(doc(medicationsRef(userId), id), {
		[field]: state,
		updatedAt: serverTimestamp()
	});
}

export async function setPicked(userId: string, id: string, picked: boolean): Promise<void> {
	await updateDoc(doc(medicationsRef(userId), id), {
		picked,
		updatedAt: serverTimestamp()
	});
}

/** Uncheck every medication on the "Plocka" checklist. */
export async function resetPicked(userId: string): Promise<void> {
	const snap = await getDocs(medicationsRef(userId));
	const batch = writeBatch(db);
	snap.docs
		.filter((d) => d.data().picked === true)
		.forEach((d) => {
			batch.update(d.ref, { picked: false, updatedAt: serverTimestamp() });
		});
	await batch.commit();
}

/**
 * Reset one status type (cabinet or prescription) to neutral.
 * With `onlyOut`, only medications marked as out are reset; otherwise every set status is.
 */
export async function resetStates(
	userId: string,
	field: 'inventoryState' | 'prescriptionState',
	onlyOut = false
): Promise<void> {
	const snap = await getDocs(medicationsRef(userId));
	const batch = writeBatch(db);
	snap.docs
		.filter((d) => (onlyOut ? d.data()[field] === 'out' : d.data()[field] !== 'neutral'))
		.forEach((d) => {
			batch.update(d.ref, { [field]: 'neutral', updatedAt: serverTimestamp() });
		});
	await batch.commit();
}

export async function resetAllStates(userId: string): Promise<void> {
	const snap = await getDocs(medicationsRef(userId));
	const batch = writeBatch(db);
	snap.docs.forEach((d) => {
		batch.update(d.ref, {
			inventoryState: 'neutral',
			prescriptionState: 'neutral',
			updatedAt: serverTimestamp()
		});
	});
	await batch.commit();
}

export function nextTileState(current: TileState): TileState {
	if (current === 'neutral') return 'available';
	if (current === 'available') return 'out';
	return 'neutral';
}
