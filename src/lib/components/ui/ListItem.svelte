<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		label: string;
		value?: string;
		href?: string;
		onclick?: () => void;
		tone?: 'default' | 'danger';
	}

	let { label, value, href, onclick, tone = 'default' }: Props = $props();
</script>

{#if href}
	<a class="item item--{tone}" {href}>
		<span class="item__label">{label}</span>
		{#if value}<span class="item__value text-meta">{value}</span>{/if}
		<span class="item__chevron"><Icon name="chevron-right" /></span>
	</a>
{:else}
	<button type="button" class="item item--{tone}" {onclick}>
		<span class="item__label">{label}</span>
		{#if value}<span class="item__value text-meta">{value}</span>{/if}
	</button>
{/if}

<style>
	.item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		min-height: var(--row-height);
		padding: var(--row-padding-y) var(--row-padding-x);
		background: transparent;
		border: none;
		text-align: left;
		text-decoration: none;
		color: var(--color-text);
		font-size: var(--text-md);
		-webkit-tap-highlight-color: transparent;
		transition: background-color var(--transition-fast);
	}

	.item:active {
		background: var(--color-accent-soft);
	}

	.item:focus-visible {
		outline-offset: -2px;
		border-radius: var(--radius-row-focus);
	}

	.item--danger {
		color: var(--color-danger);
	}

	.item--danger:active {
		background: var(--color-danger-bg);
	}

	.item__label {
		flex: 1;
		min-width: 0;
	}

	.item__chevron {
		display: flex;
		margin-right: calc(-1 * var(--space-1));
		color: var(--color-text-subtle);
	}
</style>
