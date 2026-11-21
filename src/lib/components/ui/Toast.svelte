<script lang="ts">
	interface Props {
		message: string;
		actionLabel?: string;
		onaction?: () => void;
	}

	let { message, actionLabel, onaction }: Props = $props();
</script>

<div class="toast" role="status">
	<span class="toast__message">{message}</span>
	{#if actionLabel && onaction}
		<button type="button" class="toast__action" onclick={onaction}>{actionLabel}</button>
	{/if}
</div>

<style>
	.toast {
		position: fixed;
		bottom: calc(var(--nav-height) + var(--space-4) + env(safe-area-inset-bottom, 0px));
		left: var(--space-4);
		right: var(--space-4);
		max-width: 480px;
		margin: 0 auto;
		min-height: var(--size-control);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-1) var(--space-1) var(--space-1) var(--space-4);
		background: var(--color-text);
		color: var(--color-on-accent);
		font-size: var(--text-sm);
		font-weight: 500;
		border-radius: var(--radius-control);
		box-shadow: var(--shadow-raised);
		z-index: var(--z-toast);
	}

	.toast__message {
		padding: var(--space-2) 0;
		line-height: var(--leading-normal);
	}

	.toast__action {
		flex-shrink: 0;
		height: 36px;
		padding: 0 var(--space-3);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		color: var(--color-accent-tint);
		font-size: var(--text-sm);
		font-weight: 600;
	}

	.toast__action:active {
		background: var(--color-toast-pressed);
	}
</style>
