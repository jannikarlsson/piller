<!--
	A full-width checkbox row. Pass `label` for plain text, or children for richer content
	(the parent can style that content based on `checked`).
	Use `bind:checked` in forms, or `checked` + `onchange` when the value is saved elsewhere.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	interface Props {
		checked: boolean;
		label?: string;
		onchange?: (checked: boolean) => void;
		children?: Snippet;
	}

	let { checked = $bindable(), label, onchange, children }: Props = $props();
</script>

<label class="checkbox" class:checkbox--checked={checked}>
	<input
		type="checkbox"
		class="visually-hidden"
		bind:checked
		onchange={() => onchange?.(checked)}
	/>
	<span class="checkbox__box" aria-hidden="true">
		{#if checked}
			<Icon name="check" size="sm" weight="bold" />
		{/if}
	</span>
	<span class="checkbox__content">
		{#if children}
			{@render children()}
		{:else}
			{label}
		{/if}
	</span>
</label>

<style>
	.checkbox {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: 56px;
		padding: var(--space-2) var(--space-4);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition: background-color var(--transition-fast);
	}

	.checkbox:active {
		background: var(--color-accent-soft);
	}

	.checkbox__box {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1.5px solid var(--color-checkbox);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-on-accent);
		transition:
			background-color var(--transition-fast),
			border-color var(--transition-fast);
	}

	input:focus-visible + .checkbox__box {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.checkbox--checked .checkbox__box {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.checkbox__content {
		min-width: 0;
		font-size: var(--text-md);
		line-height: var(--leading-normal);
	}
</style>
