import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../config";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch(console.error);

export function currentUid(): string {
	const uid = auth.currentUser?.uid;
	if (!uid) throw new Error('Not signed in');
	return uid;
}
