import {
	collection,
	doc,
	setDoc,
	updateDoc,
	deleteDoc,
	serverTimestamp,
	onSnapshot,
	query,
	orderBy
} from 'firebase/firestore';
import { DEFAULT_MEDICATION_SETTINGS, type Medication, type MedicationInput } from '../models';
import { db, currentUid, save } from './app';

export function medicationsRef(userId = currentUid()) {
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
				description: data.description ?? '',
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

export async function addMedication(input: MedicationInput): Promise<void> {
	const ref = doc(medicationsRef());
	await save(
		setDoc(ref, {
			...input,
			inventoryState: 'neutral',
			prescriptionState: 'neutral',
			picked: false,
			addedToBuyList: false,
			addedToPrescriptionList: false,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		})
	);
}

export async function updateMedication(id: string, input: MedicationInput): Promise<void> {
	await save(
		updateDoc(doc(medicationsRef(), id), {
			...input,
			updatedAt: serverTimestamp()
		})
	);
}

export async function deleteMedication(id: string): Promise<void> {
	await save(deleteDoc(doc(medicationsRef(), id)));
}
