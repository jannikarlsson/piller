<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { initAuth, userStore, authStateStore } from '$lib/stores/auth';
	import { startMedicationsSync, stopMedicationsSync } from '$lib/stores/medications';
	import { settingsStore, startSettingsSync, stopSettingsSync } from '$lib/stores/settings';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { toastMessage } from '$lib/stores/toast';
	import { setLanguage, resolveLanguage, getLanguage } from '$lib/i18n';

	let { children } = $props();

	onMount(() => {
		initAuth();
	});

	$effect(() => {
		const state = $authStateStore;
		const path = $page.url.pathname;

		if (state === 'loading') return;

		if (state === 'unauthenticated' && path !== '/login') {
			goto('/login');
		} else if (state === 'authenticated' && path === '/login') {
			goto('/inventory');
		}
	});

	$effect(() => {
		const user = $userStore;
		if (user) {
			startMedicationsSync(user.uid);
			startSettingsSync(user.uid);
		} else {
			stopMedicationsSync();
			stopSettingsSync();
		}
	});

	// Follow the phone's light/dark setting, live, for the "system" theme
	let systemPrefersDark = $state(false);
	onMount(() => {
		const query = window.matchMedia('(prefers-color-scheme: dark)');
		systemPrefersDark = query.matches;
		const onChange = (e: MediaQueryListEvent) => (systemPrefersDark = e.matches);
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	});

	const theme = $derived(
		$settingsStore.theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : $settingsStore.theme
	);

	// Switch all texts to the chosen language before the page updates
	$effect.pre(() => {
		setLanguage(resolveLanguage($settingsStore.language));
	});

	// Tell browsers and screen readers which language the page is in
	$effect(() => {
		document.documentElement.lang = getLanguage();
	});

	// Apply the theme to the page, and match the phone's status bar to the background
	$effect(() => {
		document.documentElement.dataset.theme = theme;
		const background = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-bg')
			.trim();
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
	});

	const showNav = $derived(
		$authStateStore === 'authenticated' && $page.url.pathname !== '/login'
	);
</script>

