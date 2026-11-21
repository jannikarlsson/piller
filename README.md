# Piller

A small home-medicine-cabinet app, installable on a phone as a PWA. Built with SvelteKit and Firebase, in Swedish and English.

## What it does

- **Cabinet** – mark each medication as at home or out.
- **Prescriptions** – mark whether there is an active prescription.
- **Pill organizer** – a checklist for filling the pill organizer.
- **To do** – what needs to be bought or renewed, built from the statuses above. Ticking an item resets its status.
- **Profile** – settings and account:
  - **Medications** – add, edit and remove medications, and choose per medication whether it gets automatic reminders and is part of the pill organizer.
  - **Appearance** – theme (system, light, dark) and language (system, Swedish, English).
  - **Features** – switch off Prescriptions or Pill organizer if you don't use them.
  - Reset all statuses, and sign out.

Settings are saved per user in Firestore and also kept in the browser, so the theme and language apply before the page renders.

The app can be installed on a phone and opens without a connection. A service worker (set up with `@vite-pwa/sveltekit` in `vite.config.ts`) keeps the app's files, and Firestore keeps the last known lists. Changes made offline are sent when the connection is back. After a new deploy, the app updates itself on the next visit and reloads once.

## Development

```sh
npm install
npm run dev      # start the dev server
npm run check    # type-check
npm test         # run the unit tests (Vitest)
npm run lint     # check formatting (Prettier) and code (ESLint)
npm run format   # format all files with Prettier
```

The service worker is only registered in production builds. `npm run preview` can't test it, because it doesn't serve `index.html` the way Firebase Hosting does (the worker fails to install). To try offline mode, serve the `build/` folder from a server that behaves like Firebase Hosting, or deploy.

## Deploy

```sh
npm run deploy        # build and deploy to Firebase Hosting
npm run deploy:rules  # deploy firestore.rules
```

Run `deploy:rules` whenever `firestore.rules` changes, for example when a new Firestore collection is added. Without it, saving to that collection fails.

First-time setup (Firebase project, sign-in, allowed users) is described in [SETUP.md](SETUP.md).

## Where things live

- `src/routes/` – one folder per page. Components used by only one page can sit next to it.
- `src/lib/pages/` – page content shared by several routes (Cabinet and Prescriptions use the same page).
- `src/lib/components/`
  - `ui/` – generic building blocks (button, card, drawer, list rows, icons, …). Nothing here knows about medications.
  - `inputs/` – controls that hold a value the user changes: checkbox, switch, radio group, text field
  - `medication/` – pieces that show a medication (its name and details, the tappable status row)
  - `dialogs/` – content shown inside a drawer (confirm, reset, the medication form). The page does the saving.
  - `layout/` – page frame, page header and bottom menu
- `src/lib/models/` – the types (medication, settings) and the rules about them, e.g. when a medication belongs on the to-do list. No Firebase here, so any component can use it.
- `src/lib/navigation.ts` – the bottom menu's links, which feature each belongs to, and the start page
- `src/lib/firebase/` – sign-in and all Firestore reads and writes, split into `auth`, `medications`, `statuses` and `settings`. Import everything from `#lib/firebase/index.ts`.
- `src/lib/stores/` – shared state: user, medications, settings, toast messages
- `src/lib/i18n/` – UI text. `sv.ts` defines the texts, `en.ts` must have the same shape.
- `src/lib/styles/`
  - `theme.css` – colours, shadow and backdrop for light and dark mode
  - `tokens.css` – text sizes, spacing, radii, sizes and stacking order
  - `base.css` – reset, base styles and the global `.text-*` classes
