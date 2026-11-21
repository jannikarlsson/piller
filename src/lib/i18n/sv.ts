export const t = {
	app: {
		name: 'Piller',
		tagline: 'Ditt apoteksskåp, ordnat'
	},

	nav: {
		inventory: 'Skåpet',
		prescription: 'Recept',
		picking: 'Plocka',
		actions: 'Att göra',
		medications: 'Läkemedel'
	},

	login: {
		title: 'Välkommen till Piller',
		subtitle: 'Logga in för att hantera ditt läkemedelsförråd',
		button: 'Logga in med Google',
		loading: 'Loggar in...',
		errorNotAllowed: 'Den här e-postadressen är inte behörig att använda Piller.',
		errorGeneral: 'Något gick fel. Försök igen.'
	},

	common: {
		loading: 'Laddar…',
		settings: 'Inställningar',
		close: 'Stäng',
		undo: 'Ångra',
		edit: 'Redigera',
		add: 'Lägg till',
		mainMenu: 'Huvudmeny'
	},

	inventory: {
		title: 'Skåpet',
		subtitle: 'Vad finns hemma?',
		empty: 'Inga läkemedel tillagda än.',
		emptyAction: 'Lägg till läkemedel',
		resetButton: 'Återställ',
		resetLabel: 'Återställ statusar i skåpet',
	},

	prescription: {
		title: 'Recept',
		subtitle: 'Aktiva recept',
		empty: 'Inga läkemedel tillagda än.',
		emptyAction: 'Lägg till läkemedel',
		resetButton: 'Återställ',
		resetLabel: 'Återställ receptstatusar',
	},

	picking: {
		title: 'Plocka',
		subtitle: 'Fyll dosetten',
		empty: 'Inga läkemedel tillagda än.',
		emptyAction: 'Lägg till läkemedel',
		progress: (done: number, total: number) => `${done} av ${total} plockade`,
		emptyNoneInOrganizer: 'Inga läkemedel ingår i dosetten. Du kan ändra det under Läkemedel.',
		emptyNoneInOrganizerAction: 'Gå till Läkemedel',
		allDone: 'Allt plockat',
		resetButton: 'Återställ',
		resetLabel: 'Avmarkera alla'
	},

	actions: {
		title: 'Att göra',
		subtitle: 'Vad behöver fixas?',
		buyHeading: 'Köp',
		prescriptionHeading: 'Skaffa recept',
		allGood: 'Allt är i ordning',
		allGoodSub: 'Ingenting behöver köpas eller förnyas just nu.'
	},

	reset: {
		inventoryTitle: 'Återställ skåpet',
		prescriptionTitle: 'Återställ recept',
		inventoryIntro: 'Välj vilka statusar i skåpet som ska bli okända igen. Recepten påverkas inte.',
		prescriptionIntro: 'Välj vilka receptstatusar som ska bli okända igen. Skåpet påverkas inte.',
		scopeLegend: 'Vad ska återställas?',
		optionOutInventory: 'Bara de som är slut',
		optionOutPrescription: 'Bara de utan recept',
		optionAll: 'Alla statusar',
		count: (n: number) => `${n} läkemedel`,
		confirm: 'Återställ',
		cancel: 'Avbryt'
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
		alternativeNamesPlaceholder: 'Kommaseparerade, t.ex. Paracetamol, Panodil',
		settingsLegend: 'Påminnelser och dosett',
		remindToBuyLabel: 'Lägg på inköpslistan när det är slut',
		remindPrescriptionLabel: 'Påminn om nytt recept när det saknas',
		inPillOrganizerLabel: 'Ingår i dosetten',
		saveButton: 'Spara',
		cancelButton: 'Avbryt',
		deleteButton: 'Ta bort läkemedel',
		deleteTitle: 'Ta bort läkemedel?',
		deleteConfirm: (name: string) =>
			`${name} tas bort från alla listor. Det går inte att ångra.`,
		deleteConfirmButton: 'Ta bort',
		deleteBack: 'Avbryt'
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
		updateFailed: 'Kunde inte uppdatera status.',
		resetFailed: 'Kunde inte återställa. Försök igen.'
	}
} as const;

export type Translations = typeof t;
