<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		label: string;
		ariaLabel: string;
		disabled?: boolean;
		onclick: () => void;
	}

	let { label, ariaLabel, disabled = false, onclick }: Props = $props();
</script>

<button type="button" class="reset-btn" {onclick} {disabled} aria-label={ariaLabel}>
	<Icon name="reset" size={18} />
	{label}
</button>

<style>
	.reset-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 44px;
		padding: 0 12px;
		background: transparent;
		border: none;
		border-radius: var(--radius-control);
		font-size: 14px;
		font-weight: 500;
		color: var(--color-accent);
	}

	.reset-btn:active:not(:disabled) {
		background: var(--color-accent-soft);
	}

	.reset-btn:disabled {
		color: var(--color-text-subtle);
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