<svelte:head>
	<title>Piller</title>
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<div class="app-shell">
	{@render children()}
	{#if showNav}
		<BottomNav />
	{/if}
	{#if $toastMessage}
		<Toast message={$toastMessage} />
	{/if}
</div>

<style>
	/* Light theme (default). Dark values below override only the colours. */
	:global(:root) {
		color-scheme: light;
		--color-bg: #eef5f1;
		--color-surface: #ffffff;
		--color-text: #15181c;
		--color-text-secondary: #3f444a;
		--color-text-muted: #5b6168;
		--color-text-subtle: #6b7178;
		--color-placeholder: #8a9097;
		--color-border: #cfd3d8;
		--color-border-light: #e4e6e9;
		--color-divider: #d6e6de;
		--color-handle: #d5d8dc;
		--color-checkbox: #aeb3b9;

		--color-accent: #1d6b57;
		--color-accent-hover: #14503f;
		--color-accent-ring: rgba(29, 107, 87, 0.15);
		/* Pressed state for the button on the toast (which is dark in light mode) */
		--color-toast-pressed: rgba(255, 255, 255, 0.12);
		/* Border around the main lists */
		--color-list-border: var(--color-accent);
		--color-accent-soft: #e3eee9;
		--color-accent-tint: #cfe3da;
		/* Text and icons on accent, danger and dark backgrounds */
		--color-on-accent: #ffffff;

		--color-ok: #17624f;
		--color-ok-bg: #e7f3ee;
		--color-ok-border: #7fb49f;
		--color-danger: #a3303a;
		--color-danger-bg: #fbecec;
		--color-danger-border: #de9a9f;

		--radius-sm: 6px; /* tags, checkboxes, small buttons */
		--radius-control: 10px; /* inputs, buttons */
		--radius-card: 12px; /* cards, panels */
		--radius-lg: 16px; /* top corners of the drawer */
		--shadow-raised: 0 2px 8px rgba(21, 24, 28, 0.12);
		/* Soft glow around a focused input */
		--focus-ring: 0 0 0 3px var(--color-accent-ring);
		--backdrop: rgba(21, 24, 28, 0.4);
		--nav-height: 76px;

		--font-sans: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;

		/* Type scale in rem, so text follows the phone's text-size setting */
		--text-2xs: 0.6875rem; /* 11px – bottom menu labels */
		--text-xs: 0.8125rem; /* 13px – captions, tags */
		--text-sm: 0.875rem; /* 14px – secondary info, labels */
		--text-md: 1rem; /* 16px – body, names */
		--text-lg: 1.25rem; /* 20px – drawer and box titles */
		--text-xl: 1.75rem; /* 28px – page titles */
		--text-2xl: 2rem; /* 32px – login title */

		--leading-tight: 1.2;
		--leading-normal: 1.5;

		/* Spacing on a 4px grid: --space-N = N × 4px */
		--space-1: 4px;
		--space-2: 8px;
		--space-3: 12px;
		--space-4: 16px;
		--space-5: 20px;
		--space-6: 24px;
		--space-8: 32px;
		--space-10: 40px;

		/* Sizes */
		--size-tap: 44px; /* minimum touch target */
		--size-control: 48px; /* inputs and standard buttons */
		--size-floating-button: 48px;

		/* List rows: the same inner spacing everywhere, two minimum heights */
		--row-padding-y: var(--space-3);
		--row-padding-x: var(--space-4);
		--row-height: 56px; /* one line, e.g. checkboxes */
		--row-height-tall: 68px; /* name with strength and alternative names */

		/* Stacking order, back to front */
		--z-floating: 50; /* floating "Lägg till" button */
		--z-nav: 100;
		--z-backdrop: 200;
		--z-sheet: 201;
		--z-toast: 300;

		/* Motion */
		--transition-fast: 0.12s ease;
	}

	/*
	 * Dark theme: neutral charcoal with a muted sage accent. Green only marks what is
	 * active or chosen, so the main lists get a neutral border here.
	 */
	:global(:root[data-theme='dark']) {
		color-scheme: dark;
		--color-bg: #141516;
		--color-surface: #1c1e20;
		--color-text: #ececea;
		--color-text-secondary: #c9cac7;
		--color-text-muted: #a3a6a3;
		--color-text-subtle: #8c8f8c;
		--color-placeholder: #7a7d7a;
		--color-border: #3a3e42;
		--color-border-light: #2a2d30;
		--color-divider: #26292c;
		--color-handle: #3a3e42;
		--color-checkbox: #6f7370;

		--color-accent: #7fa796;
		--color-accent-hover: #93b5a6;
		--color-accent-ring: rgba(127, 167, 150, 0.3);
		--color-toast-pressed: rgba(0, 0, 0, 0.08);
		--color-list-border: var(--color-border-light);
		--color-accent-soft: #232b27;
		--color-accent-tint: #2f3d36;
		--color-on-accent: #111312;

		--color-ok: #8dbfa6;
		--color-ok-bg: #1e2a24;
		--color-ok-border: #3a5446;
		--color-danger: #e49a9a;
		--color-danger-bg: #2e2021;
		--color-danger-border: #5e3a3b;

		--shadow-raised: 0 2px 8px rgba(0, 0, 0, 0.5);
		--backdrop: rgba(0, 0, 0, 0.6);
	}

	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* The app shell scrolls inside each page, never the document itself */
	:global(html, body) {
		overflow: hidden;
		overscroll-behavior: none;
	}

	:global(body) {
		background: var(--color-bg);
		font-family: var(--font-sans);
		color: var(--color-text);
		-webkit-font-smoothing: antialiased;
	}

	:global(button, input, select, textarea) {
		font: inherit;
		color: inherit;
	}

	:global(button) {
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	:global(:focus-visible) {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	/* Respect the phone's "reduce motion" setting */
	@media (prefers-reduced-motion: reduce) {
		:global(*, *::before, *::after) {
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
		}
	}

	/* Text roles that repeat across the app. Components add their own layout around them. */
	:global(.text-title) {
		font-size: var(--text-lg);
		font-weight: 600;
		line-height: var(--leading-tight);
	}

	:global(.text-name) {
		font-size: var(--text-md);
		font-weight: 600;
	}

	:global(.text-body) {
		font-size: var(--text-md);
		line-height: var(--leading-normal);
	}

	:global(.text-meta) {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	:global(.text-label) {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	:global(.text-caption) {
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}

	/* Hidden visually but still read by screen readers and focusable (for inputs) */
	:global(.visually-hidden) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100dvh;
	}
</style>
