export const t = {
	app: {
		name: 'Piller',
		tagline: 'Ditt apoteksskåp, ordnat'
	},

	nav: {
		inventory: 'Skåpet',
		prescription: 'Recept',
		actions: 'Att göra',
		medications: 'Läkemedel'
	},

	login: {
		title: 'Välkommen till Piller!',
		subtitle: 'Logga in för att hantera ditt läkemedelsförråd',
		button: 'Logga in med Google',
		loading: 'Loggar in...',
		errorNotAllowed: 'Den här e-postadressen är inte behörig att använda Piller.',
		errorGeneral: 'Något gick fel. Försök igen.'
	},

	inventory: {
		title: 'Skåpet',
		subtitle: 'Vad finns hemma?',
		empty: 'Inga läkemedel tillagda än.',
		emptyAction: 'Lägg till läkemedel'
	},

	prescription: {
		title: 'Recept',
		subtitle: 'Aktiva recept?',
		empty: 'Inga läkemedel tillagda än.',
		emptyAction: 'Lägg till läkemedel'
	},

	actions: {
		title: 'Att göra',
		subtitle: 'Vad behöver fixas?',
		buyHeading: '🛒 Köp',
		prescriptionHeading: '📋 Skaffa recept',
		allGood: 'Allt är i ordning! 🎉',
		allGoodSub: 'Ingenting behöver köpas eller förnyas just nu.'
	},

	medications: {
		title: 'Läkemedel',
		subtitle: 'Hantera din lista',
		addButton: 'Lägg till läkemedel',
		empty: 'Inga läkemedel tillagda.',
		editTitle: 'Redigera läkemedel',
		addTitle: 'Nytt läkemedel',
		nameLabel: 'Namn',
		namePlaceholder: 'T.ex. Alvedon',
		concentrationLabel: 'Styrka / förpackning',
		concentrationPlaceholder: 'T.ex. 500 mg, 20 tabletter',
		alternativeNamesLabel: 'Alternativa namn',
		alternativeNamesPlaceholder: 'T.ex. Paracetamol, Panodil (kommaseparerat)',
		saveButton: 'Spara',
		cancelButton: 'Avbryt',
		deleteButton: 'Ta bort',
		deleteConfirm: 'Är du säker på att du vill ta bort detta läkemedel?'
	},

	tileStates: {
		neutral: 'Okänd',
		inventoryAvailable: 'Finns hemma',
		inventoryOut: 'Slut hemma',
		prescriptionActive: 'Aktivt recept',
		prescriptionOut: 'Inget recept'
	},

	settings: {
		title: 'Inställningar',
		resetTitle: 'Återställ statusar',
		resetDescription: 'Återställer alla läkemedels status till okänd. Listan bevaras.',
		resetButton: 'Återställ allt',
		resetConfirm: 'Är du säker? Alla statusar återställs till okänd.',
		resetSuccess: 'Alla statusar återställda!',
		logoutButton: 'Logga ut',
		logoutConfirm: 'Vill du logga ut?'
	},

	errors: {
		loadFailed: 'Kunde inte ladda läkemedel.',
		saveFailed: 'Kunde inte spara. Försök igen.',
		deleteFailed: 'Kunde inte ta bort. Försök igen.',
		updateFailed: 'Kunde inte uppdatera status.'
	}
} as const;

export type Translations = typeof t;
