<!-- A titled group on a page, e.g. "Köp" on Att göra or "Konto" on Profil. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		/** Shown on the right of the title, e.g. how many items are left. */
		count?: number;
		children: Snippet;
	}

	let { title, count, children }: Props = $props();

	const headingId = $props.id();
</script>

<section class="section" aria-labelledby={headingId}>
	<h2 class="section__heading text-label" id={headingId}>
		{title}
		{#if count !== undefined}
			<span class="text-caption">{count}</span>
		{/if}
	</h2>
	{@render children()}
</section>

<style>
	.section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.section__heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 0 var(--space-1);
	}
</style>
