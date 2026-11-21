<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		actions?: Snippet;
		back?: { href: string; label: string };
	}
	let { title, subtitle, actions, back }: Props = $props();
</script>

{#if back}
	<div class="page-header__back">
		<Button variant="ghost" size="sm" href={back.href}>
			<Icon name="chevron-left" />
			{back.label}
		</Button>
	</div>
{/if}
<header class="page-header" class:page-header--sub={back}>
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

	.page-header__back {
		padding: calc(var(--space-3) + env(safe-area-inset-top, 0px)) var(--space-3) 0;
	}

	.page-header--sub {
		padding-top: var(--space-1);
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
