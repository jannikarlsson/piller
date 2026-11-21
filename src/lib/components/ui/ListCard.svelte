<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		as?: 'div' | 'ul';
		children: Snippet;
	}

	let { as = 'div', children }: Props = $props();
</script>

<svelte:element this={as} class="list-card">
	{@render children()}
</svelte:element>

<style>
	.list-card {
		list-style: none;
		background: var(--color-surface);
		border: 1.5px solid var(--color-accent);
		border-radius: var(--radius-card);
		overflow: hidden;
	}

	/* Rows inside the card are separated by thin dividers */
	.list-card > :global(* + *) {
		border-top: 1px solid var(--color-divider);
	}
</style>
