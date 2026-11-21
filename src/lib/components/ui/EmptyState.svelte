<!-- Shown instead of a list when there is nothing to show, optionally with a link to act on it. -->
<script lang="ts">
	import Icon, { type IconName } from './Icon.svelte';
	import Button from './Button.svelte';

	interface Props {
		icon: IconName;
		message: string;
		actionLabel?: string;
		actionHref?: string;
	}

	let { icon, message, actionLabel, actionHref }: Props = $props();
</script>

<div class="empty">
	<span class="empty__icon"><Icon name={icon} size={32} /></span>
	<p>{message}</p>
	{#if actionLabel && actionHref}
		<span class="empty__action">
			<Button size="sm" href={actionHref}>{actionLabel}</Button>
		</span>
	{/if}
</div>

<style>
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-10) var(--space-6);
		text-align: center;
		background: var(--color-surface);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-card);
		color: var(--color-text-muted);
	}

	.empty__icon {
		color: var(--color-accent);
	}

	.empty__action {
		margin-top: var(--space-1);
	}
</style>
