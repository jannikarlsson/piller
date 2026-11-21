<!--
	A white, rounded box with a thin border.
	- list: for a list of rows. Adds a divider between each child and no padding (the rows
	  bring their own). Use `as="ul"` when the children are <li>.
	- padding: inner space for non-list content.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		list?: boolean;
		padding?: 'none' | 'md' | 'lg';
		as?: 'div' | 'ul';
		children: Snippet;
	}

	let {
		list = false,
		padding = 'none',
		as = 'div',
		children
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class="card card--padding-{padding}"
	class:card--list={list}
>
	{@render children()}
</svelte:element>

<style>
	.card {
		list-style: none;
		background: var(--color-surface);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-card);
	}

	.card--list {
		overflow: hidden;
	}

	/* Doubled class so the divider wins over rows that reset their own border (buttons) */
	.card.card--list > :global(* + *) {
		border-top: 1px solid var(--color-border-light);
	}

	.card--padding-md {
		padding: var(--space-4);
	}

	.card--padding-lg {
		padding: var(--space-10) var(--space-6);
	}
</style>
