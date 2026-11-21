import { doc, getDocs, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from './app';
import { STATUS_FIELDS, type StatusKind, type Status } from '../models';
import { medicationsRef } from './medications';

/**
 * Change a status. A manual to-do flag only makes sense while the status is "out",
 * so any other status clears it. Pass `addedToTodo` to set the flag in the same write
 * (used when undoing a ticked to-do item).
 */
export async function updateStatus(
	userId: string,
	id: string,
	kind: StatusKind,
	status: Status,
	addedToTodo?: boolean
): Promise<void> {
	const fields = STATUS_FIELDS[kind];
	const update: Record<string, unknown> = { [fields.status]: status, updatedAt: serverTimestamp() };
	if (status !== 'out') update[fields.addedToTodo] = false;
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
export async function resetStatuses(
	userId: string,
	kind: StatusKind,
	onlyOut = false
): Promise<void> {
	const fields = STATUS_FIELDS[kind];
	const snap = await getDocs(medicationsRef(userId));
	const batch = writeBatch(db);
	snap.docs
		.filter((d) => {
			const status = d.data()[fields.status];
			return onlyOut ? status === 'out' : status !== 'neutral';
		})
		.forEach((d) => {
			batch.update(d.ref, {
				[fields.status]: 'neutral',
				[fields.addedToTodo]: false,
				updatedAt: serverTimestamp()
			});
		});
	await batch.commit();
}

export async function resetAllStatuses(userId: string): Promise<void> {
	const snap = await getDocs(medicationsRef(userId));
	const batch = writeBatch(db);
	snap.docs.forEach((d) => {
		const update: Record<string, unknown> = { updatedAt: serverTimestamp() };
		for (const fields of Object.values(STATUS_FIELDS)) {
			update[fields.status] = 'neutral';
			update[fields.addedToTodo] = false;
		}
		batch.update(d.ref, update);
	});
	await batch.commit();
}
