<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '#lib/i18n/index.ts';
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
			<span class="start__spinner" role="status">
				<span class="visually-hidden">{t.common.loading}</span>
			</span>
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

	.start__art {
		flex: 1 1 auto;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: calc(var(--space-8) + env(safe-area-inset-top, 0px)) var(--space-6) 0;
	}

	.start__art :global(svg) {
		height: 100%;
		max-height: 560px;
		max-width: 100%;
	}

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
		min-height: 15rem;
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		padding: var(--space-6) var(--space-6) calc(var(--space-10) + env(safe-area-inset-bottom, 0px));
	}

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
