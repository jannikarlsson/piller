<!--
	Frame for every page with the bottom menu: a scrolling area with the page header,
	side padding for the content, room for the menu, and a loading text while data loads.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from './PageHeader.svelte';
	import ListSkeleton from '$lib/components/ui/ListSkeleton.svelte';

	interface Props {
		title: string;
		actions?: Snippet;
		back?: { href: string; label: string };
		loading?: boolean;
		floatingButton?: boolean;
		children: Snippet;
	}

	let {
		title,
		actions,
		back,
		loading = false,
		floatingButton = false,
		children
	}: Props = $props();
</script>

<main class="page" class:page--floating-button={floatingButton}>
	<PageHeader {title} {actions} {back} />
	<div class="page__body">
		{#if loading}
			<ListSkeleton />
		{:else}
			{@render children()}
		{/if}
	</div>
</main>

<style>
	.page {
		flex: 1;
		overflow-y: auto;
		padding-bottom: calc(var(--nav-height) + var(--space-4) + env(safe-area-inset-bottom, 0px));
	}

	.page--floating-button {
		padding-bottom: calc(var(--nav-height) + var(--size-floating-button) + var(--space-8) + env(safe-area-inset-bottom, 0px));
	}

	.page__body {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: 0 var(--space-4);
	}
</style>
