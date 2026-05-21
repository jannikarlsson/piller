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

**YOU:** Open `src/lib/config.ts` and replace the placeholder values:

```ts
export const firebaseConfig = {
  apiKey: "AIza...",               // ← paste your values here
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123...:web:abc..."
};
```

Also add your email address to the allowlist:

```ts
export const ALLOWED_EMAILS: string[] = [
  'jannikarlsson@gmail.com',  // ← your email
  // add more if needed
];
```

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

## 7. Deploy Firestore security rules

```bash
firebase deploy --only firestore:rules
```

This locks down the database so users can only access their own data.

---

## 8. Add your icon

**YOU:** Create two PNG files from your icon design:
- `static/icon-192.png` — 192×192 pixels
- `static/icon-512.png` — 512×512 pixels

There is a placeholder SVG at `static/icon-placeholder.svg` you can use as a reference for sizing. Until you add real icons, the PWA install prompt will use a default icon.

---

## 9. Test locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser. Try logging in with your Google account.

---

## 10. Build and deploy

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
npm run build && firebase deploy --only hosting
```

---

## Adding more users

Open `src/lib/config.ts` and add email addresses to `ALLOWED_EMAILS`, then redeploy.

---

## Resetting pill states

In the app: go to **Läkemedel** (💊 tab) → tap ⚙️ → **Återställ allt**.
This resets all inventory and prescription states back to neutral, keeping the medication list intact.
