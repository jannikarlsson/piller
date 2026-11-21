# Piller – Setup Guide

Follow these steps in order. Steps marked **YOU** require manual action in a browser or terminal.

---

## 1. Create a Firebase project

**YOU:** Go to https://console.firebase.google.com and click **Add project**.

- Project name: `piller-app` (or whatever you like)
- Disable Google Analytics (not needed)
- Click **Create project**

---

## 2. Enable Google Authentication

**YOU:** In the Firebase console:

1. Click **Authentication** in the left sidebar
2. Click **Get started**
3. Click **Google** under Sign-in providers
4. Toggle it **Enabled**
5. Enter a support email (your own email)
6. Click **Save**

---

## 3. Create a Firestore database

**YOU:** In the Firebase console:

1. Click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (rules are already written)
4. Select a region close to you (e.g. `europe-west1` for Sweden)
5. Click **Enable**

---

## 4. Get your Firebase config

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

---

## 5. Update .firebaserc

**YOU:** Open `.firebaserc` and replace `REPLACE_WITH_YOUR_PROJECT_ID` with your actual Firebase project ID (the same string you used for `projectId` above).

---

## 6. Install Firebase CLI and log in

Run in this folder:

```bash
npm install -g firebase-tools
firebase login
```

**YOU:** A browser window will open — log in with the same Google account you used for the Firebase project.

---

## 7. Allow yourself to sign in

Only people listed in the `allowedUsers` collection can use the app. Add yourself **before** deploying the rules in the next step, or you'll be locked out.

**YOU:** In the Firebase console → **Firestore Database** → **Start collection**:

1. Collection ID: `allowedUsers`
2. Document ID: your email address in lowercase, e.g. `you@example.com`
3. Add any field (e.g. `name` = your name) and save

Add one document like this for each person who should have access.

---

## 8. Deploy Firestore security rules

```bash
firebase deploy --only firestore:rules
```

This locks down the database: only people in `allowedUsers` can use it, and each person can only reach their own data.

---

## 9. Icons

The app icon is in `static/`: `icon.svg`, `192.png` and `512.png` (used when installing the app) and `apple-touch-icon.png` (iPhone home screen). Replace them to use your own.

---

## 10. Test locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser. Try logging in with your Google account.

---

## 11. Build and deploy

```bash
npm run build
firebase deploy --only hosting
```

**YOU:** Firebase will print a URL like `https://your-project.web.app` — open it on your phone and install it as a PWA:

- **iPhone**: tap the Share button → "Add to Home Screen"
- **Android**: tap the browser menu → "Install app" (or a banner will appear)

---

## Ongoing deploys

Whenever you make changes:

```bash
npm run deploy
```

This builds the app and deploys it to Firebase Hosting. If you change `firestore.rules`, deploy those with `npm run deploy:rules`.

---

## Adding more users

Add a document to the `allowedUsers` collection in the Firebase console, with the person's email address in lowercase as the document ID. It works straight away, with no redeploy. To remove someone, delete their document.

---

## Resetting pill states

In the app: go to **Profil** → **Återställ alla statusar**.
This resets all inventory and prescription states back to neutral, keeping the medication list intact.
