<script lang="ts">
	import '$lib/styles/tokens.css';
	import '$lib/styles/theme.css';
	import '$lib/styles/base.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { initAuth, userStore, authStateStore } from '$lib/stores/auth';
	import { startMedicationsSync, stopMedicationsSync } from '$lib/stores/medications';
	import { settingsStore, startSettingsSync, stopSettingsSync } from '$lib/stores/settings';
	import { isPathOff, HOME_PATH } from '$lib/navigation';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';
	import StartScreen from '$lib/components/layout/StartScreen.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { toastMessage } from '$lib/stores/toast';
	import { t, setLanguage, resolveLanguage, getLanguage } from '$lib/i18n';

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
			goto(HOME_PATH);
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
		$settingsStore.theme === 'system'
			? systemPrefersDark
				? 'dark'
				: 'light'
			: $settingsStore.theme
	);

	// A switched-off feature's page isn't reachable: go to the cabinet instead
	$effect(() => {
		if (isPathOff(page.url.pathname, $settingsStore)) goto(HOME_PATH, { replaceState: true });
	});

	// Switch all texts to the chosen language before the page updates
	$effect.pre(() => {
		setLanguage(resolveLanguage($settingsStore.language));
	});

	$effect(() => {
		document.documentElement.lang = getLanguage();
	});

	// Also matches the phone's status bar to the background: green on the start screen
	// (login and start-up), the normal page colour inside the app
	$effect(() => {
		document.documentElement.dataset.theme = theme;
		const token = showNav ? '--color-bg' : '--color-accent-soft';
		const background = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
	});

	/*
	 * Only show a page once sign-in is known and it's the right page for it: the login page
	 * when signed out, every other page when signed in. Otherwise show nothing (just the
	 * background) while Firebase checks or a redirect is on its way, so no page flashes.
	 */
	const isLoginPage = $derived(page.url.pathname === '/login');
	const showPage = $derived(
		isLoginPage
			? $authStateStore === 'unauthenticated'
			: $authStateStore === 'authenticated' && !isPathOff(page.url.pathname, $settingsStore)
	);
	const showNav = $derived(showPage && !isLoginPage);

	// Each route's +page.ts names its title; it follows the chosen language
	const pageTitle = $derived(
		page.data.titleKey ? `${t[page.data.titleKey].title} – ${t.app.name}` : t.app.name
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<div class="app-shell">
	{#if showPage}
		{@render children()}
	{:else if $authStateStore === 'loading'}
		<!-- The login page's green screen without text, so a slow start flows into it -->
		<div class="splash" role="status">
			<span class="visually-hidden">{t.common.loading}</span>
			<StartScreen />
		</div>
	{/if}
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

	.splash {
		display: flex;
		flex: 1;
		min-height: 0;
	}
</style>
