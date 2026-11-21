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
		bottom: calc(var(--nav-height) + 16px + env(safe-area-inset-bottom, 0px));
		left: 16px;
		right: 16px;
		max-width: 480px;
		margin: 0 auto;
		min-height: 48px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 6px 6px 6px 16px;
		background: var(--color-text);
		color: var(--color-on-accent);
		font-size: var(--text-sm);
		font-weight: 500;
		border-radius: var(--radius-control);
		box-shadow: var(--shadow-raised);
		z-index: 300;
	}

	.toast__message {
		padding: 6px 0;
		line-height: var(--leading-normal);
	}

	.toast__action {
		flex-shrink: 0;
		height: 36px;
		padding: 0 12px;
		background: transparent;
		border: none;
		border-radius: 8px;
		color: var(--color-accent-tint);
		font-size: var(--text-sm);
		font-weight: 600;
	}

	.toast__action:active {
		background: rgba(255, 255, 255, 0.12);
	}
</style>
