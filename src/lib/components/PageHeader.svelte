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
		gap: 12px;
		padding: calc(32px + env(safe-area-inset-top, 0px)) 12px 20px 20px;
	}

	.page-header__title {
		font-size: 28px;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}

	.page-header__subtitle {
		margin-top: 4px;
		font-size: 15px;
		color: var(--color-text-muted);
	}
</style>
