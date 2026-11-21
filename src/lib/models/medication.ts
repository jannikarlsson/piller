export type Status = 'neutral' | 'available' | 'out';

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
	inventoryState: Status;
	prescriptionState: Status;
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

/** The two kinds of status a medication has: in the cabinet, and its prescription. */
export type StatusKind = 'inventory' | 'prescription';

export const STATUS_FIELDS = {
	inventory: { status: 'inventoryState', addedToTodo: 'addedToBuyList', remind: 'remindToBuy' },
	prescription: {
		status: 'prescriptionState',
		addedToTodo: 'addedToPrescriptionList',
		remind: 'remindPrescription'
	}
} as const satisfies Record<
	StatusKind,
	{ status: keyof Medication; addedToTodo: keyof Medication; remind: keyof Medication }
>;

export function statusOf(med: Medication, kind: StatusKind): Status {
	return med[STATUS_FIELDS[kind].status];
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

export function nextStatus(current: Status): Status {
	if (current === 'neutral') return 'available';
	if (current === 'available') return 'out';
	return 'neutral';
}
