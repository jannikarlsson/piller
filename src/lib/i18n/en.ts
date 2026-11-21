import type { Translations } from './sv';

/** English. Must have exactly the same texts as sv.ts (TypeScript checks this). */
export const en: Translations = {
	app: {
		name: 'Piller'
	},

	nav: {
		inventory: 'Cabinet',
		prescription: 'Prescriptions',
		picking: 'Organizer',
		actions: 'To do',
		profile: 'Profile'
	},

	login: {
		illustrationLabel: 'Illustration of a medicine cabinet',
		subtitle: 'Sign in to manage your medicine cabinet',
		button: 'Sign in with Google',
		loading: 'Signing in...',
		errorNotAllowed: 'This email address is not allowed to use Piller.',
		errorGeneral: 'Something went wrong. Please try again.'
	},

	common: {
		loading: 'Loading…',
		close: 'Close',
		cancel: 'Cancel',
		edit: 'Edit',
		add: 'Add',
		mainMenu: 'Main menu',
		noMedications: 'No medications added yet.',
		addMedication: 'Add medication'
	},

	inventory: {
		title: 'Cabinet',
		subtitle: 'What do you have at home?',
		resetButton: 'Reset',
		resetLabel: 'Reset cabinet statuses'
	},

	prescription: {
		title: 'Prescriptions',
		subtitle: 'Active prescriptions',
		resetButton: 'Reset',
		resetLabel: 'Reset prescription statuses'
	},

	picking: {
		title: 'Pill organizer',
		subtitle: 'Fill your pill organizer',
		progress: (done: number, total: number) => `${done} of ${total} picked`,
		emptyNoneInOrganizer:
			'No medications are part of your pill organizer. You can change that under Medications.',
		emptyNoneInOrganizerAction: 'Go to Medications',
		allDone: 'All picked',
		resetButton: 'Reset',
		resetLabel: 'Uncheck all'
	},

	actions: {
		title: 'To do',
		subtitle: 'What needs sorting out?',
		buyHeading: 'Buy',
		prescriptionHeading: 'Get a prescription',
		allGood: 'All good',
		allGoodSub: 'Nothing needs buying or renewing right now.'
	},

	todoPrompt: {
		title: {
			inventory: 'Add to shopping list?',
			prescription: 'Remind about prescription?'
		},
		text: {
			inventory: (name: string) => `${name} has run out. Add it under Buy in To do?`,
			prescription: (name: string) =>
				`${name} has no prescription. Add it under Get a prescription in To do?`
		},
		confirm: 'Add',
		decline: 'No thanks'
	},

	reset: {
		title: {
			inventory: 'Reset cabinet',
			prescription: 'Reset prescriptions'
		},
		intro: {
			inventory: 'Choose which cabinet statuses to set back to unknown. Prescriptions are not affected.',
			prescription:
				'Choose which prescription statuses to set back to unknown. The cabinet is not affected.'
		},
		scopeLegend: 'What should be reset?',
		optionOut: {
			inventory: 'Only those that ran out',
			prescription: 'Only those without a prescription'
		},
		optionAll: 'All statuses',
		count: (n: number) => (n === 1 ? '1 medication' : `${n} medications`),
		confirm: 'Reset'
	},

	medications: {
		title: 'Medications',
		subtitle: 'Manage your list',
		editTitle: 'Edit medication',
		addTitle: 'New medication',
		nameLabel: 'Name',
		namePlaceholder: 'E.g. Ibuprofen',
		concentrationLabel: 'Strength / pack',
		concentrationPlaceholder: 'E.g. 400 mg, 20 tablets',
		alternativeNamesLabel: 'Other names',
		alternativeNamesPlaceholder: 'Comma-separated, e.g. Advil, Nurofen',
		settingsLegend: 'Reminders and pill organizer',
		settingsLegendReminders: 'Reminders',
		remindToBuyLabel: 'Add to shopping list when it runs out',
		remindPrescriptionLabel: 'Remind me when the prescription runs out',
		inPillOrganizerLabel: 'Part of the pill organizer',
		saveButton: 'Save',
		deleteButton: 'Delete medication',
		deleteTitle: 'Delete medication?',
		deleteConfirm: (name: string) => `${name} will be removed from all lists. This can't be undone.`,
		deleteConfirmButton: 'Delete'
	},

	statuses: {
		inventory: { available: 'At home', out: 'Out' },
		prescription: { available: 'Active', out: 'None' }
	},

	profile: {
		title: 'Profile',
		medications: 'Medications',
		appearanceHeading: 'Appearance',
		theme: 'Theme',
		themeOptions: {
			light: 'Light',
			dark: 'Dark',
			system: 'System'
		},
		themeSystemDescription: "Follows your phone's setting",
		language: 'Language',
		languageSystem: 'System',
		languageSystemDescription: "Follows your phone's language",
		featuresHeading: 'Features',
		featurePrescriptions: 'Prescriptions',
		featurePrescriptionsDescription: 'Keep track of which medications have a prescription',
		featurePillOrganizer: 'Pill organizer',
		featurePillOrganizerDescription: 'Checklist for filling your pill organizer',
		dataHeading: 'Data',
		accountHeading: 'Account',
		resetAll: 'Reset all statuses',
		resetAllTitle: 'Reset all statuses?',
		resetAllConfirm:
			'All cabinet and prescription statuses go back to unknown. Your medications are kept.',
		resetAllConfirmButton: 'Reset',
		resetAllSuccess: 'All statuses reset',
		logout: 'Sign out',
		logoutTitle: 'Sign out?',
		logoutConfirm: 'You can sign in again any time with the same Google account.',
		logoutConfirmButton: 'Sign out'
	},

	errors: {
		saveFailed: "Couldn't save. Please try again.",
		deleteFailed: "Couldn't delete. Please try again.",
		updateFailed: "Couldn't update the status.",
		resetFailed: "Couldn't reset. Please try again.",
		logoutFailed: "Couldn't sign out. Please try again.",
		settingsFailed: "Couldn't save the setting. Please try again."
	}
};
