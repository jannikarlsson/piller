<!--
	The green screen with the cabinet illustration. The login page puts its text and button
	underneath; at start-up, while sign-in is being checked, it's shown without them. The text
	area keeps the same height either way, so the illustration doesn't move between the two.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import CabinetIllustration from './CabinetIllustration.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="start" class:start--waiting={!children}>
	<div class="start__art">
		<CabinetIllustration />
	</div>
	<div class="start__content">
		{#if children}
			{@render children()}
		{:else}
			<span class="start__spinner" aria-hidden="true"></span>
		{/if}
	</div>
</div>

<style>
	.start {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		background: var(--color-accent-soft);
	}

	/* The text sits at the bottom; the illustration fills the space above it */
	.start__art {
		flex: 1 1 auto;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: calc(var(--space-8) + env(safe-area-inset-top, 0px)) var(--space-6) 0;
	}

	/* As tall as the space allows, up to a limit; narrow screens limit it by width instead */
	.start__art :global(svg) {
		height: 100%;
		max-height: 560px;
		max-width: 100%;
	}

	/* Fades in only if checking sign-in takes a while, so a quick start shows no flash */
	.start--waiting .start__art,
	.start--waiting .start__content {
		animation: art-in 0.4s ease-out 0.3s both;
	}

	@keyframes art-in {
		from {
			opacity: 0;
		}
	}

	.start__content {
		display: flex;
		flex-direction: column;
		flex: 0 0 auto;
		/* Room for the login text and button, also when empty, so the illustration stays put */
		min-height: 15rem;
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		padding: var(--space-6) var(--space-6) calc(var(--space-10) + env(safe-area-inset-bottom, 0px));
	}

	/* A ring with one coloured quarter, turning */
	.start__spinner {
		align-self: center;
		width: 28px;
		height: 28px;
		margin-top: var(--space-4);
		border: 3px solid var(--color-accent-tint);
		border-top-color: var(--color-accent);
		border-radius: 50%;
		animation: spin 0.9s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
