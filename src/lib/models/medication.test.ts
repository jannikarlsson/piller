import { describe, expect, it } from 'vitest';
import {
	DEFAULT_MEDICATION_SETTINGS,
	isAddedToTodo,
	needsAction,
	nextStatus,
	remindsAutomatically,
	sortByName,
	statusOf,
	type Medication
} from './medication';

function medication(changes: Partial<Medication> = {}): Medication {
	return {
		id: 'alvedon',
		name: 'Alvedon',
		concentration: '500 mg',
		alternativeNames: [],
		description: '',
		...DEFAULT_MEDICATION_SETTINGS,
		inventoryState: 'neutral',
		prescriptionState: 'neutral',
		picked: false,
		addedToBuyList: false,
		addedToPrescriptionList: false,
		createdAt: new Date(0),
		updatedAt: new Date(0),
		...changes
	};
}

describe('nextStatus', () => {
	it('cycles unknown → at home → out → unknown', () => {
		expect(nextStatus('neutral')).toBe('available');
		expect(nextStatus('available')).toBe('out');
		expect(nextStatus('out')).toBe('neutral');
	});
});

describe('statusOf, remindsAutomatically, isAddedToTodo', () => {
	const med = medication({
		inventoryState: 'out',
		prescriptionState: 'available',
		remindToBuy: false,
		remindPrescription: true,
		addedToBuyList: true,
		addedToPrescriptionList: false
	});

	it('read the cabinet fields for inventory', () => {
		expect(statusOf(med, 'inventory')).toBe('out');
		expect(remindsAutomatically(med, 'inventory')).toBe(false);
		expect(isAddedToTodo(med, 'inventory')).toBe(true);
	});

	it('read the prescription fields for prescription', () => {
		expect(statusOf(med, 'prescription')).toBe('available');
		expect(remindsAutomatically(med, 'prescription')).toBe(true);
		expect(isAddedToTodo(med, 'prescription')).toBe(false);
	});
});

describe('needsAction', () => {
	it('is true when out and reminded automatically', () => {
		expect(needsAction(medication({ inventoryState: 'out' }), 'inventory')).toBe(true);
	});

	it('is false when out without a reminder and not added by hand', () => {
		const med = medication({ inventoryState: 'out', remindToBuy: false });
		expect(needsAction(med, 'inventory')).toBe(false);
	});

	it('is true when out without a reminder but added by hand', () => {
		const med = medication({ inventoryState: 'out', remindToBuy: false, addedToBuyList: true });
		expect(needsAction(med, 'inventory')).toBe(true);
	});

	it('is false when not out, even if reminded or added by hand', () => {
		for (const status of ['neutral', 'available'] as const) {
			const med = medication({ inventoryState: status, addedToBuyList: true });
			expect(needsAction(med, 'inventory')).toBe(false);
		}
	});

	it('keeps cabinet and prescription apart', () => {
		const med = medication({ inventoryState: 'out', prescriptionState: 'available' });
		expect(needsAction(med, 'inventory')).toBe(true);
		expect(needsAction(med, 'prescription')).toBe(false);
	});
});

describe('sortByName', () => {
	const names = (meds: Medication[]) => meds.map((m) => m.name);

	it('sorts A to Z and ignores upper and lower case', () => {
		const meds = [
			medication({ name: 'ipren' }),
			medication({ name: 'Alvedon' }),
			medication({ name: 'Nasonex' })
		];
		expect(names(sortByName(meds))).toEqual(['Alvedon', 'ipren', 'Nasonex']);
	});

	it('puts å, ä and ö after z, as in Swedish', () => {
		const meds = [
			medication({ name: 'Östrogen' }),
			medication({ name: 'Zyrtec' }),
			medication({ name: 'Åtgärd' }),
			medication({ name: 'Älvdroppar' }),
			medication({ name: 'Apodorm' })
		];
		expect(names(sortByName(meds))).toEqual([
			'Apodorm',
			'Zyrtec',
			'Åtgärd',
			'Älvdroppar',
			'Östrogen'
		]);
	});

	it('sorts numbers as numbers', () => {
		const meds = [medication({ name: 'Ipren 10' }), medication({ name: 'Ipren 2' })];
		expect(names(sortByName(meds))).toEqual(['Ipren 2', 'Ipren 10']);
	});

	it('orders the same name by strength, then by who was added first', () => {
		const meds = [
			medication({ id: 'c', name: 'Alvedon', concentration: '500 mg', createdAt: new Date(3) }),
			medication({ id: 'b', name: 'Alvedon', concentration: '500 mg', createdAt: new Date(2) }),
			medication({ id: 'a', name: 'Alvedon', concentration: '250 mg', createdAt: new Date(9) })
		];
		expect(sortByName(meds).map((m) => m.id)).toEqual(['a', 'b', 'c']);
	});

	it('does not change the list it was given', () => {
		const meds = [medication({ name: 'B' }), medication({ name: 'A' })];
		sortByName(meds);
		expect(names(meds)).toEqual(['B', 'A']);
	});
});
