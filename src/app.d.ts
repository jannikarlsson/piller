// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			/**
			 * The page's title, as a key in the texts: the browser tab shows `t[key].title – Piller`.
			 * Set in each route's +page.ts; +layout.svelte renders it. Pages without one show "Piller".
			 */
			titleKey?: 'inventory' | 'prescription' | 'picking' | 'actions' | 'profile' | 'medications';
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
