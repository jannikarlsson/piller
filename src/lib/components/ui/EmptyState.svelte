<script lang="ts">
	import Icon, { type IconName } from './Icon.svelte';
	import Button from './Button.svelte';
	import Card from './Card.svelte';

	interface Props {
		icon: IconName;
		message: string;
		actionLabel?: string;
		actionHref?: string;
	}

	let { icon, message, actionLabel, actionHref }: Props = $props();
</script>

<Card padding="lg">
	<div class="empty">
		<span class="empty__icon"><Icon name={icon} size="xl" /></span>
		<p>{message}</p>
		{#if actionLabel && actionHref}
			<span class="empty__action">
				<Button size="sm" href={actionHref}>{actionLabel}</Button>
			</span>
		{/if}
	</div>
</Card>

<style>
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		text-align: center;
		color: var(--color-text-muted);
	}

	.empty__icon {
		color: var(--color-accent);
	}

	.empty__action {
		margin-top: var(--space-1);
	}
</style>
