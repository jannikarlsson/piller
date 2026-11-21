<!--
	A white, rounded box.
	- variant: `default` has a thin grey border, `accent` a green one (the main lists on each page).
	- list: for a list of rows. Adds a divider between each child and no padding (the rows
	  bring their own). Use `as="ul"` when the children are <li>.
	- padding: inner space for non-list content.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'accent';
		list?: boolean;
		padding?: 'none' | 'md' | 'lg';
		as?: 'div' | 'ul' | 'section';
		children: Snippet;
	}

	let {
		variant = 'default',
		list = false,
		padding = 'none',
		as = 'div',
		children
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class="card card--{variant} card--padding-{padding}"
	class:card--list={list}
>
	{@render children()}
</svelte:element>

<style>
	.card {
		list-style: none;
		background: var(--color-surface);
		border-radius: var(--radius-card);
	}

	.card--default {
		border: 1px solid var(--color-border-light);
	}

	.card--accent {
		border: 1.5px solid var(--color-list-border);
	}

	.card--list {
		overflow: hidden;
	}

	.card--list > :global(* + *) {
		border-top: 1px solid var(--color-divider);
	}

	.card--padding-md {
		padding: var(--space-4);
	}

	.card--padding-lg {
		padding: var(--space-10) var(--space-6);
	}
</style>
