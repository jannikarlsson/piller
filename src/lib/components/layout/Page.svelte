<!--
	Frame for every page with the bottom menu: a scrolling area with the page header,
	side padding for the content, room for the menu, and a loading text while data loads.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '$lib/i18n/sv';
	import PageHeader from './PageHeader.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		/** Buttons on the right of the header. */
		actions?: Snippet;
		/** Show the loading text instead of the content. */
		loading?: boolean;
		/** Leave extra room at the bottom for a floating button. */
		floatingButton?: boolean;
		children: Snippet;
	}

	let { title, subtitle, actions, loading = false, floatingButton = false, children }: Props =
		$props();
</script>

<div class="page" class:page--floating-button={floatingButton}>
	<PageHeader {title} {subtitle} {actions} />
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
		padding-bottom: calc(var(--nav-height) + 16px + env(safe-area-inset-bottom, 0px));
	}

	.page--floating-button {
		padding-bottom: calc(var(--nav-height) + 80px + env(safe-area-inset-bottom, 0px));
	}

	.page__body {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 0 16px;
	}

	.page__loading {
		padding: 32px 4px;
		text-align: center;
		color: var(--color-text-muted);
	}
</style>
