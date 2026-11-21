<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		actions?: Snippet;
	}
	let { title, subtitle, actions }: Props = $props();
</script>

<header class="page-header">
	<div class="page-header__text">
		<h1 class="page-header__title">{title}</h1>
		{#if subtitle}
			<p class="page-header__subtitle">{subtitle}</p>
		{/if}
	</div>
	{#if actions}
		<div class="page-header__actions">{@render actions()}</div>
	{/if}
</header>

<style>
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-3);
		padding: calc(var(--space-8) + env(safe-area-inset-top, 0px)) var(--space-3) var(--space-5) var(--space-5);
	}

	.page-header__title {
		font-size: var(--text-xl);
		font-weight: 600;
		line-height: var(--leading-tight);
		letter-spacing: -0.01em;
	}

	.page-header__subtitle {
		margin-top: var(--space-1);
		font-size: var(--text-md);
		color: var(--color-text-muted);
	}
</style>
