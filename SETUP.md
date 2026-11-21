# Piller – Setup and development guide

This guide takes you from nothing to your own copy of Piller running on your phone, and then explains how the code is organised. The app itself is described in the [README](README.md).

Steps marked **YOU** need you to do something in a browser or terminal.

**Contents**

1. [Requirements](#requirements)
2. [Set up Firebase](#set-up-firebase)
3. [Run it locally](#run-it-locally)
4. [Deploy](#deploy)
5. [Day to day](#day-to-day)
6. [How the code is organised](#how-the-code-is-organised)

---

## Requirements

- **Node.js 22.17 or newer** (the automatic checks use Node 24) and npm
- **A Google account** and a Firebase project. The free Spark plan is enough.
- **The Firebase CLI**, installed in step 6 below
- **The GitHub CLI (`gh`)**, only if you want automatic deploys

---

## Set up Firebase

### 1. Create a Firebase project

**YOU:** Go to https://console.firebase.google.com and click **Add project**.

- Project name: `piller-app` (or whatever you like)
- Disable Google Analytics (not needed)
- Click **Create project**

### 2. Enable Google Authentication

**YOU:** In the Firebase console:

1. Click **Authentication** in the left sidebar
2. Click **Get started**
3. Click **Google** under Sign-in providers
4. Toggle it **Enabled**
5. Enter a support email (your own email)
6. Click **Save**

### 3. Create a Firestore database

**YOU:** In the Firebase console:

1. Click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (rules are already written)
4. Select a region close to you (e.g. `europe-west1` for Sweden)
5. Click **Enable**

### 4. Get your Firebase config

**YOU:** In the Firebase console:

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **Project settings**
3. Scroll down to **Your apps** and click the **</>** (web) icon
4. Register the app with nickname `piller-web`
5. Copy the `firebaseConfig` object shown

**YOU:** Copy `.env.example` to `.env` in the project folder and fill in the values from that object:

```
PUBLIC_FIREBASE_API_KEY=AIza...
PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your-project-id
PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=1:123...:web:abc...
```

`.env` is not committed. These values aren't secret (they're built into the app), but keeping them out of the repository means anyone can clone it and use their own Firebase project.

### 5. Point the project at your Firebase project

**YOU:** Open `.firebaserc` and replace the project ID with yours (the same string as `PUBLIC_FIREBASE_PROJECT_ID` above).

### 6. Install the Firebase CLI and log in

```bash
npm install -g firebase-tools
firebase login
```

**YOU:** A browser window will open. Log in with the same Google account you used for the Firebase project.

### 7. Allow yourself to sign in

Only people listed in the `allowedUsers` collection can use the app. Add yourself **before** deploying the rules in the next step, or you'll be locked out.

**YOU:** In the Firebase console → **Firestore Database** → **Start collection**:

1. Collection ID: `allowedUsers`
2. Document ID: your email address in lowercase, e.g. `you@example.com`
3. Add any field (e.g. `name` = your name) and save

Add one document like this for each person who should have access.

### 8. Deploy the Firestore security rules

```bash
firebase deploy --only firestore:rules
```

This locks down the database: only people in `allowedUsers` can use it, and each person can only reach their own data.

---

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 and sign in with your Google account.

These commands are available:

```bash
npm run dev      # start the dev server
npm run check    # type-check
npm test         # run the unit tests (Vitest)
npm run lint     # check formatting (Prettier) and code (ESLint)
npm run format   # format all files with Prettier
npm run build    # build the production app into build/
```

A Git hook (Husky and lint-staged) formats and lints the files in each commit, and stops the commit if ESLint finds an error. `npm install` sets it up. In an emergency, `git commit --no-verify` skips it, but CI runs the same checks on everything.

---

## Deploy

### The first deploy

```bash
npm run build
firebase deploy --only hosting
```

**YOU:** Firebase will print a URL like `https://your-project.web.app`. Open it on your phone and install it as an app:

- **iPhone**: tap the Share button → "Add to Home Screen"
- **Android**: tap the browser menu → "Install app" (or a banner will appear)

### Restrict your API key (recommended)

The Firebase API key in the app isn't a secret, but you can make it useless on other websites.

**YOU:** In the Google Cloud console (https://console.cloud.google.com/apis/credentials, with your project selected), open the key matching `PUBLIC_FIREBASE_API_KEY`:

1. Under **Application restrictions**, choose **Websites** and add `https://your-project.web.app/*`, `https://your-project.firebaseapp.com/*` and `http://localhost:5173/*`. The `firebaseapp.com` address is needed for Google sign-in.
2. Under **API restrictions**, choose **Restrict key** and select **Identity Toolkit API**, **Token Service API** and **Cloud Firestore API**.
3. Save. It can take a few minutes to apply.

### Ongoing deploys

Whenever you make changes:

```bash
npm run deploy
```

This builds the app and deploys it to Firebase Hosting. If you change `firestore.rules`, deploy those with `npm run deploy:rules`. Without it, saving to a new collection fails.

### Automatic deploys (optional)

The workflow in `.github/workflows/ci.yml` runs the lint, type check, tests and build on every push and pull request. On pushes to `main` it can also publish the app to Firebase Hosting, once those checks have passed. The deploy needs a one-time setup, and until it's done the deploy step fails (the checks still run). Firestore rules are never deployed automatically.

**YOU:** In this folder, with the GitHub CLI (`gh`) logged in:

1. **Let GitHub deploy to your Firebase project.** Run:

   ```bash
   firebase init hosting:github
   ```

   It creates a limited service account for deploying and saves its key in the repository's secrets, under a name like `FIREBASE_SERVICE_ACCOUNT_PILLER_A4F31` (the command prints the name; if it differs, change it in `ci.yml`). Answer **No** when it offers to set up its own build script or workflows, as `ci.yml` already does that.

2. **Save your Firebase settings as repository variables**, so the build in GitHub uses the same values as your `.env`:

   ```bash
   gh variable set --env-file .env
   ```

After that, a push to `main` runs the checks and then deploys. You can also run the workflow by hand from the **Actions** tab. To stop automatic deploys, delete the `deploy` job from `ci.yml`.

---

## Day to day

**Adding or removing users.** Add a document to the `allowedUsers` collection in the Firebase console, with the person's email address in lowercase as the document ID. It works straight away, with no redeploy. To remove someone, delete their document.

**Starting over with the statuses.** In the app, go to **Profile** → **Reset all statuses**. Every cabinet and prescription status goes back to unknown, and the medication list stays.

**Changing the app icon.** The icon is in `static/`: `icon.svg`, `192.png` and `512.png` (used when installing the app) and `apple-touch-icon.png` (the iPhone home screen).

---

## How the code is organised

### The folders

- `src/routes/` – one folder per page. Components used by only one page can sit next to it.
- `src/lib/pages/` – page content shared by several routes (Cabinet and Prescriptions use the same page).
- `src/lib/components/`
  - `ui/` – generic building blocks (button, card, drawer, list rows, icons, …). Nothing here knows about medications.
  - `inputs/` – controls that hold a value the user changes: checkbox, switch, radio group, text field
  - `medication/` – pieces that show a medication (its name and details, the tappable status row)
  - `dialogs/` – content shown inside a drawer (confirm, reset, the medication form). The page does the saving.
  - `layout/` – page frame, page header, bottom menu and the start screen
- `src/lib/models/` – the types (medication, settings) and the rules about them, e.g. when a medication belongs on the to-do list. No Firebase here, so any component can use it.
- `src/lib/navigation.ts` – the bottom menu's links, which feature each belongs to, and the start page
- `src/lib/firebase/` – sign-in and all Firestore reads and writes, split into `auth`, `medications`, `statuses` and `settings`. Import everything from `#lib/firebase/index.ts`.
- `src/lib/stores/` – shared state: user, medications, settings, toast messages
- `src/lib/i18n/` – UI text. `sv.ts` defines the texts, `en.ts` must have the same shape.
- `src/lib/styles/`
  - `theme.css` – colours, shadow and backdrop for light and dark mode
  - `tokens.css` – text sizes, spacing, radii, sizes and stacking order
  - `base.css` – reset, base styles and the global `.text-*` classes
- `docs/screenshots/` – the images used in the README
- `.github/workflows/ci.yml` – the checks and the automatic deploy

Imports use `#lib/…` (a Node subpath import defined in `package.json`) for everything under `src/lib/`.

### The data in Firestore

| Path                               | What it holds                                                                                                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedUsers/{email}`             | One document per person who may use the app. The email address, in lowercase, is the document ID.                                                                                                 |
| `users/{uid}/medications/{id}`     | A medication: `name`, `concentration`, `alternativeNames`, `description`, the two statuses (`inventoryState`, `prescriptionState`), its reminder settings, `inPillOrganizer`, `picked`, and more. |
| `users/{uid}/settings/preferences` | The user's settings: theme, language, which features are on, what the Reset button does.                                                                                                          |

`firestore.rules` allows access only to signed-in users with a verified email on the access list, and only to their own `users/{uid}` data. The types for all of this are in `src/lib/models/`.

### Conventions

- **Colours, sizes and spacing come from the tokens** in `src/lib/styles/`, never as literal values in a component. Changing the look of the whole app means changing a token.
- **Text lives in `src/lib/i18n/`.** Add a text to `sv.ts` first, then give `en.ts` the same shape. The type checker complains if they differ.
- **Rules about medications live in `src/lib/models/`**, with unit tests next to them (`*.test.ts`).
- **Pages do the saving.** Dialogs and forms only collect input and call back, so they can be reused.
