<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { initAuth, userStore, authStateStore } from '$lib/stores/auth';
	import { startMedicationsSync, stopMedicationsSync } from '$lib/stores/medications';
	import BottomNav from '$lib/components/BottomNav.svelte';

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
		background: radial-gradient(ellipse at top, #2d0a6e 0%, #1a0533 50%, #0f0220 100%);
		min-height: 100dvh;
		font-family: 'Bricolage Grotesque', sans-serif;
		color: #ede9fe;
	}

	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100dvh;
	}
</style>
