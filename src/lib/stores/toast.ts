import { writable } from 'svelte/store';
import { t } from '$lib/i18n';

/** The one toast message shown above the bottom menu (rendered in the root layout). */
export const toastMessage = writable<string | null>(null);

const TOAST_MS = 4000;
let timer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string) {
	clearTimeout(timer);
	toastMessage.set(message);
	timer = setTimeout(() => toastMessage.set(null), TOAST_MS);
}

/**
 * Run a save and show an error toast if it fails. Returns whether it succeeded,
 * so callers can skip follow-up steps after a failure.
 */
export async function withErrorToast(
	action: () => Promise<unknown>,
	errorMessage: string = t.errors.updateFailed
): Promise<boolean> {
	try {
		await action();
		return true;
	} catch (e) {
		console.error(e);
		showToast(errorMessage);
		return false;
	}
}
