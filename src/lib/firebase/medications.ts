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
import { db } from './app';

export type TileState = 'neutral' | 'available' | 'out';

export interface MedicationSettings {
	remindToBuy: boolean;
	remindPrescription: boolean;
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

export function medicationsRef(userId: string) {
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
