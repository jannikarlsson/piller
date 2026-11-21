/** Swedish. This file defines which texts exist; other languages must match its shape. */
export const sv = {
	app: {
		name: 'Piller'
	},

	nav: {
		inventory: 'Skåpet',
		prescription: 'Recept',
		picking: 'Plocka',
		actions: 'Att göra',
		profile: 'Profil'
	},

	login: {
		illustrationLabel: 'Illustration av ett medicinskåp',
		subtitle: 'Logga in för att hantera ditt läkemedelsförråd',
		button: 'Logga in med Google',
		loading: 'Loggar in...',
		errorNotAllowed: 'Den här e-postadressen är inte behörig att använda Piller.',
		errorGeneral: 'Något gick fel. Försök igen.'
	},

	common: {
		loading: 'Laddar…',
		close: 'Stäng',
		cancel: 'Avbryt',
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
		resetLabel: 'Återställ statusar i skåpet'
	},

	prescription: {
		title: 'Recept',
		subtitle: 'Aktiva recept',
		empty: 'Inga läkemedel tillagda än.',
		emptyAction: 'Lägg till läkemedel',
		resetButton: 'Återställ',
		resetLabel: 'Återställ receptstatusar'
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

	// Text that differs between the cabinet and prescriptions is grouped by status kind
	todoPrompt: {
		title: {
			inventory: 'Lägg på inköpslistan?',
			prescription: 'Påminn om recept?'
		},
		text: {
			inventory: (name: string) => `${name} är slut. Vill du lägga till den under Köp i Att göra?`,
			prescription: (name: string) =>
				`${name} saknar recept. Vill du lägga till den under Skaffa recept i Att göra?`
		},
		confirm: 'Lägg till',
		decline: 'Nej tack'
	},

	reset: {
		title: {
			inventory: 'Återställ skåpet',
			prescription: 'Återställ recept'
		},
		intro: {
			inventory: 'Välj vilka statusar i skåpet som ska bli okända igen. Recepten påverkas inte.',
			prescription: 'Välj vilka receptstatusar som ska bli okända igen. Skåpet påverkas inte.'
		},
		scopeLegend: 'Vad ska återställas?',
		optionOut: {
			inventory: 'Bara de som är slut',
			prescription: 'Bara de utan recept'
		},
		optionAll: 'Alla statusar',
		count: (n: number) => `${n} läkemedel`,
		confirm: 'Återställ'
	},

	medications: {
		title: 'Läkemedel',
		subtitle: 'Hantera din lista',
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
		settingsLegendReminders: 'Påminnelser',
		remindToBuyLabel: 'Lägg på inköpslistan när det är slut',
		remindPrescriptionLabel: 'Påminn om nytt recept när det saknas',
		inPillOrganizerLabel: 'Ingår i dosetten',
		saveButton: 'Spara',
		deleteButton: 'Ta bort läkemedel',
		deleteTitle: 'Ta bort läkemedel?',
		deleteConfirm: (name: string) =>
			`${name} tas bort från alla listor. Det går inte att ångra.`,
		deleteConfirmButton: 'Ta bort'
	},

	tileStates: {
		inventory: { available: 'Hemma', out: 'Slut' },
		prescription: { available: 'Aktivt', out: 'Inget recept' }
	},

	profile: {
		title: 'Profil',
		medications: 'Läkemedel',
		appearanceHeading: 'Utseende',
		theme: 'Tema',
		themeOptions: {
			light: 'Ljust',
			dark: 'Mörkt',
			system: 'System'
		},
		themeSystemDescription: 'Följer telefonens inställning',
		language: 'Språk',
		languageSystem: 'System',
		languageSystemDescription: 'Följer telefonens språk',
		featuresHeading: 'Funktioner',
		featurePrescriptions: 'Recept',
		featurePrescriptionsDescription: 'Håll koll på vilka läkemedel som har recept',
		featurePillOrganizer: 'Dosett',
		featurePillOrganizerDescription: 'Checklista för att fylla dosetten',
		dataHeading: 'Data',
		accountHeading: 'Konto',
		resetAll: 'Återställ alla statusar',
		resetAllTitle: 'Återställ alla statusar?',
		resetAllConfirm:
			'Alla statusar i skåpet och för recepten blir okända igen. Dina läkemedel finns kvar.',
		resetAllConfirmButton: 'Återställ',
		resetAllSuccess: 'Alla statusar återställda',
		logout: 'Logga ut',
		logoutTitle: 'Logga ut?',
		logoutConfirm: 'Du kan logga in igen när som helst med samma Google-konto.',
		logoutConfirmButton: 'Logga ut'
	},

	errors: {
		saveFailed: 'Kunde inte spara. Försök igen.',
		deleteFailed: 'Kunde inte ta bort. Försök igen.',
		updateFailed: 'Kunde inte uppdatera status.',
		resetFailed: 'Kunde inte återställa. Försök igen.',
		logoutFailed: 'Kunde inte logga ut. Försök igen.',
		settingsFailed: 'Kunde inte spara inställningen. Försök igen.'
	}
} as const;

/** Same shape as `sv`, but any wording: strings become `string`, functions keep their parameters. */
type Widen<T> = T extends string
	? string
	: T extends (...args: infer A) => infer R
		? (...args: A) => Widen<R>
		: { readonly [K in keyof T]: Widen<T[K]> };

export type Translations = Widen<typeof sv>;
