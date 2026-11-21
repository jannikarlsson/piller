<!--
	Placeholder rows shaped like a medication list, shown while the real list loads.
	Screen readers hear "Laddar…" once instead of the grey shapes.
-->
<script lang="ts">
	import { t } from '$lib/i18n';
	import Card from './Card.svelte';

	// Varied widths so it reads as a list of different names, not a grid
	const ROWS = [
		{ name: '55%', meta: '30%', tag: true },
		{ name: '70%', meta: '40%', tag: false },
		{ name: '45%', meta: '25%', tag: true },
		{ name: '60%', meta: '35%', tag: false }
	];
</script>

<div role="status">
	<span class="visually-hidden">{t.common.loading}</span>
	<div aria-hidden="true">
		<Card list>
			{#each ROWS as row, i (i)}
				<div class="row">
					<span class="lines">
						<span class="bar bar--name" style:width={row.name}></span>
						<span class="bar bar--meta" style:width={row.meta}></span>
					</span>
					{#if row.tag}
						<span class="bar bar--tag"></span>
					{/if}
				</div>
			{/each}
		</Card>
	</div>
</div>

<style>
	.row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-3);
		min-height: var(--row-height-tall);
		padding: var(--row-padding-y) var(--row-padding-x);
	}

	.lines {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding-top: 3px;
	}

	/* Grey shapes with a soft light passing over them */
	.bar {
		display: block;
		border-radius: var(--radius-sm);
		background: linear-gradient(
			90deg,
			var(--color-border-light) 0%,
			var(--color-bg) 50%,
			var(--color-border-light) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.4s ease-in-out infinite;
	}

	.bar--name {
		height: 14px;
	}

	.bar--meta {
		height: 12px;
	}

	.bar--tag {
		flex-shrink: 0;
		width: 118px;
		height: 28px;
	}

	@keyframes shimmer {
		from {
			background-position: 100% 0;
		}
		to {
			background-position: -100% 0;
		}
	}
</style>
