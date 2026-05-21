import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: { enabled: true },
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon-placeholder.png'],
			manifest: {
				name: 'Piller',
				short_name: 'Piller',
				description: 'Hantera ditt förråd',
				theme_color: '#7C3AED',
				background_color: '#1a0533',
				display: 'standalone',
				orientation: 'portrait',
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
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-cache',
							expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
							cacheableResponse: { statuses: [0, 200] }
						}
					}
				]
			}
		})
	]
});
