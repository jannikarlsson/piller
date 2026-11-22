<script lang="ts">
	import type { Medication } from '#lib/models/index.ts';

	interface Props {
		medication: Pick<Medication, 'name' | 'concentration' | 'alternativeNames' | 'description'>;
		layout?: 'stacked' | 'inline';
		alternatives?: boolean;
		done?: boolean;
	}

	let {
		medication,
		layout = 'stacked',
		alternatives = layout === 'stacked',
		done = false
	}: Props = $props();

	const showAlternatives = $derived(alternatives && medication.alternativeNames.length > 0);
	const showDescription = $derived(layout === 'stacked' && !!medication.description);
</script>

<span class="info info--{layout}" class:info--done={done}>
	<span class="info__name text-name">{medication.name}</span>
	{#if medication.concentration}
		<span class="text-meta">{medication.concentration}</span>
	{/if}
	{#if showAlternatives}
		<span class="info__alternatives text-caption">{medication.alternativeNames.join(', ')}</span>
	{/if}
	{#if showDescription}
		<span class="info__description text-caption">{medication.description}</span>
	{/if}
</span>

<style>
	.info {
		display: flex;
		min-width: 0;
	}

	.info--stacked {
		flex-direction: column;
		gap: var(--space-1);
	}

	.info--inline {
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: var(--space-2);
	}

	.info--inline .info__alternatives {
		flex-basis: 100%;
		margin-top: var(--space-1);
	}

	.info__alternatives {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.info__description {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		white-space: pre-line;
	}

	.info--done .info__name {
		color: var(--color-text-subtle);
		text-decoration: line-through;
	}
</style>
