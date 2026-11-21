// Types for the module that @vite-pwa/sveltekit creates at build time (see vite.config.ts)
declare module 'virtual:pwa-register' {
	export interface RegisterSWOptions {
		/** Register straight away instead of waiting for the page's load event. */
		immediate?: boolean;
		onRegisterError?: (error: unknown) => void;
	}

	export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}
