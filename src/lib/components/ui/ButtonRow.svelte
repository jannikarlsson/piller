<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="button-row">
	{@render children()}
</div>

<style>
	.button-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
		padding-top: var(--space-1);
	}
</style>
