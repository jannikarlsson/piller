# Piller

A small home-medicine-cabinet app, installable on a phone as a PWA. Built with SvelteKit and Firebase, with a Swedish UI.

## What it does

- **Skåpet** – mark each medication as at home or out.
- **Recept** – mark whether there is an active prescription.
- **Plocka** – a checklist for filling the pill organizer.
- **Att göra** – what needs to be bought or renewed, built from the statuses above.
- **Läkemedel** – add, edit and remove medications, and choose per medication whether it gets automatic reminders and is part of the pill organizer.

## Development

```sh
npm install
npm run dev      # start the dev server
npm run check    # type-check
```

## Deploy

```sh
npm run deploy        # build and deploy to Firebase Hosting
npm run deploy:rules  # deploy firestore.rules (only when they change)
```

First-time setup (Firebase project, sign-in, allowed users) is described in [SETUP.md](SETUP.md).

## Where things live

- `src/routes/` – one folder per page
- `src/lib/components/` – shared UI (drawer, list card, icons, …)
- `src/lib/firebase.ts` – auth and all Firestore reads/writes
- `src/lib/i18n/sv.ts` – all Swedish UI text
- `src/routes/+layout.svelte` – colors, spacing and fonts as CSS variables
