<script lang="ts">
	import '$lib/styles/tokens.css';
	import '$lib/styles/theme.css';
	import '$lib/styles/base.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { initAuth, userStore, authStateStore } from '$lib/stores/auth';
	import { startMedicationsSync, stopMedicationsSync } from '$lib/stores/medications';
	import {
		settingsStore,
		startSettingsSync,
		stopSettingsSync,
		isFeatureOn,
		FEATURE_ROUTES,
		type Feature
	} from '$lib/stores/settings';
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
		const path = page.url.pathname;

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

	// A switched-off feature's page isn't reachable: go to the cabinet instead
	$effect(() => {
		const path = page.url.pathname;
		const off = (Object.keys(FEATURE_ROUTES) as Feature[]).some(
			(feature) =>
				!isFeatureOn($settingsStore, feature) &&
				(path === FEATURE_ROUTES[feature] || path.startsWith(`${FEATURE_ROUTES[feature]}/`))
		);
		if (off) goto('/inventory', { replaceState: true });
	});

	// Switch all texts to the chosen language before the page updates
	$effect.pre(() => {
		setLanguage(resolveLanguage($settingsStore.language));
	});

	$effect(() => {
		document.documentElement.lang = getLanguage();
	});

	// Also matches the phone's status bar to the page background
	$effect(() => {
		document.documentElement.dataset.theme = theme;
		const background = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-bg')
			.trim();
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
	});

	const showNav = $derived(
		$authStateStore === 'authenticated' && page.url.pathname !== '/login'
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
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100dvh;
	}
</style>
