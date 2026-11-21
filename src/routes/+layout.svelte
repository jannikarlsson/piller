<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { initAuth, userStore, authStateStore } from '$lib/stores/auth';
	import { startMedicationsSync, stopMedicationsSync } from '$lib/stores/medications';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';

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
		} else {
			stopMedicationsSync();
		}
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
</div>

<style>
	:global(:root) {
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
		--color-accent-soft: #e3eee9;
		--color-accent-tint: #cfe3da;

		--color-ok: #17624f;
		--color-ok-bg: #e7f3ee;
		--color-ok-border: #7fb49f;
		--color-danger: #a3303a;
		--color-danger-bg: #fbecec;
		--color-danger-border: #de9a9f;

		--radius-card: 12px;
		--radius-control: 10px;
		--shadow-raised: 0 2px 8px rgba(21, 24, 28, 0.12);
		--backdrop: rgba(21, 24, 28, 0.4);
		--nav-height: 76px;

		--font-sans: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
	}

	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(html, body) {
		height: 100%;
		overflow: hidden;
		overscroll-behavior: none;
	}

	:global(body) {
		background: var(--color-bg);
		min-height: 100dvh;
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

	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100dvh;
	}
</style>
