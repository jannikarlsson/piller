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
	description: string;
	inventoryState: Status;
	prescriptionState: Status;
	picked: boolean;
	addedToBuyList: boolean;
	addedToPrescriptionList: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface MedicationInput extends MedicationSettings {
	name: string;
	concentration: string;
	alternativeNames: string[];
	description: string;
}

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

const nameCollator = new Intl.Collator('sv', { sensitivity: 'base', numeric: true });

export function sortByName<T extends Pick<Medication, 'name' | 'concentration' | 'createdAt'>>(
	medications: T[]
): T[] {
	return [...medications].sort(
		(a, b) =>
			nameCollator.compare(a.name, b.name) ||
			nameCollator.compare(a.concentration, b.concentration) ||
			a.createdAt.getTime() - b.createdAt.getTime()
	);
}
