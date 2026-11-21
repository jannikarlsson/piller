<!--
	Frame for every page with the bottom menu: a scrolling area with the page header,
	side padding for the content, room for the menu, and a loading text while data loads.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '$lib/i18n';
	import PageHeader from './PageHeader.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		/** Buttons on the right of the header. */
		actions?: Snippet;
		/** For sub-pages: a link back to the parent page. */
		back?: { href: string; label: string };
		/** Show the loading text instead of the content. */
		loading?: boolean;
		/** Leave extra room at the bottom for a floating button. */
		floatingButton?: boolean;
		children: Snippet;
	}

	let {
		title,
		subtitle,
		actions,
		back,
		loading = false,
		floatingButton = false,
		children
	}: Props = $props();
</script>

<div class="page" class:page--floating-button={floatingButton}>
	<PageHeader {title} {subtitle} {actions} {back} />
	<div class="page__body">
		{#if loading}
			<p class="page__loading">{t.common.loading}</p>
		{:else}
			{@render children()}
		{/if}
	</div>
</div>

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

	.page__loading {
		padding: var(--space-8) var(--space-1);
		text-align: center;
		color: var(--color-text-muted);
	}
</style>
