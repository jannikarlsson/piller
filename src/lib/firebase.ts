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

export interface MedicationSettings {
	/** Show on the buy list in "Att göra" when marked as out in the cabinet. */
	remindToBuy: boolean;
	/** Show on the prescription list in "Att göra" when marked as having no prescription. */
	remindPrescription: boolean;
	/** Include on the "Plocka" checklist for the pill organizer. */
	inPillOrganizer: boolean;
}

export const DEFAULT_MEDICATION_SETTINGS: MedicationSettings = {
	remindToBuy: true,
	remindPrescription: true,
	inPillOrganizer: true
};

export interface Medication extends MedicationSettings {
	id: string;
	name: string;
	concentration: string;
	alternativeNames: string[];
	inventoryState: TileState;
	prescriptionState: TileState;
	/** Checked off on the "Plocka" checklist while filling the pill organizer. */
	picked: boolean;
	/** Added to the buy list by hand (for medications without the automatic buy reminder). */
	addedToBuyList: boolean;
	/** Added to the prescription list by hand (without the automatic prescription reminder). */
	addedToPrescriptionList: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface MedicationInput extends MedicationSettings {
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
				addedToBuyList: data.addedToBuyList ?? false,
				addedToPrescriptionList: data.addedToPrescriptionList ?? false,
				// Medications saved before these settings existed get the defaults
				remindToBuy: data.remindToBuy ?? DEFAULT_MEDICATION_SETTINGS.remindToBuy,
				remindPrescription:
					data.remindPrescription ?? DEFAULT_MEDICATION_SETTINGS.remindPrescription,
				inPillOrganizer: data.inPillOrganizer ?? DEFAULT_MEDICATION_SETTINGS.inPillOrganizer,
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
		addedToBuyList: false,
		addedToPrescriptionList: false,
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

// ─── Cabinet and prescription statuses ───────────────────────────────────────

/** The two kinds of status a medication has: in the cabinet, and its prescription. */
export type StatusKind = 'inventory' | 'prescription';

/** Which Medication fields belong to each kind of status. */
const STATUS_FIELDS = {
	inventory: { state: 'inventoryState', addedToTodo: 'addedToBuyList', remind: 'remindToBuy' },
	prescription: {
		state: 'prescriptionState',
		addedToTodo: 'addedToPrescriptionList',
		remind: 'remindPrescription'
	}
} as const satisfies Record<
	StatusKind,
	{ state: keyof Medication; addedToTodo: keyof Medication; remind: keyof Medication }
>;

export function statusOf(med: Medication, kind: StatusKind): TileState {
	return med[STATUS_FIELDS[kind].state];
}

/** Added to the to-do list by hand (for medications without the automatic reminder). */
export function isAddedToTodo(med: Medication, kind: StatusKind): boolean {
	return med[STATUS_FIELDS[kind].addedToTodo];
}

/** Goes to the to-do list by itself when out. */
export function remindsAutomatically(med: Medication, kind: StatusKind): boolean {
	return med[STATUS_FIELDS[kind].remind];
}

/** Belongs on the to-do list: out, and either reminded automatically or added by hand. */
export function needsAction(med: Medication, kind: StatusKind): boolean {
	return (
		statusOf(med, kind) === 'out' && (remindsAutomatically(med, kind) || isAddedToTodo(med, kind))
	);
}

/**
 * Change a status. A manual to-do flag only makes sense while the status is "out",
 * so any other status clears it. Pass `addedToTodo` to set the flag in the same write
 * (used when undoing a ticked to-do item).
 */
export async function updateTileState(
	userId: string,
	id: string,
	kind: StatusKind,
	state: TileState,
	addedToTodo?: boolean
): Promise<void> {
	const fields = STATUS_FIELDS[kind];
	const update: Record<string, unknown> = { [fields.state]: state, updatedAt: serverTimestamp() };
	if (state !== 'out') update[fields.addedToTodo] = false;
	else if (addedToTodo !== undefined) update[fields.addedToTodo] = addedToTodo;
	await updateDoc(doc(medicationsRef(userId), id), update);
}

/** Add a medication to (or remove it from) the to-do list by hand. */
export async function setAddedToTodo(
	userId: string,
	id: string,
	kind: StatusKind,
	added: boolean
): Promise<void> {
	await updateDoc(doc(medicationsRef(userId), id), {
		[STATUS_FIELDS[kind].addedToTodo]: added,
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
	kind: StatusKind,
	onlyOut = false
): Promise<void> {
	const fields = STATUS_FIELDS[kind];
	const snap = await getDocs(medicationsRef(userId));
	const batch = writeBatch(db);
	snap.docs
		.filter((d) => {
			const state = d.data()[fields.state];
			return onlyOut ? state === 'out' : state !== 'neutral';
		})
		.forEach((d) => {
			batch.update(d.ref, {
				[fields.state]: 'neutral',
				[fields.addedToTodo]: false,
				updatedAt: serverTimestamp()
			});
		});
	await batch.commit();
}

export async function resetAllStates(userId: string): Promise<void> {
	const snap = await getDocs(medicationsRef(userId));
	const batch = writeBatch(db);
	snap.docs.forEach((d) => {
		const update: Record<string, unknown> = { updatedAt: serverTimestamp() };
		for (const fields of Object.values(STATUS_FIELDS)) {
			update[fields.state] = 'neutral';
			update[fields.addedToTodo] = false;
		}
		batch.update(d.ref, update);
	});
	await batch.commit();
}

export function nextTileState(current: TileState): TileState {
	if (current === 'neutral') return 'available';
	if (current === 'available') return 'out';
	return 'neutral';
}

// ─── User settings ────────────────────────────────────────────────────────────

export type ThemeSetting = 'system' | 'light' | 'dark';

export interface UserSettings {
	/** `system` follows the phone's light/dark setting. */
	theme: ThemeSetting;
}

/** Used for anything not saved yet, so new settings need no migration. */
export const DEFAULT_SETTINGS: UserSettings = {
	theme: 'system'
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
