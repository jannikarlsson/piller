declare global {
	namespace App {
		interface PageData {
			/**
			 * The page's title, as a key in the texts: the browser tab shows `t[key].title – Piller`.
			 * Set in each route's +page.ts; +layout.svelte renders it. Pages without one show "Piller".
			 */
			titleKey?: 'inventory' | 'prescription' | 'picking' | 'actions' | 'profile' | 'medications';
		}
	}
}

export {};
