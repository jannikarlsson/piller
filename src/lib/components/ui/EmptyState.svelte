<!--
	A centred box for when a page has nothing to list.
	- tone `ok`: a green tick in a circle, for "all done" rather than "nothing here yet".
	- title: an optional heading above the message.
-->
<script lang="ts">
	import Icon, { type IconName } from './Icon.svelte';
	import Button from './Button.svelte';
	import Card from './Card.svelte';

	interface Props {
		icon: IconName;
		message: string;
		title?: string;
		tone?: 'default' | 'ok';
		actionLabel?: string;
		actionHref?: string;
	}

	let { icon, message, title, tone = 'default', actionLabel, actionHref }: Props = $props();
</script>

<Card padding="lg">
	<div class="empty">
		{#if tone === 'ok'}
			<span class="empty__icon empty__icon--ok"><Icon name={icon} size="lg" weight="bold" /></span>
		{:else}
			<span class="empty__icon"><Icon name={icon} size="xl" /></span>
		{/if}
		{#if title}
			<p class="empty__title text-title">{title}</p>
		{/if}
		<p class="empty__message">{message}</p>
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

	.empty__icon--ok {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--size-control);
		height: var(--size-control);
		border-radius: 50%;
		background: var(--color-ok-bg);
		color: var(--color-ok);
	}

	.empty__title {
		color: var(--color-text);
	}

	/* A title makes the message a subtitle under it */
	.empty__title + .empty__message {
		margin-top: calc(-1 * var(--space-1));
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
	}

	.empty__action {
		margin-top: var(--space-1);
	}
</style>
