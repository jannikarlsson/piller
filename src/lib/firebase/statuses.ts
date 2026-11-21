import { doc, getDocs, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from './app';
import { medicationsRef, type Medication, type TileState } from './medications';

/** The two kinds of status a medication has: in the cabinet, and its prescription. */
export type StatusKind = 'inventory' | 'prescription';

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

export function isAddedToTodo(med: Medication, kind: StatusKind): boolean {
	return med[STATUS_FIELDS[kind].addedToTodo];
}

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
