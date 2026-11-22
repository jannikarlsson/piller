import { writable } from 'svelte/store';
import { t } from '#lib/i18n/index.ts';

export const toastMessage = writable<string | null>(null);

const TOAST_MS = 4000;
let timer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string) {
	clearTimeout(timer);
	toastMessage.set(message);
	timer = setTimeout(() => toastMessage.set(null), TOAST_MS);
}

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
