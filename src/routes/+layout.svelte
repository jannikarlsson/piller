<script lang="ts">
	import '#lib/styles/tokens.css';
	import '#lib/styles/theme.css';
	import '#lib/styles/base.css';
	import { onMount } from 'svelte';
	import { dev } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { initAuth, userStore, authStateStore } from '#lib/stores/auth.ts';
	import { startMedicationsSync, stopMedicationsSync } from '#lib/stores/medications.ts';
	import { settingsStore, startSettingsSync, stopSettingsSync } from '#lib/stores/settings.ts';
	import { isPathOff, HOME_PATH } from '#lib/navigation.ts';
	import BottomNav from '#lib/components/layout/BottomNav.svelte';
	import StartScreen from '#lib/components/layout/StartScreen.svelte';
	import Toast from '#lib/components/ui/Toast.svelte';
	import { toastMessage } from '#lib/stores/toast.ts';
	import { t, setLanguage, resolveLanguage, getLanguage } from '#lib/i18n/index.ts';

	let { children } = $props();

	onMount(() => {
		initAuth();

		if (!dev) {
			import('virtual:pwa-register').then(({ registerSW }) =>
				registerSW({
					immediate: true,
					onRegisterError: (error) => console.error('Could not set up offline support', error)
				})
			);
		}
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

	$effect(() => {
		if (isPathOff(page.url.pathname, $settingsStore)) goto(HOME_PATH, { replaceState: true });
	});

	$effect.pre(() => {
		setLanguage(resolveLanguage($settingsStore.language));
	});

	$effect(() => {
		document.documentElement.lang = getLanguage();
	});

	$effect(() => {
		document.documentElement.dataset.theme = theme;
		const token = showNav ? '--color-bg' : '--color-accent-soft';
		const background = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
	});

	const isLoginPage = $derived(page.url.pathname === '/login');
	const showPage = $derived(
		isLoginPage
			? $authStateStore === 'unauthenticated'
			: $authStateStore === 'authenticated' && !isPathOff(page.url.pathname, $settingsStore)
	);
	const showNav = $derived(showPage && !isLoginPage);

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
		<div class="splash">
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
