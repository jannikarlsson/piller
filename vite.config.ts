import adapter from '@sveltejs/adapter-static';
import { withPwa } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		withPwa(
			{
				adapter: adapter({
					pages: 'build',
					assets: 'build',
					fallback: 'index.html',
					precompress: false,
					strict: false
				}),
				// Runes everywhere except in dependencies, which may still be written for Svelte 4
				compilerOptions: {
					runes: ({ filename }) => (filename.includes('node_modules') ? undefined : true)
				}
			},
			// PWA: the service worker that makes the app open offline, and the install manifest.
			// The worker is registered from +layout.svelte (the plugin can't do it for SvelteKit).
			{
				// A single-page app: every address is answered with index.html, from the cache when offline
				kit: { adapterFallback: 'index.html', spa: true },
				registerType: 'autoUpdate',
				// Register /sw.js for the whole site, whatever address the app was opened at
				base: '/',
				scope: '/',
				manifest: {
					name: 'Piller',
					short_name: 'Piller',
					description: 'Hantera ditt förråd',
					theme_color: '#EEF5F1',
					background_color: '#EEF5F1',
					display: 'standalone',
					scope: '/',
					start_url: '/',
					icons: [
						{
							src: '192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: '512.png',
							sizes: '512x512',
							type: 'image/png'
						},
						{
							src: '512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable'
						}
					]
				},
				generateSW: {
					// Piller has no prerendered pages (only the index.html fallback), so that pattern is empty
					globStrict: false,
					// Google sign-in opens pages under /__/auth/ that Firebase Hosting serves. If the worker
					// answered those with index.html, signing in would break.
					navigateFallbackDenylist: [/^\/__\//],
					runtimeCaching: [
						// The font stylesheet and the font files, so text keeps its font offline
						{
							urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'google-fonts-styles',
								expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
								cacheableResponse: { statuses: [0, 200] }
							}
						},
						{
							urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'google-fonts-files',
								expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
								cacheableResponse: { statuses: [0, 200] }
							}
						}
					]
				}
			}
		)
	],
	test: {
		include: ['src/**/*.test.ts']
	}
});
