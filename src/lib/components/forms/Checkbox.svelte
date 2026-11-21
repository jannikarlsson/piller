<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		label: string;
		checked: boolean;
	}

	let { label, checked = $bindable() }: Props = $props();
</script>

<label class="checkbox" class:checkbox--checked={checked}>
	<input type="checkbox" class="checkbox__input" bind:checked />
	<span class="checkbox__box" aria-hidden="true">
		{#if checked}
			<Icon name="check" size={16} strokeWidth={2.5} />
		{/if}
	</span>
	<span class="checkbox__label">{label}</span>
</label>

<style>
	.checkbox {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 48px;
		padding: 8px 14px;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	/* Native checkbox stays focusable and accessible; the box below is its visual */
	.checkbox__input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}

	.checkbox__box {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1.5px solid var(--color-checkbox);
		border-radius: 6px;
		background: var(--color-surface);
		color: #ffffff;
		transition:
			background-color 0.12s ease,
			border-color 0.12s ease;
	}

	.checkbox__input:focus-visible + .checkbox__box {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.checkbox--checked .checkbox__box {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.checkbox__label {
		font-size: 15px;
		line-height: 1.35;
	}
</style>
