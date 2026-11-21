<!--
	A medication's name and details, as shown in list rows.
	- stacked: name, strength and alternative names on separate lines (cabinet, prescriptions, list).
	- inline: name and strength on one line, for checklists; `done` strikes the name through.
-->
<script lang="ts">
	import type { Medication } from '$lib/models';

	interface Props {
		medication: Pick<Medication, 'name' | 'concentration' | 'alternativeNames'>;
		layout?: 'stacked' | 'inline';
		done?: boolean;
	}

	let { medication, layout = 'stacked', done = false }: Props = $props();

	const showAlternatives = $derived(
		layout === 'stacked' && medication.alternativeNames.length > 0
	);
</script>

<span class="info info--{layout}" class:info--done={done}>
	<span class="info__name text-name">{medication.name}</span>
	{#if medication.concentration}
		<span class="text-meta">{medication.concentration}</span>
	{/if}
	{#if showAlternatives}
		<span class="info__alternatives text-caption">{medication.alternativeNames.join(', ')}</span>
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

	/* Long lists of alternative names are cut off rather than making the row taller */
	.info__alternatives {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.info--done .info__name {
		color: var(--color-text-subtle);
		text-decoration: line-through;
	}
</style>
